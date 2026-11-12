"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  PROPERTY_POLYGON_VERTICES,
  BR470_ROUTE_COORDS,
  ZONING_ZI1_POLYGON,
  MAP_POIS,
  PROPERTY_SUMMARY,
  MapPOI,
} from "@/data/propertyData";
import {
  Compass,
  Navigation,
  Maximize2,
  Eye,
  EyeOff,
  Sliders,
  Copy,
  Check,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  Building2,
  GraduationCap,
  Truck,
} from "lucide-react";

type MapStyleMode = "google-hybrid" | "google-satellite" | "google-roadmap";
type POICategoryFilter = "todos" | "mercado" | "comercio" | "educacao" | "acesso";

const STORAGE_KEY_POLYGON = "terra_blumenau_calibrated_polygon_v2";

export default function InteractiveMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const overlayGroupRef = useRef<any>(null);
  const editHandlesGroupRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);

  const [mapStyle, setMapStyle] = useState<MapStyleMode>("google-hybrid");
  const [showPerimeter, setShowPerimeter] = useState(true);
  const [showZoning, setShowZoning] = useState(false);
  const [showPois, setShowPois] = useState(true);
  const [poiFilter, setPoiFilter] = useState<POICategoryFilter>("todos");
  const [selectedPoi, setSelectedPoi] = useState<MapPOI | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Calibration tool state
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [polygonCoords, setPolygonCoords] = useState<[number, number][]>(() =>
    PROPERTY_POLYGON_VERTICES.map((v) => [v.lat, v.lng])
  );
  const [copiedJson, setCopiedJson] = useState(false);

  // Load any saved calibration from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_POLYGON);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          setPolygonCoords(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const savePolygonCoords = useCallback((nextCoords: [number, number][]) => {
    setPolygonCoords(nextCoords);
    try {
      localStorage.setItem(STORAGE_KEY_POLYGON, JSON.stringify(nextCoords));
    } catch {
      // ignore
    }
  }, []);

  // Shift entire polygon by delta meters
  const nudgePolygon = (dLatMeters: number, dLngMeters: number) => {
    const dLat = dLatMeters / 111111;
    const dLng = dLngMeters / (111111 * Math.cos((-26.8572 * Math.PI) / 180));
    const next = polygonCoords.map(([lat, lng]): [number, number] => [
      Number((lat + dLat).toFixed(6)),
      Number((lng + dLng).toFixed(6)),
    ]);
    savePolygonCoords(next);
  };

  const resetPolygonToDefault = () => {
    const defaults = PROPERTY_POLYGON_VERTICES.map((v): [number, number] => [v.lat, v.lng]);
    savePolygonCoords(defaults);
    try {
      localStorage.removeItem(STORAGE_KEY_POLYGON);
    } catch {
      // ignore
    }
  };

  const copyPolygonToClipboard = () => {
    const formatted = JSON.stringify(
      polygonCoords.map(([lat, lng], i) => ({
        point: `P${i + 1}`,
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6)),
      })),
      null,
      2
    );
    navigator.clipboard.writeText(formatted);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 3000);
  };

  // Initialize 2D Leaflet Map with Google Maps tiles
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const leafletMod: any = await import("leaflet");
      const L = leafletMod.default ?? leafletMod;
      leafletRef.current = L;

      if (!isMounted || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [PROPERTY_SUMMARY.centerCoordinates.lat, PROPERTY_SUMMARY.centerCoordinates.lng],
        zoom: 18,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      const tileLayer = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        { maxZoom: 21 }
      ).addTo(map);

      const overlayGroup = L.layerGroup().addTo(map);
      const editHandlesGroup = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      tileLayerRef.current = tileLayer;
      overlayGroupRef.current = overlayGroup;
      editHandlesGroupRef.current = editHandlesGroup;

      setIsLoaded(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Switch Google Maps tile layer (Hybrid / Satellite / Roadmap)
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const urls: Record<MapStyleMode, string> = {
      "google-hybrid": "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
      "google-satellite": "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      "google-roadmap": "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    };
    tileLayerRef.current.setUrl(urls[mapStyle]);
  }, [mapStyle]);

  // Render overlays & calibration handles
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapInstanceRef.current;
    const group = overlayGroupRef.current;
    const handlesGroup = editHandlesGroupRef.current;
    if (!L || !map || !group || !handlesGroup || !isLoaded) return;

    group.clearLayers();
    handlesGroup.clearLayers();

    // 1. Zoning Layers
    if (showZoning) {
      L.polygon(polygonCoords, {
        color: "#6EE7B7",
        weight: 1.5,
        dashArray: "6, 6",
        fillColor: "#1F4E3D",
        fillOpacity: 0.42,
      })
        .bindTooltip("ZOC · Zona de Ocupação Controlada (Lote mín. 500 m²)", {
          sticky: true,
        })
        .addTo(group);

      L.polygon(ZONING_ZI1_POLYGON, {
        color: "#F59E0B",
        weight: 2,
        fillColor: "#C59B6D",
        fillOpacity: 0.52,
      })
        .bindTooltip("ZI-1 · Zona Industrial 1 (Lote mín. 125 m²)", {
          sticky: true,
        })
        .addTo(group);
    }

    // 2. Property Perimeter, Frontages & 220m BR-470 Route
    if (showPerimeter) {
      // Outer subtle glow
      L.polygon(polygonCoords, {
        color: "#C59B6D",
        weight: 7,
        opacity: 0.25,
        fill: false,
      }).addTo(group);

      // Main 10.361,46 m² Polygon
      L.polygon(polygonCoords, {
        color: "#C59B6D",
        weight: 3,
        opacity: 1,
        fillColor: "#C59B6D",
        fillOpacity: showZoning ? 0.05 : 0.2,
      }).addTo(group);

      // Primary Frontage Highlight: Rua 1º de Janeiro (West edge: P22 -> P23 -> P1 -> P2 -> P3)
      if (polygonCoords.length >= 23 && !isCalibrating) {
        const rua1JaneiroCoords: [number, number][] = [
          polygonCoords[21],
          polygonCoords[22],
          polygonCoords[0],
          polygonCoords[1],
          polygonCoords[2],
        ];
        L.polyline(rua1JaneiroCoords, {
          color: "#F59E0B",
          weight: 5,
          opacity: 0.95,
        })
          .bindTooltip("Frente Rua 1º de Janeiro: 67,58 m + 10,63 m esquina", {
            sticky: true,
          })
          .addTo(group);
      }

      // 220m Direct Route South along Rua 1º de Janeiro to BR-470 (Rod. Ingo Hering)
      L.polyline(BR470_ROUTE_COORDS, {
        color: "#38BDF8",
        weight: 4,
        dashArray: "8, 8",
        opacity: 0.9,
      })
        .bindTooltip("Acesso direto à BR-470 (Rod. Ingo Hering): 220 m", {
          sticky: true,
        })
        .addTo(group);

      // Center Badge (hidden during calibration so it doesn't block dragging)
      if (!isCalibrating) {
        const centerHtml = `
          <div style="
            background: rgba(17, 34, 27, 0.92);
            backdrop-filter: blur(6px);
            border: 1.5px solid #C59B6D;
            color: #F7F5F0;
            padding: 5px 10px;
            border-radius: 6px;
            font-family: var(--font-jakarta), sans-serif;
            text-align: center;
            box-shadow: 0 8px 20px rgba(0,0,0,0.45);
            white-space: nowrap;
            transform: translate(-50%, -50%);
            pointer-events: none;
          ">
            <div style="font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: #C59B6D; font-weight: 700;">
              TERRA / BLUMENAU
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #FFFFFF;">
              10.361,46 m²
            </div>
          </div>
        `;
        const centerIcon = L.divIcon({
          html: centerHtml,
          className: "custom-leaflet-div-icon",
          iconSize: [0, 0],
        });
        L.marker(
          [PROPERTY_SUMMARY.centerCoordinates.lat, PROPERTY_SUMMARY.centerCoordinates.lng],
          { icon: centerIcon, interactive: false }
        ).addTo(group);
      }
    }

    // 3. Calibration Handles (when calibration mode is ON)
    if (isCalibrating) {
      polygonCoords.forEach(([lat, lng], idx) => {
        const handleHtml = `
          <div style="
            width: 22px;
            height: 22px;
            border-radius: 9999px;
            background: #F59E0B;
            border: 2px solid #11221B;
            color: #11221B;
            font-size: 9px;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 10px rgba(0,0,0,0.6);
            cursor: grab;
            transform: translate(-11px, -11px);
          " title="Arraste P${idx + 1} (${lat.toFixed(6)}, ${lng.toFixed(6)})">
            ${idx + 1}
          </div>
        `;
        const icon = L.divIcon({
          html: handleHtml,
          className: "custom-calibrate-handle",
          iconSize: [0, 0],
        });

        const marker = L.marker([lat, lng], {
          icon,
          draggable: true,
        }).addTo(handlesGroup);

        marker.on("dragend", (e: any) => {
          const pos = e.target.getLatLng();
          const updated = polygonCoords.map((pt, i): [number, number] =>
            i === idx ? [Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6))] : pt
          );
          savePolygonCoords(updated);
        });

        // Right-click a vertex to remove it (if > 4 vertices)
        marker.on("contextmenu", () => {
          if (polygonCoords.length <= 4) return;
          const updated = polygonCoords.filter((_, i) => i !== idx);
          savePolygonCoords(updated);
        });
      });

      // Midpoint "+" handles to insert a new vertex along any edge
      polygonCoords.forEach((pt1, idx) => {
        const pt2 = polygonCoords[(idx + 1) % polygonCoords.length];
        const midLat = (pt1[0] + pt2[0]) / 2;
        const midLng = (pt1[1] + pt2[1]) / 2;
        const dist = Math.hypot(pt1[0] - pt2[0], pt1[1] - pt2[1]);
        if (dist < 0.00018) return; // only show on longer edges

        const midHtml = `
          <div style="
            width: 14px;
            height: 14px;
            border-radius: 9999px;
            background: rgba(255,255,255,0.85);
            border: 1.5px solid #11221B;
            color: #11221B;
            font-size: 10px;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transform: translate(-7px, -7px);
          " title="Clique para criar novo ponto neste trecho">+</div>
        `;
        const midIcon = L.divIcon({
          html: midHtml,
          className: "custom-midpoint-handle",
          iconSize: [0, 0],
        });
        const midMarker = L.marker([midLat, midLng], { icon: midIcon }).addTo(handlesGroup);
        midMarker.on("click", () => {
          const next = [...polygonCoords];
          next.splice(idx + 1, 0, [Number(midLat.toFixed(6)), Number(midLng.toFixed(6))]);
          savePolygonCoords(next);
        });
      });
    }

    // 4. Points of Interest (POIs)
    if (showPois) {
      const categoryColors: Record<MapPOI["category"], string> = {
        acesso: "#C59B6D",
        mercado: "#34D399",
        comercio: "#F59E0B",
        educacao: "#A78BFA",
        logistica: "#38BDF8",
      };

      const filteredPois = MAP_POIS.filter((poi) => {
        if (poiFilter === "todos") return true;
        if (poiFilter === "acesso") return poi.category === "acesso" || poi.category === "logistica";
        return poi.category === poiFilter;
      });

      filteredPois.forEach((poi) => {
        const color = categoryColors[poi.category];
        const isSelected = selectedPoi?.id === poi.id;

        const markerHtml = `
          <div style="
            display: flex;
            align-items: center;
            gap: 6px;
            background: ${isSelected ? "#C59B6D" : "rgba(17, 34, 27, 0.94)"};
            color: ${isSelected ? "#11221B" : "#F7F5F0"};
            border: 1.5px solid ${isSelected ? "#FFFFFF" : color};
            padding: 4px 9px;
            border-radius: 9999px;
            font-family: var(--font-jakarta), sans-serif;
            font-size: 11px;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 4px 14px rgba(0,0,0,0.45);
            cursor: pointer;
            transform: translate(-50%, -50%);
          ">
            <span style="
              width: 8px;
              height: 8px;
              border-radius: 9999px;
              background: ${isSelected ? "#11221B" : color};
              display: inline-block;
              flex-shrink: 0;
            "></span>
            <span>${poi.name.split("·")[0].split("(")[0].trim()}</span>
            <span style="opacity: 0.75; font-size: 10px;">${poi.distance.split(" ")[0]} ${poi.distance.split(" ")[1] || ""}</span>
          </div>
        `;

        const poiIcon = L.divIcon({
          html: markerHtml,
          className: "custom-poi-div-icon",
          iconSize: [0, 0],
        });

        const marker = L.marker([poi.lat, poi.lng], { icon: poiIcon }).addTo(group);
        marker.on("click", () => {
          setSelectedPoi(poi);
          map.flyTo([poi.lat, poi.lng], Math.max(map.getZoom(), 16), {
            duration: 0.7,
          });
        });
      });
    }
  }, [isLoaded, showPerimeter, showZoning, showPois, poiFilter, selectedPoi, polygonCoords, isCalibrating, savePolygonCoords]);

  const flyToView = (view: "terreno" | "br470" | "entorno") => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (view === "terreno") {
      setSelectedPoi(null);
      map.flyTo(
        [PROPERTY_SUMMARY.centerCoordinates.lat, PROPERTY_SUMMARY.centerCoordinates.lng],
        18,
        { duration: 0.8 }
      );
    } else if (view === "br470") {
      map.flyTo([-26.8581, -49.0766], 16, { duration: 0.8 });
    } else {
      setSelectedPoi(null);
      map.flyTo([-26.8635, -49.0795], 14, { duration: 0.9 });
    }
  };

  const focusPoi = (poi: MapPOI) => {
    setSelectedPoi(poi);
    setShowPois(true);
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([poi.lat, poi.lng], 16, { duration: 0.7 });
  };

  const filteredPoiList = MAP_POIS.filter((poi) => {
    if (poiFilter === "todos") return true;
    if (poiFilter === "acesso") return poi.category === "acesso" || poi.category === "logistica";
    return poi.category === poiFilter;
  });

  return (
    <div className="space-y-4">
      {/* Compact Top Control Bar (Replaces the bulky left sidebar card) */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#152820]/12 bg-white p-3 shadow-sm">
        {/* Left: Quick Camera Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => flyToView("terreno")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#152820] px-3 py-1.5 text-xs font-semibold text-[#F7F5F0] transition hover:bg-[#1E3A2F]"
          >
            <Maximize2 className="h-3.5 w-3.5 text-[#C59B6D]" />
            Focar Terreno
          </button>
          <button
            type="button"
            onClick={() => flyToView("br470")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#152820]/15 bg-[#F7F5F0] px-3 py-1.5 text-xs font-medium text-[#152820] transition hover:border-[#C59B6D]"
          >
            <Navigation className="h-3.5 w-3.5 text-[#0284C7]" />
            Rota 220m BR-470
          </button>
          <button
            type="button"
            onClick={() => flyToView("entorno")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#152820]/15 bg-[#F7F5F0] px-3 py-1.5 text-xs font-medium text-[#152820] transition hover:border-[#C59B6D]"
          >
            <Compass className="h-3.5 w-3.5 text-[#8C6239]" />
            Ver Região Norte (Mercados & Faculdades)
          </button>
        </div>

        {/* Center: Compact Layer Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowPerimeter(!showPerimeter)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
              showPerimeter
                ? "border-[#C59B6D]/50 bg-[#C59B6D]/12 text-[#152820]"
                : "border-[#152820]/12 bg-white text-[#152820]/50"
            }`}
          >
            {showPerimeter ? <Eye className="h-3.5 w-3.5 text-[#8C6239]" /> : <EyeOff className="h-3.5 w-3.5" />}
            Limites (10.361 m²)
          </button>

          <button
            type="button"
            onClick={() => setShowZoning(!showZoning)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
              showZoning
                ? "border-[#C59B6D]/50 bg-[#C59B6D]/12 text-[#152820]"
                : "border-[#152820]/12 bg-white text-[#152820]/50"
            }`}
          >
            {showZoning ? <Eye className="h-3.5 w-3.5 text-[#8C6239]" /> : <EyeOff className="h-3.5 w-3.5" />}
            Zoneamento (ZI-1 / ZOC)
          </button>

          <button
            type="button"
            onClick={() => setShowPois(!showPois)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
              showPois
                ? "border-[#C59B6D]/50 bg-[#C59B6D]/12 text-[#152820]"
                : "border-[#152820]/12 bg-white text-[#152820]/50"
            }`}
          >
            {showPois ? <Eye className="h-3.5 w-3.5 text-[#8C6239]" /> : <EyeOff className="h-3.5 w-3.5" />}
            Pontos Próximos ({MAP_POIS.length})
          </button>

          {/* Calibration Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !isCalibrating;
              setIsCalibrating(next);
              if (next) flyToView("terreno");
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
              isCalibrating
                ? "border-amber-500 bg-amber-500 text-[#11221B] shadow-sm"
                : "border-amber-500/40 bg-amber-500/10 text-[#8C6239] hover:bg-amber-500/20"
            }`}
            title="Ferramenta para ajustar manualmente os vértices do terreno sobre a foto de satélite"
          >
            <Sliders className="h-3.5 w-3.5" />
            {isCalibrating ? "Fechar Ajuste de Polígono" : "Ajustar Polígono"}
          </button>
        </div>

        {/* Right: Map Base Style */}
        <div className="inline-flex rounded-lg border border-[#152820]/15 bg-[#F7F5F0] p-0.5">
          <button
            type="button"
            onClick={() => setMapStyle("google-hybrid")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              mapStyle === "google-hybrid"
                ? "bg-[#152820] text-[#F7F5F0]"
                : "text-[#152820]/70 hover:text-[#152820]"
            }`}
          >
            Híbrido
          </button>
          <button
            type="button"
            onClick={() => setMapStyle("google-satellite")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              mapStyle === "google-satellite"
                ? "bg-[#152820] text-[#F7F5F0]"
                : "text-[#152820]/70 hover:text-[#152820]"
            }`}
          >
            Satélite
          </button>
          <button
            type="button"
            onClick={() => setMapStyle("google-roadmap")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              mapStyle === "google-roadmap"
                ? "bg-[#152820] text-[#F7F5F0]"
                : "text-[#152820]/70 hover:text-[#152820]"
            }`}
          >
            Mapa
          </button>
        </div>
      </div>

      {/* Interactive Calibration Toolbar (Only visible when user clicks "Ajustar Polígono") */}
      {isCalibrating && (
        <div className="rounded-xl border-2 border-amber-500/60 bg-[#152820] p-4 text-[#F7F5F0] shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Ferramenta de Calibração dos Limites no Satélite
                </p>
              </div>
              <p className="mt-1 text-xs text-[#E6DFD3]/85">
                Arraste qualquer ponto numerado <strong>(1 a {polygonCoords.length})</strong> diretamente no mapa abaixo, clique em <strong>+</strong> para criar um novo vértice, ou clique com o botão direito em um ponto para removê-lo.
              </p>
            </div>

            {/* Whole-polygon directional nudge buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-[#E6DFD3]/70">Mover tudo (1m):</span>
              <div className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => nudgePolygon(1, 0)}
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-white/15"
                  title="Mover 1 metro para o Norte"
                >
                  <ArrowUp className="h-3.5 w-3.5 text-amber-400" /> Norte
                </button>
                <button
                  type="button"
                  onClick={() => nudgePolygon(-1, 0)}
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-white/15"
                  title="Mover 1 metro para o Sul"
                >
                  <ArrowDown className="h-3.5 w-3.5 text-amber-400" /> Sul
                </button>
                <button
                  type="button"
                  onClick={() => nudgePolygon(0, -1)}
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-white/15"
                  title="Mover 1 metro para o Oeste"
                >
                  <ArrowLeft className="h-3.5 w-3.5 text-amber-400" /> Oeste
                </button>
                <button
                  type="button"
                  onClick={() => nudgePolygon(0, 1)}
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-white/15"
                  title="Mover 1 metro para o Leste"
                >
                  <ArrowRight className="h-3.5 w-3.5 text-amber-400" /> Leste
                </button>
              </div>

              <button
                type="button"
                onClick={resetPolygonToDefault}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#E6DFD3] transition hover:bg-white/15"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Restaurar Original
              </button>

              <button
                type="button"
                onClick={copyPolygonToClipboard}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-[#11221B] transition hover:bg-amber-300"
              >
                {copiedJson ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Coordenadas Copiadas! Cole no Chat
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copiar Coordenadas Ajustadas
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Width 2D Google Maps Container */}
      <div className="relative h-[540px] lg:h-[620px] w-full overflow-hidden rounded-2xl border border-[#152820]/15 bg-[#0F1F18] shadow-xl">
        <div ref={mapContainerRef} className="h-full w-full" />

        {/* Selected POI Floating Card inside Map (Bottom-Left) */}
        {selectedPoi && (
          <div className="absolute bottom-4 left-4 right-14 sm:right-auto sm:max-w-md z-[500] rounded-xl border border-[#C59B6D]/50 bg-[#11221B]/95 p-4 text-[#F7F5F0] backdrop-blur-md shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C59B6D]">
                  {selectedPoi.categoryLabel} · {selectedPoi.distance} ({selectedPoi.travelTime})
                </span>
                <h5 className="mt-0.5 text-sm font-semibold text-white">{selectedPoi.name}</h5>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPoi(null)}
                className="rounded px-2 py-0.5 text-xs text-[#E6DFD3]/60 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-[#E6DFD3]/85">
              {selectedPoi.description}
            </p>
          </div>
        )}
      </div>

      {/* Compact POI Filter & Quick-Jump Strip Below Map */}
      <div className="rounded-xl border border-[#152820]/12 bg-white p-3.5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#152820]/10 pb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#152820]">
            Pontos de Referência Próximos (Clique para localizar no mapa)
          </span>
          <div className="flex flex-wrap items-center gap-1">
            {[
              { id: "todos", label: "Todos", icon: null },
              { id: "mercado", label: "Mercados & Atacados", icon: ShoppingCart },
              { id: "comercio", label: "Shoppings & Centros Comerciais", icon: Building2 },
              { id: "educacao", label: "Faculdades & Saúde", icon: GraduationCap },
              { id: "acesso", label: "Acessos & Terminais", icon: Truck },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = poiFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPoiFilter(tab.id as POICategoryFilter)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    active
                      ? "bg-[#152820] text-[#F7F5F0]"
                      : "bg-[#F7F5F0] text-[#152820]/75 hover:bg-[#E6DFD3]/60"
                  }`}
                >
                  {Icon && <Icon className="h-3 w-3 text-[#C59B6D]" />}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Horizontal Scrollable / Grid Pills of POIs */}
        <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredPoiList.map((poi) => {
            const isSelected = selectedPoi?.id === poi.id;
            const dotColor =
              poi.category === "mercado"
                ? "bg-emerald-500"
                : poi.category === "comercio"
                ? "bg-amber-500"
                : poi.category === "educacao"
                ? "bg-purple-500"
                : poi.category === "logistica"
                ? "bg-sky-500"
                : "bg-[#C59B6D]";

            return (
              <button
                key={poi.id}
                type="button"
                onClick={() => focusPoi(poi)}
                className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition ${
                  isSelected
                    ? "border-[#C59B6D] bg-[#152820] text-[#F7F5F0]"
                    : "border-[#152820]/10 bg-[#F7F5F0]/60 text-[#152820] hover:border-[#C59B6D]/50 hover:bg-[#F7F5F0]"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
                  <span className="truncate text-xs font-medium">{poi.name}</span>
                </div>
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] ${
                    isSelected
                      ? "bg-[#C59B6D]/20 text-[#C59B6D]"
                      : "bg-[#152820]/8 text-[#8C6239]"
                  }`}
                >
                  {poi.distance}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
