"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  PROPERTY_POLYGON_VERTICES,
  BR470_ROUTE_COORDS,
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
  Trees,
  Truck,
} from "lucide-react";

type MapStyleMode = "google-hybrid" | "google-satellite" | "google-roadmap";
type POICategoryFilter =
  | "todos"
  | "parque"
  | "mercado"
  | "comercio"
  | "educacao"
  | "acesso";

const STORAGE_KEY_POLYGON = "terra_blumenau_calibrated_polygon_v3";

export default function InteractiveMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const overlayGroupRef = useRef<any>(null);
  const editHandlesGroupRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);

  const [mapStyle, setMapStyle] = useState<MapStyleMode>("google-hybrid");
  const [showPerimeter, setShowPerimeter] = useState(true);
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
    const defaults = PROPERTY_POLYGON_VERTICES.map((v): [number, number] => [
      v.lat,
      v.lng,
    ]);
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
        center: [
          PROPERTY_SUMMARY.centerCoordinates.lat,
          PROPERTY_SUMMARY.centerCoordinates.lng,
        ],
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

    // 1. Property Perimeter, Frontages & 220m BR-470 Route
    if (showPerimeter) {
      // Outer subtle glow
      L.polygon(polygonCoords, {
        color: "#C59B6D",
        weight: 6,
        opacity: 0.25,
        fill: false,
      }).addTo(group);

      // Main 10.361,46 m² Polygon
      L.polygon(polygonCoords, {
        color: "#C59B6D",
        weight: 2.5,
        opacity: 1,
        fillColor: "#C59B6D",
        fillOpacity: 0.2,
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

      // Center Badge (uses .terra-map-badge with width: max-content so background always fits text)
      if (!isCalibrating) {
        const centerHtml = `
          <div class="terra-map-badge" style="
            background: rgba(17, 34, 27, 0.94);
            border: 1.5px solid #C59B6D;
            color: #F7F5F0;
            padding: 4px 10px;
            border-radius: 6px;
            font-family: var(--font-jakarta), sans-serif;
            box-shadow: 0 6px 16px rgba(0,0,0,0.5);
          ">
            <span style="display: block; font-size: 8.5px; letter-spacing: 0.14em; text-transform: uppercase; color: #C59B6D; font-weight: 700; line-height: 1.2;">
              TERRA / BLUMENAU
            </span>
            <span style="display: block; font-size: 12px; font-weight: 700; color: #FFFFFF; line-height: 1.25; margin-top: 1px;">
              10.361,46 m²
            </span>
          </div>
        `;
        const centerIcon = L.divIcon({
          html: centerHtml,
          className: "custom-leaflet-div-icon",
          iconSize: [0, 0],
        });
        L.marker(
          [
            PROPERTY_SUMMARY.centerCoordinates.lat,
            PROPERTY_SUMMARY.centerCoordinates.lng,
          ],
          { icon: centerIcon, interactive: false }
        ).addTo(group);
      }
    }

    // 2. Calibration Handles (when calibration mode is ON)
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
            i === idx
              ? [Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6))]
              : pt
          );
          savePolygonCoords(updated);
        });

        marker.on("contextmenu", () => {
          if (polygonCoords.length <= 4) return;
          const updated = polygonCoords.filter((_, i) => i !== idx);
          savePolygonCoords(updated);
        });
      });

      polygonCoords.forEach((pt1, idx) => {
        const pt2 = polygonCoords[(idx + 1) % polygonCoords.length];
        const midLat = (pt1[0] + pt2[0]) / 2;
        const midLng = (pt1[1] + pt2[1]) / 2;
        const dist = Math.hypot(pt1[0] - pt2[0], pt1[1] - pt2[1]);
        if (dist < 0.00018) return;

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
        const midMarker = L.marker([midLat, midLng], { icon: midIcon }).addTo(
          handlesGroup
        );
        midMarker.on("click", () => {
          const next = [...polygonCoords];
          next.splice(idx + 1, 0, [
            Number(midLat.toFixed(6)),
            Number(midLng.toFixed(6)),
          ]);
          savePolygonCoords(next);
        });
      });
    }

    // 3. Points of Interest (POIs)
    if (showPois) {
      const categoryColors: Record<MapPOI["category"], string> = {
        acesso: "#C59B6D",
        parque: "#22C55E",
        mercado: "#34D399",
        comercio: "#F59E0B",
        educacao: "#A78BFA",
        logistica: "#38BDF8",
      };

      const filteredPois = MAP_POIS.filter((poi) => {
        if (poiFilter === "todos") return true;
        if (poiFilter === "acesso")
          return poi.category === "acesso" || poi.category === "logistica";
        return poi.category === poiFilter;
      });

      filteredPois.forEach((poi) => {
        const color = categoryColors[poi.category];
        const isSelected = selectedPoi?.id === poi.id;
        const shortName = poi.name.split("·")[0].split("(")[0].trim();
        const shortDist = `${poi.distance.split(" ")[0]} ${
          poi.distance.split(" ")[1] || ""
        }`.trim();

        const markerHtml = `
          <div class="terra-poi-pill" style="
            background: ${isSelected ? "#C59B6D" : "rgba(17, 34, 27, 0.94)"};
            color: ${isSelected ? "#11221B" : "#F7F5F0"};
            border: 1.5px solid ${isSelected ? "#FFFFFF" : color};
            padding: 3.5px 9px;
            border-radius: 9999px;
            font-family: var(--font-jakarta), sans-serif;
            font-size: 11px;
            font-weight: 600;
            line-height: 1.2;
            box-shadow: 0 4px 12px rgba(0,0,0,0.45);
          ">
            <span style="
              width: 7px;
              height: 7px;
              border-radius: 9999px;
              background: ${isSelected ? "#11221B" : color};
              display: inline-block;
              flex-shrink: 0;
            "></span>
            <span style="white-space: nowrap;">${shortName}</span>
            <span style="opacity: 0.78; font-size: 10px; white-space: nowrap;">${shortDist}</span>
          </div>
        `;

        const poiIcon = L.divIcon({
          html: markerHtml,
          className: "custom-poi-div-icon",
          iconSize: [0, 0],
        });

        const marker = L.marker([poi.lat, poi.lng], { icon: poiIcon }).addTo(
          group
        );
        marker.on("click", () => {
          setSelectedPoi(poi);
          map.flyTo([poi.lat, poi.lng], Math.max(map.getZoom(), 16), {
            duration: 0.7,
          });
        });
      });
    }
  }, [
    isLoaded,
    showPerimeter,
    showPois,
    poiFilter,
    selectedPoi,
    polygonCoords,
    isCalibrating,
    savePolygonCoords,
  ]);

  const flyToView = (view: "terreno" | "br470" | "entorno") => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (view === "terreno") {
      setSelectedPoi(null);
      map.flyTo(
        [
          PROPERTY_SUMMARY.centerCoordinates.lat,
          PROPERTY_SUMMARY.centerCoordinates.lng,
        ],
        18,
        { duration: 0.8 }
      );
    } else if (view === "br470") {
      map.flyTo([-26.8581, -49.0766], 16, { duration: 0.8 });
    } else {
      setSelectedPoi(null);
      map.flyTo([-26.8635, -49.0775], 14, { duration: 0.9 });
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
    if (poiFilter === "acesso")
      return poi.category === "acesso" || poi.category === "logistica";
    return poi.category === poiFilter;
  });

  return (
    <div className="space-y-3">
      {/* Calibration Toolbar (Only visible when user clicks "Ajustar Polígono") */}
      {isCalibrating && (
        <div className="rounded-xl border-2 border-amber-500/60 bg-[#152820] p-3.5 text-[#F7F5F0] shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Ajuste Manual dos Vértices ({polygonCoords.length} pontos)
              </p>
              <p className="mt-0.5 text-xs text-[#E6DFD3]/85">
                Arraste qualquer ponto no mapa, clique em <strong>+</strong> para
                adicionar ou com o botão direito para remover.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => nudgePolygon(1, 0)}
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-white/15"
                >
                  <ArrowUp className="h-3.5 w-3.5 text-amber-400" /> Norte
                </button>
                <button
                  type="button"
                  onClick={() => nudgePolygon(-1, 0)}
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-white/15"
                >
                  <ArrowDown className="h-3.5 w-3.5 text-amber-400" /> Sul
                </button>
                <button
                  type="button"
                  onClick={() => nudgePolygon(0, -1)}
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-white/15"
                >
                  <ArrowLeft className="h-3.5 w-3.5 text-amber-400" /> Oeste
                </button>
                <button
                  type="button"
                  onClick={() => nudgePolygon(0, 1)}
                  className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-white/15"
                >
                  <ArrowRight className="h-3.5 w-3.5 text-amber-400" /> Leste
                </button>
              </div>

              <button
                type="button"
                onClick={resetPolygonToDefault}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-[#E6DFD3] hover:bg-white/15"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Padrão
              </button>

              <button
                type="button"
                onClick={copyPolygonToClipboard}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-[#11221B] hover:bg-amber-300"
              >
                {copiedJson ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copiar Coordenadas
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Ergonomic Layout on Desktop / Compact Stack on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Column (7 cols): Compact 2D Google Map */}
        <div className="lg:col-span-7 relative h-[310px] sm:h-[370px] lg:h-[450px] w-full overflow-hidden rounded-xl border border-[#C59B6D]/30 bg-[#0F1F18] shadow-lg">
          <div ref={mapContainerRef} className="h-full w-full" />

          {/* Floating Map Type Switcher (Top-Left inside Map) */}
          <div className="absolute top-3 left-3 z-[400] inline-flex rounded-lg border border-[#C59B6D]/40 bg-[#11221B]/90 p-0.5 backdrop-blur-md shadow-md">
            {(
              [
                { id: "google-hybrid", label: "Híbrido" },
                { id: "google-satellite", label: "Satélite" },
                { id: "google-roadmap", label: "Mapa" },
              ] as const
            ).map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setMapStyle(mode.id)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition cursor-pointer ${
                  mapStyle === mode.id
                    ? "bg-[#C59B6D] text-[#11221B] font-bold"
                    : "text-[#E6DFD3]/85 hover:text-white"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Discreet Calibration Button (Top-Right inside Map) */}
          <div className="absolute top-3 right-3 z-[400]">
            <button
              type="button"
              onClick={() => {
                const next = !isCalibrating;
                setIsCalibrating(next);
                if (next) flyToView("terreno");
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md transition cursor-pointer shadow-md ${
                isCalibrating
                  ? "border-amber-400 bg-amber-400 text-[#11221B]"
                  : "border-[#C59B6D]/40 bg-[#11221B]/85 text-[#E6DFD3] hover:border-[#C59B6D]"
              }`}
              title="Ajustar manualmente os pontos do polígono"
            >
              <Sliders className="h-3 w-3 text-[#C59B6D]" />
              <span>{isCalibrating ? "Fechar Ajuste" : "Ajustar Polígono"}</span>
            </button>
          </div>

          {/* Selected POI Floating Card inside Map (Bottom-Left) */}
          {selectedPoi && (
            <div className="absolute bottom-3 left-3 right-12 sm:right-auto sm:max-w-sm z-[400] rounded-lg border border-[#C59B6D]/60 bg-[#11221B]/95 p-3 text-[#F7F5F0] backdrop-blur-md shadow-xl">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C59B6D]">
                    {selectedPoi.categoryLabel} · {selectedPoi.distance} (
                    {selectedPoi.travelTime})
                  </span>
                  <h5 className="mt-0.5 text-xs sm:text-sm font-semibold text-white">
                    {selectedPoi.name}
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPoi(null)}
                  className="rounded px-1.5 py-0.5 text-xs text-[#E6DFD3]/70 hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-[#E6DFD3]/85">
                {selectedPoi.description}
              </p>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Unified Camera Views + Category Filters + Scrollable POI List */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-[#152820]/15 bg-white p-3.5 text-[#152820] shadow-lg lg:h-[450px]">
          {/* 1. Aggregated Quick Camera & Layer Controls */}
          <div className="border-b border-[#152820]/10 pb-2.5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6239]">
                Atalhos de Visualização
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowPerimeter(!showPerimeter)}
                  className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium border transition cursor-pointer ${
                    showPerimeter
                      ? "border-[#C59B6D]/60 bg-[#C59B6D]/15 text-[#152820]"
                      : "border-[#152820]/15 text-[#152820]/50"
                  }`}
                >
                  {showPerimeter ? (
                    <Eye className="h-3 w-3 text-[#8C6239]" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                  Limites
                </button>
                <button
                  type="button"
                  onClick={() => setShowPois(!showPois)}
                  className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium border transition cursor-pointer ${
                    showPois
                      ? "border-[#C59B6D]/60 bg-[#C59B6D]/15 text-[#152820]"
                      : "border-[#152820]/15 text-[#152820]/50"
                  }`}
                >
                  {showPois ? (
                    <Eye className="h-3 w-3 text-[#8C6239]" />
                  ) : (
                    <EyeOff className="h-3 w-3" />
                  )}
                  Pontos ({MAP_POIS.length})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => flyToView("terreno")}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#152820] px-2.5 py-1.5 text-[11px] font-semibold text-[#F7F5F0] transition hover:bg-[#1E3A2F] cursor-pointer"
              >
                <Maximize2 className="h-3 w-3 text-[#C59B6D] shrink-0" />
                <span className="truncate">Focar Terreno</span>
              </button>
              <button
                type="button"
                onClick={() => flyToView("br470")}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#152820]/15 bg-[#F7F5F0] px-2.5 py-1.5 text-[11px] font-medium text-[#152820] transition hover:border-[#C59B6D] cursor-pointer"
              >
                <Navigation className="h-3 w-3 text-[#0284C7] shrink-0" />
                <span className="truncate">Rota 220m BR</span>
              </button>
              <button
                type="button"
                onClick={() => flyToView("entorno")}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#152820]/15 bg-[#F7F5F0] px-2.5 py-1.5 text-[11px] font-medium text-[#152820] transition hover:border-[#C59B6D] cursor-pointer"
              >
                <Compass className="h-3 w-3 text-[#8C6239] shrink-0" />
                <span className="truncate">Ver Região</span>
              </button>
            </div>
          </div>

          {/* 2. Category Filter Tabs */}
          <div className="py-2.5 border-b border-[#152820]/10">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#152820] mb-1.5">
              Pontos de Referência Próximos ({filteredPoiList.length})
            </span>
            <div className="flex flex-wrap gap-1">
              {[
                { id: "todos", label: "Todos", icon: null },
                { id: "parque", label: "Parques (≤3km)", icon: Trees },
                { id: "mercado", label: "Mercados", icon: ShoppingCart },
                { id: "comercio", label: "Shoppings", icon: Building2 },
                { id: "educacao", label: "Faculdades", icon: GraduationCap },
                { id: "acesso", label: "Acessos", icon: Truck },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = poiFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPoiFilter(tab.id as POICategoryFilter)}
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition cursor-pointer ${
                      active
                        ? "bg-[#152820] text-[#F7F5F0]"
                        : "bg-[#F7F5F0] text-[#152820]/75 hover:bg-[#E6DFD3]/70"
                    }`}
                  >
                    {Icon && <Icon className="h-3 w-3 text-[#C59B6D]" />}
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Compact Scrollable List of POIs */}
          <div className="mt-2 flex-1 overflow-y-auto pr-1 space-y-1.5 max-h-[210px] lg:max-h-none">
            {filteredPoiList.map((poi) => {
              const isSelected = selectedPoi?.id === poi.id;
              const dotColor =
                poi.category === "parque"
                  ? "bg-green-500"
                  : poi.category === "mercado"
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
                  className={`w-full flex items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-left transition cursor-pointer ${
                    isSelected
                      ? "border-[#C59B6D] bg-[#152820] text-[#F7F5F0]"
                      : "border-[#152820]/10 bg-[#F7F5F0]/60 text-[#152820] hover:border-[#C59B6D]/50 hover:bg-[#F7F5F0]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`h-2 w-2 flex-shrink-0 rounded-full ${dotColor}`}
                    />
                    <span className="truncate text-xs font-semibold">
                      {poi.name}
                    </span>
                  </div>
                  <span
                    className={`flex-shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] ${
                      isSelected
                        ? "bg-[#C59B6D]/20 text-[#C59B6D]"
                        : "bg-[#152820]/5 text-[#8C6239]"
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
    </div>
  );
}
