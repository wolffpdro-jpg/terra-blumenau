"use client";

import React, { useEffect, useRef, useState } from "react";
import { PROPERTY_POLYGON_VERTICES } from "@/data/propertyData";
import {
  Box,
  Compass,
  Download,
  Eye,
  Layers,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

type BlueprintMode = "3d" | "2d";
type SurfaceColorMode = "elevation" | "zoning";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

// Point-in-polygon check in 2D (x, y)
function isPointInPolygon(x: number, y: number, poly: { x: number; y: number }[]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x,
      yi = poly[i].y;
    const xj = poly[j].x,
      yj = poly[j].y;
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 1e-9) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// Elevation function (30m to 60m) matching the planialtimetric contours (W -> ESE slope)
function getTerrainElevationMeters(xMeters: number, yMeters: number): number {
  // xMeters in [-72, +72], yMeters in [-72, +72]
  // Lowest ~30m on West/Central-West, climbing to 60m on East/Southeast (Frieda Beck)
  const normE = (xMeters + 65) / 135; // 0 at west, 1 at east
  const normS = (55 - yMeters) / 130; // 0 at north, 1 at south
  const t = Math.max(0, Math.min(1, normE * 0.78 + normS * 0.25));
  const curved = Math.pow(t, 1.15);
  return 30 + curved * 30;
}

export function TopographicBlueprint() {
  const [viewMode, setViewMode] = useState<BlueprintMode>("2d");
  const [surfaceMode, setSurfaceMode] = useState<SurfaceColorMode>("elevation");
  const [showFloodPlane, setShowFloodPlane] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [yawDeg, setYawDeg] = useState(-38);
  const [pitchDeg, setPitchDeg] = useState(48);
  const [exaggeration, setExaggeration] = useState(1.6);

  const [highlightContours, setHighlightContours] = useState(true);
  const [highlightDimensions, setHighlightDimensions] = useState(true);
  const [selectedElevation, setSelectedElevation] = useState<number | null>(45);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const yawRef = useRef(yawDeg);
  const pitchRef = useRef(pitchDeg);

  useEffect(() => {
    yawRef.current = yawDeg;
  }, [yawDeg]);

  useEffect(() => {
    pitchRef.current = pitchDeg;
  }, [pitchDeg]);

  // Auto-rotation loop for 3D Maquete
  useEffect(() => {
    if (viewMode !== "3d" || !autoRotate) return;
    let animId: number;
    const step = () => {
      if (!isDraggingRef.current) {
        setYawDeg((prev) => (prev + 0.22) % 360);
      }
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [viewMode, autoRotate]);

  // Render 3D Maquete on Canvas
  useEffect(() => {
    if (viewMode !== "3d") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const width = canvas.clientWidth || 760;
    const height = canvas.clientHeight || 520;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    // Center UTM coordinates (E 691185, N 7027934)
    const centerE = 691185;
    const centerN = 7027934;

    const poly2D = PROPERTY_POLYGON_VERTICES.map((v) => ({
      x: (v.utmE || centerE) - centerE,
      y: (v.utmN || centerN) - centerN,
      label: v.label || "",
    }));

    const yawRad = (yawDeg * Math.PI) / 180;
    const pitchRad = (pitchDeg * Math.PI) / 180;
    const cosY = Math.cos(yawRad);
    const sinY = Math.sin(yawRad);
    const cosP = Math.cos(pitchRad);
    const sinP = Math.sin(pitchRad);

    const scale = Math.min(width, height) / 185;
    const cx = width * 0.5;
    const cy = height * 0.56;

    const project = (pt: Point3D) => {
      // Rotate around Z axis (yaw)
      const rx = pt.x * cosY - pt.y * sinY;
      const ry = pt.x * sinY + pt.y * cosY;
      const rz = (pt.z - 30) * exaggeration;

      // Tilt by pitch (0 deg = horizontal side view, 90 deg = top-down plan view)
      const screenX = cx + rx * scale;
      const screenY = cy - ry * sinP * scale - rz * cosP * scale;
      const depth = ry * cosP - rz * sinP;
      return { x: screenX, y: screenY, depth };
    };

    // 1. Draw 3D Reference Base Grid (at Cota 12m Flood Level if enabled, or Cota 25m)
    const baseZ = showFloodPlane ? 12 : 26;
    ctx.lineWidth = 1;
    for (let g = -80; g <= 80; g += 20) {
      const p1 = project({ x: g, y: -80, z: baseZ });
      const p2 = project({ x: g, y: 80, z: baseZ });
      ctx.strokeStyle = showFloodPlane
        ? "rgba(78, 168, 222, 0.16)"
        : "rgba(197, 155, 109, 0.12)";
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      const q1 = project({ x: -80, y: g, z: baseZ });
      const q2 = project({ x: 80, y: g, z: baseZ });
      ctx.beginPath();
      ctx.moveTo(q1.x, q1.y);
      ctx.lineTo(q2.x, q2.y);
      ctx.stroke();
    }

    if (showFloodPlane) {
      const fpCorner = project({ x: -78, y: -78, z: 12 });
      ctx.fillStyle = "rgba(78, 168, 222, 0.85)";
      ctx.font = "600 10px monospace";
      ctx.fillText(
        "PLANO COTA DE ENCHENTE BLUMENAU (12m) — TERRENO 18m A 48m ACIMA",
        fpCorner.x + 6,
        fpCorner.y - 4
      );
    }

    // 2. Draw Vertical Drop Pillars from Property Vertices down to Base Plane
    ctx.strokeStyle = "rgba(197, 155, 109, 0.25)";
    ctx.setLineDash([3, 3]);
    poly2D.forEach((v) => {
      const zTop = getTerrainElevationMeters(v.x, v.y);
      const topPt = project({ x: v.x, y: v.y, z: zTop });
      const botPt = project({ x: v.x, y: v.y, z: baseZ });
      ctx.beginPath();
      ctx.moveTo(topPt.x, topPt.y);
      ctx.lineTo(botPt.x, botPt.y);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // 3. Generate & Sort 3D Terrain Surface Quads inside the Property Polygon
    const stepSize = 5.5;
    const quads: {
      pts: { x: number; y: number }[];
      depth: number;
      avgZ: number;
      avgX: number;
      avgY: number;
    }[] = [];

    for (let gx = -75; gx <= 75; gx += stepSize) {
      for (let gy = -75; gy <= 75; gy += stepSize) {
        const midX = gx + stepSize * 0.5;
        const midY = gy + stepSize * 0.5;
        if (!isPointInPolygon(midX, midY, poly2D)) continue;

        const c1 = { x: gx, y: gy, z: getTerrainElevationMeters(gx, gy) };
        const c2 = {
          x: gx + stepSize,
          y: gy,
          z: getTerrainElevationMeters(gx + stepSize, gy),
        };
        const c3 = {
          x: gx + stepSize,
          y: gy + stepSize,
          z: getTerrainElevationMeters(gx + stepSize, gy + stepSize),
        };
        const c4 = {
          x: gx,
          y: gy + stepSize,
          z: getTerrainElevationMeters(gx, gy + stepSize),
        };

        const p1 = project(c1);
        const p2 = project(c2);
        const p3 = project(c3);
        const p4 = project(c4);

        const avgDepth = (p1.depth + p2.depth + p3.depth + p4.depth) * 0.25;
        const avgZ = (c1.z + c2.z + c3.z + c4.z) * 0.25;

        quads.push({
          pts: [p1, p2, p3, p4],
          depth: avgDepth,
          avgZ,
          avgX: midX,
          avgY: midY,
        });
      }
    }

    // Painter's algorithm sort (back to front)
    quads.sort((a, b) => b.depth - a.depth);

    quads.forEach((q) => {
      ctx.beginPath();
      ctx.moveTo(q.pts[0].x, q.pts[0].y);
      ctx.lineTo(q.pts[1].x, q.pts[1].y);
      ctx.lineTo(q.pts[2].x, q.pts[2].y);
      ctx.lineTo(q.pts[3].x, q.pts[3].y);
      ctx.closePath();

      const isSelectedBand =
        selectedElevation !== null &&
        Math.abs(q.avgZ - selectedElevation) < 2.2;

      if (isSelectedBand) {
        ctx.fillStyle = "rgba(244, 208, 111, 0.88)";
        ctx.strokeStyle = "rgba(244, 208, 111, 1)";
      } else if (surfaceMode === "zoning") {
        // ZI-1 on West/South vs ZOC on Central/East
        const isZI1 = q.avgX < -28 || q.avgY < -44;
        ctx.fillStyle = isZI1
          ? "rgba(197, 155, 109, 0.65)"
          : "rgba(64, 145, 108, 0.62)";
        ctx.strokeStyle = isZI1
          ? "rgba(244, 208, 111, 0.35)"
          : "rgba(82, 183, 136, 0.35)";
      } else {
        // Elevation gradient (30m deep emerald -> 60m warm bronze/gold)
        const t = Math.max(0, Math.min(1, (q.avgZ - 30) / 30));
        const r = Math.round(32 + t * 175);
        const g = Math.round(95 + t * 72);
        const b = Math.round(72 + t * 30);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.72)`;
        ctx.strokeStyle = `rgba(247, 245, 240, 0.14)`;
      }

      ctx.fill();
      ctx.lineWidth = 0.7;
      ctx.stroke();
    });

    // 4. Draw 3D Perimeter Boundary & Highlighted Street Frontages
    ctx.lineWidth = 3;
    for (let i = 0; i < poly2D.length; i++) {
      const curr = poly2D[i];
      const next = poly2D[(i + 1) % poly2D.length];
      const pA = project({
        x: curr.x,
        y: curr.y,
        z: getTerrainElevationMeters(curr.x, curr.y) + 0.5,
      });
      const pB = project({
        x: next.x,
        y: next.y,
        z: getTerrainElevationMeters(next.x, next.y) + 0.5,
      });

      // Determine segment type
      const isRua1DeJaneiro = i === 0 || i === 20 || i === 21;
      const isFriedaBeck =
        i === 1 || i === 2 || (i >= 6 && i <= 16);

      ctx.strokeStyle = isRua1DeJaneiro
        ? "#F4D06F"
        : isFriedaBeck
        ? "#52B788"
        : "#C59B6D";
      ctx.lineWidth = isRua1DeJaneiro || isFriedaBeck ? 3.5 : 2;

      ctx.beginPath();
      ctx.moveTo(pA.x, pA.y);
      ctx.lineTo(pB.x, pB.y);
      ctx.stroke();
    }

    // 5. Draw 3D Floating Reference Pins & Labels
    const drawPin3D = (
      x: number,
      y: number,
      zOffset: number,
      title: string,
      subtitle: string,
      color: string
    ) => {
      const groundZ = getTerrainElevationMeters(x, y);
      const pGround = project({ x, y, z: groundZ });
      const pTop = project({ x, y, z: groundZ + zOffset });

      // Stem line
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pGround.x, pGround.y);
      ctx.lineTo(pTop.x, pTop.y);
      ctx.stroke();

      // Ground dot
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(pGround.x, pGround.y, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Label pill
      ctx.font = "700 10px monospace";
      const w = Math.max(
        ctx.measureText(title).width,
        ctx.measureText(subtitle).width
      ) + 16;
      const h = 30;
      ctx.fillStyle = "rgba(17, 34, 27, 0.92)";
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.fillRect(pTop.x - w / 2, pTop.y - h, w, h);
      ctx.strokeRect(pTop.x - w / 2, pTop.y - h, w, h);

      ctx.fillStyle = color;
      ctx.fillText(title, pTop.x - w / 2 + 8, pTop.y - 17);
      ctx.fillStyle = "#F7F5F0";
      ctx.font = "500 9.5px sans-serif";
      ctx.fillText(subtitle, pTop.x - w / 2 + 8, pTop.y - 5);
    };

    drawPin3D(
      -65,
      20,
      14,
      "FRENTE R. 1º DE JANEIRO, 2.650",
      "Testada 67,58 m · Cota 30m",
      "#F4D06F"
    );

    drawPin3D(
      -55,
      68,
      20,
      "↑ CONEXÃO BR-470 (220m)",
      "Esquina Chanfro 10,63 m",
      "#E09F3E"
    );

    drawPin3D(
      52,
      -10,
      14,
      "FRENTE R. FRIEDA BECK",
      "Testada 180,72 m · Cota 50m–60m",
      "#52B788"
    );

    drawPin3D(
      -5,
      -5,
      12,
      "GLEBA 10.361,46 m²",
      "Zoneamento ZI-1 & ZOC",
      "#C59B6D"
    );
  }, [
    viewMode,
    yawDeg,
    pitchDeg,
    exaggeration,
    surfaceMode,
    showFloodPlane,
    selectedElevation,
  ]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    setAutoRotate(false);
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    setYawDeg((prev) => (prev + dx * 0.6) % 360);
    setPitchDeg((prev) => Math.max(15, Math.min(88, prev + dy * 0.45)));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const elevations = [
    {
      cota: 30,
      label: "30 m",
      desc: "Platô Frontal Oeste (Rua 1º de Janeiro) · 18 m acima da cota de enchente",
    },
    {
      cota: 35,
      label: "35 m",
      desc: "Transição Central · Acima do nível viário",
    },
    {
      cota: 40,
      label: "40 m",
      desc: "Encosta Intermediária · Anfiteatro natural",
    },
    {
      cota: 45,
      label: "45 m",
      desc: "Setor Central-Leste · Visada panorâmica para o Vale",
    },
    {
      cota: 50,
      label: "50 m",
      desc: "Setor Superior Leste (Rua Frieda Beck)",
    },
    {
      cota: 55,
      label: "55 m",
      desc: "Crista Leste · Insolação Norte/Oeste plena",
    },
    {
      cota: 60,
      label: "60 m",
      desc: "Cota Máxima Sudeste (Rua Frieda Beck)",
    },
  ];

  return (
    <div className="bg-[#11221B] border border-[#C59B6D]/30 p-6 lg:p-8 text-[#F7F5F0]">
      {/* Header with 3D / 2D Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F7F5F0]/10 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C59B6D] block">
            Relevo e Medidas do Terreno
          </span>
          <h3 className="font-serif text-2xl lg:text-3xl mt-1">
            Maquete 3D & Planta do Terreno (30 m a 60 m de altitude)
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode("3d")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono uppercase tracking-wider border transition cursor-pointer ${
              viewMode === "3d"
                ? "bg-[#C59B6D] text-[#11221B] border-[#C59B6D] font-semibold"
                : "border-[#F7F5F0]/20 text-[#E6DFD3]/75 hover:border-[#C59B6D]/50"
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Maquete 3D Interativa</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("2d")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono uppercase tracking-wider border transition cursor-pointer ${
              viewMode === "2d"
                ? "bg-[#C59B6D] text-[#11221B] border-[#C59B6D] font-semibold"
                : "border-[#F7F5F0]/20 text-[#E6DFD3]/75 hover:border-[#C59B6D]/50"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Planta Técnica 2D</span>
          </button>

          <a
            href="/docs/579_PLANTA_PLANIALT_WOLFF_A2_V1.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono uppercase tracking-wider border border-[#C59B6D]/60 text-[#C59B6D] hover:bg-[#C59B6D]/15 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Planta A2 (PDF)</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-start">
        {/* Left Viewport: 3D Maquete or 2D Blueprint */}
        <div className="lg:col-span-8 relative bg-[#0C1813] border border-[#C59B6D]/25 overflow-hidden">
          {viewMode === "3d" ? (
            <div className="relative">
              {/* Top 3D Camera Preset Bar */}
              <div className="p-3 bg-[#11221B]/90 border-b border-[#C59B6D]/20 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C59B6D] mr-1">
                    Câmeras 3D:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAutoRotate(false);
                      setYawDeg(-38);
                      setPitchDeg(44);
                    }}
                    className="px-2.5 py-1 text-[11px] font-mono bg-[#182E25] border border-[#C59B6D]/35 text-[#F7F5F0] hover:border-[#C59B6D] cursor-pointer"
                  >
                    Perspectiva Sul → BR-470
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAutoRotate(false);
                      setYawDeg(0);
                      setPitchDeg(86);
                    }}
                    className="px-2.5 py-1 text-[11px] font-mono bg-[#182E25] border border-[#C59B6D]/35 text-[#F7F5F0] hover:border-[#C59B6D] cursor-pointer"
                  >
                    Vista de Cima (90°)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAutoRotate(false);
                      setYawDeg(-82);
                      setPitchDeg(32);
                    }}
                    className="px-2.5 py-1 text-[11px] font-mono bg-[#182E25] border border-[#C59B6D]/35 text-[#F7F5F0] hover:border-[#C59B6D] cursor-pointer"
                  >
                    Frente R. 1º de Janeiro
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAutoRotate(false);
                      setYawDeg(115);
                      setPitchDeg(38);
                    }}
                    className="px-2.5 py-1 text-[11px] font-mono bg-[#182E25] border border-[#C59B6D]/35 text-[#F7F5F0] hover:border-[#C59B6D] cursor-pointer"
                  >
                    Crista Leste (Cota 60m)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setAutoRotate((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono uppercase tracking-wider border cursor-pointer ${
                    autoRotate
                      ? "bg-[#C59B6D] text-[#11221B] border-[#C59B6D] font-semibold"
                      : "border-[#F7F5F0]/25 text-[#E6DFD3]"
                  }`}
                >
                  {autoRotate ? (
                    <>
                      <Pause className="w-3 h-3" />
                      <span>Pausar Giro 360°</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      <span>Girar 360°</span>
                    </>
                  )}
                </button>
              </div>

              {/* Interactive 3D Canvas */}
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="w-full h-[460px] sm:h-[520px] cursor-grab active:cursor-grabbing block"
              />

              {/* Bottom 3D Controls Overlay */}
              <div className="p-3 bg-[#11221B]/95 border-t border-[#C59B6D]/20 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setSurfaceMode((m) =>
                        m === "elevation" ? "zoning" : "elevation"
                      )
                    }
                    className="px-3 py-1 font-mono text-[11px] uppercase border border-[#C59B6D]/45 text-[#E6DFD3] hover:bg-[#C59B6D]/15 cursor-pointer"
                  >
                    Cor:{" "}
                    <strong className="text-[#C59B6D]">
                      {surfaceMode === "elevation"
                        ? "Altimetria (30m–60m)"
                        : "Zoneamento (ZI-1 / ZOC)"}
                    </strong>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowFloodPlane((v) => !v)}
                    className={`px-3 py-1 font-mono text-[11px] uppercase border cursor-pointer ${
                      showFloodPlane
                        ? "border-[#4EA8DE] text-[#4EA8DE] bg-[#4EA8DE]/10"
                        : "border-[#F7F5F0]/20 text-[#E6DFD3]/60"
                    }`}
                  >
                    Plano Cota Enchente (12m)
                  </button>
                </div>

                <div className="flex items-center gap-4 font-mono text-[11px] text-[#E6DFD3]/80">
                  <label className="flex items-center gap-2">
                    <span>Inclinação: {Math.round(pitchDeg)}°</span>
                    <input
                      type="range"
                      min={18}
                      max={88}
                      value={pitchDeg}
                      onChange={(e) => {
                        setAutoRotate(false);
                        setPitchDeg(Number(e.target.value));
                      }}
                      className="w-20 accent-[#C59B6D]"
                    />
                  </label>
                  <span className="hidden sm:inline text-[#C59B6D]">
                    Arraste o modelo 3D para rotacionar livremente
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setHighlightContours((v) => !v)}
                  className={`px-3 py-1 text-xs font-mono uppercase border cursor-pointer ${
                    highlightContours
                      ? "bg-[#C59B6D] text-[#11221B] border-[#C59B6D] font-semibold"
                      : "border-[#F7F5F0]/20 text-[#E6DFD3]/75"
                  }`}
                >
                  Curvas de Nível
                </button>
                <button
                  type="button"
                  onClick={() => setHighlightDimensions((v) => !v)}
                  className={`px-3 py-1 text-xs font-mono uppercase border cursor-pointer ${
                    highlightDimensions
                      ? "bg-[#C59B6D] text-[#11221B] border-[#C59B6D] font-semibold"
                      : "border-[#F7F5F0]/20 text-[#E6DFD3]/75"
                  }`}
                >
                  Cotas Perimetrais
                </button>
              </div>
              <svg
                viewBox="0 0 800 560"
                className="w-full h-auto select-none"
                role="img"
                aria-label="Diagrama Técnico do Levantamento Planialtimétrico de 10.361,46 m²"
              >
                <defs>
                  <pattern
                    id="utm-grid"
                    width="100"
                    height="100"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 100 0 L 0 0 0 100"
                      fill="none"
                      stroke="rgba(197, 155, 109, 0.1)"
                      strokeWidth="1"
                    />
                  </pattern>
                  <linearGradient
                    id="gleba-grad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="rgba(197, 155, 109, 0.16)" />
                    <stop offset="50%" stopColor="rgba(82, 183, 136, 0.12)" />
                    <stop offset="100%" stopColor="rgba(197, 155, 109, 0.28)" />
                  </linearGradient>
                </defs>

                <rect width="800" height="560" fill="url(#utm-grid)" />

                <g className="font-mono text-[9px]" fill="rgba(230,223,211,0.4)">
                  <text x="110" y="20">
                    691100 E
                  </text>
                  <text x="310" y="20">
                    691150 E
                  </text>
                  <text x="510" y="20">
                    691200 E
                  </text>
                  <text x="710" y="20">
                    691250 E
                  </text>
                  <text x="14" y="95">
                    7028000 N
                  </text>
                  <text x="14" y="245">
                    7027950 N
                  </text>
                  <text x="14" y="395">
                    7027900 N
                  </text>
                  <text x="14" y="535">
                    7027850 N
                  </text>
                </g>

                <path
                  d="M 155 30 L 110 495"
                  stroke="rgba(247,245,240,0.22)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  fill="none"
                />
                <text
                  x="130"
                  y="225"
                  fill="#F4D06F"
                  transform="rotate(-82 130 225)"
                  className="font-mono text-[11px] tracking-[0.2em]"
                >
                  RUA 1º DE JANEIRO (24,00m)
                </text>

                <path
                  d="M 215 62 L 480 148 L 620 295 L 690 505"
                  stroke="rgba(247,245,240,0.22)"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  fill="none"
                />
                <text
                  x="315"
                  y="88"
                  fill="#52B788"
                  transform="rotate(18 315 88)"
                  className="font-mono text-[10px] tracking-[0.18em]"
                >
                  RUA FRIEDA BECK (10,00m)
                </text>

                <polygon
                  points="
                    195,92
                    222,74
                    342,108
                    432,145
                    378,242
                    458,285
                    512,190
                    538,210
                    560,235
                    580,268
                    592,295
                    602,338
                    610,382
                    618,425
                    628,462
                    642,495
                    656,515
                    345,482
                    398,325
                    172,306
                    181,242
                  "
                  fill="url(#gleba-grad)"
                  stroke="#C59B6D"
                  strokeWidth="2.5"
                />

                {highlightContours && (
                  <g fill="none" strokeLinecap="round">
                    <path
                      d="M 245 140 Q 320 230 355 295 Q 395 380 415 486"
                      stroke={
                        selectedElevation === 30
                          ? "#F4D06F"
                          : "rgba(197,155,109,0.45)"
                      }
                      strokeWidth={selectedElevation === 30 ? "2.5" : "1.2"}
                    />
                    <path
                      d="M 290 120 Q 355 225 415 305 Q 445 395 458 492"
                      stroke={
                        selectedElevation === 35
                          ? "#F4D06F"
                          : "rgba(197,155,109,0.45)"
                      }
                      strokeWidth={selectedElevation === 35 ? "2.5" : "1.2"}
                    />
                    <path
                      d="M 345 112 Q 385 215 455 300 Q 485 395 502 496"
                      stroke={
                        selectedElevation === 40
                          ? "#F4D06F"
                          : "rgba(197,155,109,0.5)"
                      }
                      strokeWidth={selectedElevation === 40 ? "2.5" : "1.2"}
                    />
                    <path
                      d="M 518 205 Q 505 310 525 395 Q 538 455 545 501"
                      stroke={
                        selectedElevation === 45
                          ? "#F4D06F"
                          : "rgba(197,155,109,0.55)"
                      }
                      strokeWidth={selectedElevation === 45 ? "2.5" : "1.2"}
                    />
                    <path
                      d="M 555 232 Q 548 335 568 420 Q 578 468 588 506"
                      stroke={
                        selectedElevation === 50
                          ? "#F4D06F"
                          : "rgba(197,155,109,0.6)"
                      }
                      strokeWidth={selectedElevation === 50 ? "2.5" : "1.2"}
                    />
                    <path
                      d="M 585 280 Q 586 365 604 445 Q 612 480 620 510"
                      stroke={
                        selectedElevation === 55
                          ? "#F4D06F"
                          : "rgba(197,155,109,0.65)"
                      }
                      strokeWidth={selectedElevation === 55 ? "2.5" : "1.2"}
                    />
                    <path
                      d="M 608 360 Q 618 435 642 512"
                      stroke={
                        selectedElevation === 60
                          ? "#F4D06F"
                          : "rgba(197,155,109,0.75)"
                      }
                      strokeWidth={selectedElevation === 60 ? "2.5" : "1.4"}
                    />
                  </g>
                )}

                <text
                  x="265"
                  y="212"
                  fill="#F7F5F0"
                  className="font-serif text-[18px] font-semibold"
                >
                  Área Total
                </text>
                <text
                  x="255"
                  y="230"
                  fill="#C59B6D"
                  className="font-mono text-[13px] font-bold"
                >
                  10.361,46 m²
                </text>

                {highlightDimensions && (
                  <g
                    className="font-mono text-[10px] font-semibold"
                    fill="#F7F5F0"
                  >
                    <text x="196" y="75" fill="#F4D06F">
                      10,63m
                    </text>
                    <text x="275" y="106" fill="#52B788">
                      32,74m
                    </text>
                    <text x="378" y="138" fill="#52B788">
                      25,65m
                    </text>
                    <text x="192" y="182" fill="#F4D06F">
                      47,29m
                    </text>
                    <text x="182" y="278" fill="#F4D06F">
                      20,29m
                    </text>
                    <text x="272" y="302">
                      58,59m
                    </text>
                    <text x="355" y="405">
                      55,94m
                    </text>
                    <text x="475" y="488">
                      103,64m
                    </text>
                    <text x="615" y="355" fill="#52B788">
                      122,33m (11 seg.)
                    </text>
                  </g>
                )}
              </svg>
            </div>
          )}
        </div>

        {/* Right Altimetric Interactive Inspector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#162B22] border border-[#C59B6D]/30 p-5">
            <div className="flex items-center gap-2 text-[#C59B6D] font-mono text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Segurança Hídrica em 3D</span>
            </div>
            <div className="font-serif text-2xl text-[#F7F5F0] mt-1">
              Cotas 30 m a 60 m
            </div>
            <p className="text-xs text-[#E6DFD3]/80 mt-2 leading-relaxed">
              Na maquete 3D ao lado, a faixa iluminada destaca cada faixa de
              elevação de 5 m em 5 m. O plano azul inferior representa a{" "}
              <strong>cota de enchente de Blumenau (12 m)</strong>, situada de 18 m
              a 48 m abaixo do terreno.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#E6DFD3]/70 mb-2">
              Destacar Faixa Altimétrica na Maquete 3D / 2D
            </div>
            {elevations.map((item) => {
              const active = selectedElevation === item.cota;
              return (
                <button
                  key={item.cota}
                  type="button"
                  onMouseEnter={() => setSelectedElevation(item.cota)}
                  onClick={() =>
                    setSelectedElevation(
                      selectedElevation === item.cota ? null : item.cota
                    )
                  }
                  className={`w-full text-left px-3.5 py-2.5 border transition cursor-pointer flex items-center justify-between gap-3 ${
                    active
                      ? "bg-[#C59B6D]/20 border-[#C59B6D] text-[#F7F5F0]"
                      : "bg-[#0C1813]/70 border-[#F7F5F0]/10 text-[#E6DFD3]/75 hover:border-[#C59B6D]/40"
                  }`}
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-[#C59B6D] mr-2">
                      Cota {item.label}
                    </span>
                    <span className="text-xs text-[#E6DFD3]/90 block mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
