"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MAP_POIS,
  MapPOI,
  PROPERTY_POLYGON_VERTICES,
  PROPERTY_SUMMARY,
} from "@/data/propertyData";
import {
  Compass,
  ExternalLink,
  Layers,
  MapPin,
  Navigation,
  Route,
} from "lucide-react";

type MapStyleMode = "hybrid" | "satellite" | "roadmap";
type CategoryFilter = "all" | MapPOI["category"];

interface ViewPreset2D {
  id: string;
  label: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
}

const VIEW_PRESETS_2D: ViewPreset2D[] = [
  {
    id: "terreno",
    label: "1. Visão do Terreno (10.361 m²)",
    center: [-26.857203, -49.075768],
    zoom: 18,
  },
  {
    id: "br470",
    label: "2. Acesso à BR-470 (220 m)",
    center: [-26.85585, -49.07605],
    zoom: 17,
  },
  {
    id: "regiao",
    label: "3. Vizinhança & Serviços Próximos",
    center: [-26.8565, -49.0785],
    zoom: 14,
  },
];

export function InteractiveMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const polygonLayerRef = useRef<any>(null);
  const frontagesGroupRef = useRef<any>(null);
  const zoningGroupRef = useRef<any>(null);
  const ringsGroupRef = useRef<any>(null);
  const poiMarkersRef = useRef<Record<string, any>>({});

  const [mapStyle, setMapStyle] = useState<MapStyleMode>("hybrid");
  const [activePresetId, setActivePresetId] = useState<string>("terreno");
  const [showDemarcation, setShowDemarcation] = useState<boolean>(true);
  const [showFrontages, setShowFrontages] = useState<boolean>(true);
  const [showZoning, setShowZoning] = useState<boolean>(false);
  const [showDistanceRings, setShowDistanceRings] = useState<boolean>(false);

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [selectedPoiId, setSelectedPoiId] = useState<string>("acesso-principal");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const filteredPois =
    activeCategory === "all"
      ? MAP_POIS
      : MAP_POIS.filter((p) => p.category === activeCategory);

  useEffect(() => {
    let isMounted = true;

    async function initLeaflet2D() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const mod: any = await import("leaflet");
      const L = mod.default ?? mod;
      if (!isMounted || !mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [
          PROPERTY_SUMMARY.centerCoordinates.lat,
          PROPERTY_SUMMARY.centerCoordinates.lng,
        ],
        zoom: 18,
        minZoom: 12,
        maxZoom: 20,
        zoomControl: false,
        scrollWheelZoom: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

      // Razor-sharp 2D Google Maps Hybrid Tiles (Satellite + Official Google Labels)
      const tileLayer = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        {
          maxZoom: 20,
          attribution: "Dados cartográficos © Google Maps",
        }
      ).addTo(map);
      tileLayerRef.current = tileLayer;

      // 1. Property Demarcation Group (Polygon + Center Badge)
      const demarcationGroup = L.layerGroup().addTo(map);

      const latLngs = PROPERTY_POLYGON_VERTICES.map(
        (v) => [v.lat, v.lng] as [number, number]
      );

      const mainPolygon = L.polygon(latLngs, {
        color: "#D4A373",
        weight: 3,
        opacity: 1,
        fillColor: "#C59B6D",
        fillOpacity: 0.26,
      }).addTo(demarcationGroup);

      mainPolygon.bindPopup(`
        <div style="font-family: sans-serif; min-width: 220px; padding: 4px;">
          <div style="font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #8C6239; font-weight: 700;">
            TERRENO DEMARCADO
          </div>
          <div style="font-size: 16px; font-weight: 700; color: #11221B; margin-top: 2px;">
            10.361,46 m²
          </div>
          <div style="font-size: 12px; color: #334139; margin-top: 4px; line-height: 1.45;">
            Rua 1º de Janeiro, nº 2.650 esq. Rua Frieda Beck<br/>
            <strong>Zoneamento:</strong> ZI-1 e ZOC<br/>
            <strong>Segurança:</strong> 100% livre de enchente (30m–60m)
          </div>
        </div>
      `);

      // Center Floating Badge on the Terrain
      const centerBadgeIcon = L.divIcon({
        className: "terra-center-badge",
        html: `
          <div style="
            transform: translate(-50%, -50%);
            background: rgba(17, 34, 27, 0.92);
            border: 1.5px solid #C59B6D;
            padding: 5px 10px;
            color: #F7F5F0;
            font-family: sans-serif;
            text-align: center;
            box-shadow: 0 8px 20px rgba(0,0,0,0.45);
            white-space: nowrap;
            pointer-events: none;
          ">
            <div style="font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: #C59B6D; font-weight: 700;">
              ÁREA TOTAL
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #F7F5F0;">
              10.361 m²
            </div>
          </div>
        `,
        iconSize: [0, 0],
      });

      L.marker(
        [
          PROPERTY_SUMMARY.centerCoordinates.lat,
          PROPERTY_SUMMARY.centerCoordinates.lng,
        ],
        { icon: centerBadgeIcon, interactive: false }
      ).addTo(demarcationGroup);

      polygonLayerRef.current = demarcationGroup;

      // 2. Frontages & BR-470 Corridor Group
      const frontagesGroup = L.layerGroup().addTo(map);

      // Rua 1º de Janeiro Frontage (67,58 m + 10,63 m esquina)
      const rua1Coords: [number, number][] = [
        [PROPERTY_POLYGON_VERTICES[20].lat, PROPERTY_POLYGON_VERTICES[20].lng],
        [PROPERTY_POLYGON_VERTICES[21].lat, PROPERTY_POLYGON_VERTICES[21].lng],
        [PROPERTY_POLYGON_VERTICES[0].lat, PROPERTY_POLYGON_VERTICES[0].lng],
        [PROPERTY_POLYGON_VERTICES[1].lat, PROPERTY_POLYGON_VERTICES[1].lng],
      ];

      L.polyline(rua1Coords, {
        color: "#F4D06F",
        weight: 6,
        opacity: 0.95,
      })
        .bindTooltip("Frente Rua 1º de Janeiro · 67,5 m + esquina", {
          sticky: true,
        })
        .addTo(frontagesGroup);

      // Rua Frieda Beck North & East Frontages (180,72 m total)
      const friedaNorthCoords: [number, number][] = [
        [PROPERTY_POLYGON_VERTICES[1].lat, PROPERTY_POLYGON_VERTICES[1].lng],
        [PROPERTY_POLYGON_VERTICES[2].lat, PROPERTY_POLYGON_VERTICES[2].lng],
        [PROPERTY_POLYGON_VERTICES[3].lat, PROPERTY_POLYGON_VERTICES[3].lng],
      ];

      L.polyline(friedaNorthCoords, {
        color: "#52B788",
        weight: 5,
        opacity: 0.95,
      })
        .bindTooltip("Frente Norte Rua Frieda Beck · 58,4 m", { sticky: true })
        .addTo(frontagesGroup);

      const friedaEastCoords: [number, number][] = PROPERTY_POLYGON_VERTICES.slice(
        6,
        18
      ).map((v) => [v.lat, v.lng]);

      L.polyline(friedaEastCoords, {
        color: "#52B788",
        weight: 5,
        opacity: 0.95,
      })
        .bindTooltip("Frente Leste Rua Frieda Beck · 122,3 m", { sticky: true })
        .addTo(frontagesGroup);

      // Dashed route from terrain up to BR-470 (220 m)
      const br470RouteCoords: [number, number][] = [
        [-26.85658, -49.07635],
        [-26.85595, -49.07628],
        [-26.85525, -49.07621],
        [-26.85465, -49.07615],
      ];

      L.polyline(br470RouteCoords, {
        color: "#E09F3E",
        weight: 4,
        dashArray: "8, 8",
        opacity: 0.95,
      })
        .bindTooltip("Ligação direta até a BR-470 (220 metros)", {
          sticky: true,
        })
        .addTo(frontagesGroup);

      frontagesGroupRef.current = frontagesGroup;

      // 3. Zoning Sub-Zones Group (ZI-1 vs ZOC)
      const zoningGroup = L.layerGroup();

      const zi1Coords: [number, number][] = [
        [PROPERTY_POLYGON_VERTICES[0].lat, PROPERTY_POLYGON_VERTICES[0].lng],
        [PROPERTY_POLYGON_VERTICES[1].lat, PROPERTY_POLYGON_VERTICES[1].lng],
        [-26.856565, -49.07603],
        [-26.857205, -49.07601],
        [PROPERTY_POLYGON_VERTICES[19].lat, PROPERTY_POLYGON_VERTICES[19].lng],
        [PROPERTY_POLYGON_VERTICES[20].lat, PROPERTY_POLYGON_VERTICES[20].lng],
        [PROPERTY_POLYGON_VERTICES[21].lat, PROPERTY_POLYGON_VERTICES[21].lng],
      ];

      L.polygon(zi1Coords, {
        color: "#E09F3E",
        weight: 2,
        fillColor: "#E09F3E",
        fillOpacity: 0.38,
      })
        .bindTooltip("Zona Industrial 1 (ZI-1) · Frente R. 1º de Janeiro", {
          sticky: true,
        })
        .addTo(zoningGroup);

      const zocCoords: [number, number][] = [
        [-26.856565, -49.07603],
        [PROPERTY_POLYGON_VERTICES[2].lat, PROPERTY_POLYGON_VERTICES[2].lng],
        [PROPERTY_POLYGON_VERTICES[3].lat, PROPERTY_POLYGON_VERTICES[3].lng],
        [PROPERTY_POLYGON_VERTICES[4].lat, PROPERTY_POLYGON_VERTICES[4].lng],
        [PROPERTY_POLYGON_VERTICES[5].lat, PROPERTY_POLYGON_VERTICES[5].lng],
        [PROPERTY_POLYGON_VERTICES[6].lat, PROPERTY_POLYGON_VERTICES[6].lng],
        ...PROPERTY_POLYGON_VERTICES.slice(7, 19).map(
          (v) => [v.lat, v.lng] as [number, number]
        ),
        [PROPERTY_POLYGON_VERTICES[19].lat, PROPERTY_POLYGON_VERTICES[19].lng],
        [-26.857205, -49.07601],
      ];

      L.polygon(zocCoords, {
        color: "#52B788",
        weight: 2,
        fillColor: "#52B788",
        fillOpacity: 0.35,
      })
        .bindTooltip("Zona de Ocupação Controlada (ZOC) · Parte Alta", {
          sticky: true,
        })
        .addTo(zoningGroup);

      zoningGroupRef.current = zoningGroup;

      // 4. Distance Reference Rings (250m, 1km, 2.5km)
      const ringsGroup = L.layerGroup();
      [
        { radius: 250, label: "Raio 250 m (Trevo BR-470)" },
        { radius: 1000, label: "Raio 1 km (Serviços do Bairro)" },
        { radius: 2500, label: "Raio 2,5 km (Terminal / Aeroporto)" },
      ].forEach((r) => {
        L.circle(
          [
            PROPERTY_SUMMARY.centerCoordinates.lat,
            PROPERTY_SUMMARY.centerCoordinates.lng,
          ],
          {
            radius: r.radius,
            color: "#C59B6D",
            weight: 1.5,
            dashArray: "6, 6",
            fillOpacity: 0.03,
          }
        )
          .bindTooltip(r.label, { sticky: true })
          .addTo(ringsGroup);
      });
      ringsGroupRef.current = ringsGroup;

      // 5. Reference Points & Public Services Pins
      MAP_POIS.forEach((poi) => {
        const badgeColor =
          poi.category === "acesso"
            ? "#F4D06F"
            : poi.category === "logistica"
            ? "#E09F3E"
            : poi.category === "servico-publico"
            ? "#52B788"
            : "#C59B6D";

        const shortTitle = poi.name.split("·")[0].trim();

        const icon = L.divIcon({
          className: "terra-poi-pin-2d",
          html: `
            <div style="
              transform: translate(-50%, -50%);
              display: inline-flex;
              align-items: center;
              gap: 6px;
              background: rgba(17, 34, 27, 0.94);
              border: 1.5px solid ${badgeColor};
              padding: 4px 9px;
              border-radius: 9999px;
              box-shadow: 0 6px 16px rgba(0,0,0,0.45);
              color: #F7F5F0;
              font-family: sans-serif;
              font-size: 11px;
              font-weight: 600;
              white-space: nowrap;
            ">
              <span style="width: 8px; height: 8px; border-radius: 9999px; background: ${badgeColor}; display: inline-block; flex-shrink: 0;"></span>
              <span>${shortTitle}</span>
            </div>
          `,
          iconSize: [0, 0],
        });

        const marker = L.marker([poi.lat, poi.lng], { icon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 220px; padding: 4px;">
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #8C6239; font-weight: 700;">
              ${poi.categoryLabel} · ${poi.distance}
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #11221B; margin-top: 3px;">
              ${poi.name}
            </div>
            <div style="font-size: 12px; color: #3D4A44; margin-top: 5px; line-height: 1.45;">
              ${poi.description}
            </div>
            <div style="margin-top: 8px;">
              <a href="https://www.google.com/maps/dir/?api=1&destination=${poi.lat},${poi.lng}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; font-weight: 700; color: #8C6239; text-decoration: underline;">
                Traçar rota no Google Maps →
              </a>
            </div>
          </div>
        `);

        marker.on("click", () => {
          setSelectedPoiId(poi.id);
        });

        poiMarkersRef.current[poi.id] = marker;
      });

      mapInstanceRef.current = map;
      setIsLoaded(true);
    }

    initLeaflet2D();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Switch Google Maps Base Layer (Hybrid / Satellite / Roadmap)
  useEffect(() => {
    if (!tileLayerRef.current) return;
    const lyrs =
      mapStyle === "hybrid" ? "y" : mapStyle === "satellite" ? "s" : "m";
    tileLayerRef.current.setUrl(
      `https://mt1.google.com/vt/lyrs=${lyrs}&x={x}&y={y}&z={z}`
    );
  }, [mapStyle]);

  // Toggle Demarcation Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = polygonLayerRef.current;
    if (!map || !group) return;
    if (showDemarcation) {
      if (!map.hasLayer(group)) map.addLayer(group);
    } else {
      if (map.hasLayer(group)) map.removeLayer(group);
    }
  }, [showDemarcation]);

  // Toggle Frontages Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = frontagesGroupRef.current;
    if (!map || !group) return;
    if (showFrontages) {
      if (!map.hasLayer(group)) map.addLayer(group);
    } else {
      if (map.hasLayer(group)) map.removeLayer(group);
    }
  }, [showFrontages]);

  // Toggle Zoning Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = zoningGroupRef.current;
    if (!map || !group) return;
    if (showZoning) {
      if (!map.hasLayer(group)) map.addLayer(group);
    } else {
      if (map.hasLayer(group)) map.removeLayer(group);
    }
  }, [showZoning]);

  // Toggle Distance Rings
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = ringsGroupRef.current;
    if (!map || !group) return;
    if (showDistanceRings) {
      if (!map.hasLayer(group)) map.addLayer(group);
    } else {
      if (map.hasLayer(group)) map.removeLayer(group);
    }
  }, [showDistanceRings]);

  const handleSelectViewPreset = (preset: ViewPreset2D) => {
    setActivePresetId(preset.id);
    const map = mapInstanceRef.current;
    if (!map) return;
    if (preset.id === "regiao") {
      setShowDistanceRings(true);
    }
    map.flyTo(preset.center, preset.zoom, { duration: 1.2 });
  };

  const handleSelectPoi = (poi: MapPOI) => {
    setSelectedPoiId(poi.id);
    const map = mapInstanceRef.current;
    if (!map) return;
    const targetZoom =
      poi.category === "acesso" ? 18 : poi.id === "trevo-br470" ? 17 : 15;
    map.flyTo([poi.lat, poi.lng], targetZoom, { duration: 1.2 });
    const marker = poiMarkersRef.current[poi.id];
    if (marker) {
      marker.openPopup();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Quick View Bar */}
      <div className="bg-[#152820] border border-[#C59B6D]/30 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <MapPin className="w-5 h-5 text-[#C59B6D] shrink-0" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#C59B6D]">
              Enquadramentos Rápidos no Google Maps
            </div>
            <div className="text-xs text-[#E6DFD3]/85">
              Alterne entre a visão detalhada das divisas do terreno, o acesso à BR-470 ou os serviços da região:
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {VIEW_PRESETS_2D.map((preset) => {
            const active = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectViewPreset(preset)}
                className={`px-3.5 py-2 text-xs font-medium border transition cursor-pointer ${
                  active
                    ? "bg-[#C59B6D] text-[#11221B] border-[#C59B6D] font-bold"
                    : "bg-[#11221B] text-[#E6DFD3] border-[#F7F5F0]/15 hover:border-[#C59B6D]/60"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Sidebar Controls + 2D Google Map Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Interactive Control Panel & POIs */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-[#152820] border border-[#C59B6D]/25 p-6 text-[#F7F5F0]">
          <div>
            {/* Layer Toggles */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#C59B6D] mb-2.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#C59B6D]" />
                O que destacar no mapa
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowDemarcation((v) => !v)}
                  className={`px-3 py-2.5 text-left text-xs border transition cursor-pointer flex items-center justify-between ${
                    showDemarcation
                      ? "bg-[#C59B6D]/20 border-[#C59B6D] text-[#F7F5F0]"
                      : "bg-[#11221B]/60 border-[#F7F5F0]/15 text-[#E6DFD3]/60"
                  }`}
                >
                  <span>Área 10.361 m²</span>
                  <span className="w-2 h-2 rounded-full bg-[#C59B6D]" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowFrontages((v) => !v)}
                  className={`px-3 py-2.5 text-left text-xs border transition cursor-pointer flex items-center justify-between ${
                    showFrontages
                      ? "bg-[#F4D06F]/15 border-[#F4D06F] text-[#F7F5F0]"
                      : "bg-[#11221B]/60 border-[#F7F5F0]/15 text-[#E6DFD3]/60"
                  }`}
                >
                  <span>Frentes & BR-470</span>
                  <span className="w-2 h-2 rounded-full bg-[#F4D06F]" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowZoning((v) => !v)}
                  className={`px-3 py-2.5 text-left text-xs border transition cursor-pointer flex items-center justify-between ${
                    showZoning
                      ? "bg-[#52B788]/20 border-[#52B788] text-[#F7F5F0]"
                      : "bg-[#11221B]/60 border-[#F7F5F0]/15 text-[#E6DFD3]/60"
                  }`}
                >
                  <span>Zonas ZI-1 e ZOC</span>
                  <span className="w-2 h-2 rounded-full bg-[#52B788]" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowDistanceRings((v) => !v)}
                  className={`px-3 py-2.5 text-left text-xs border transition cursor-pointer flex items-center justify-between ${
                    showDistanceRings
                      ? "bg-[#C59B6D]/20 border-[#C59B6D] text-[#F7F5F0]"
                      : "bg-[#11221B]/60 border-[#F7F5F0]/15 text-[#E6DFD3]/60"
                  }`}
                >
                  <span>Raios de Distância</span>
                  <span className="w-2 h-2 rounded-full bg-[#E6DFD3]" />
                </button>
              </div>
            </div>

            {/* Category Filter for POIs */}
            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#C59B6D] mb-2.5 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#C59B6D]" />
                Acessos, Rodovia & Serviços Próximos
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {[
                  { id: "all", label: "Todos" },
                  { id: "acesso", label: "Acessos" },
                  { id: "logistica", label: "BR-470 & Aeroporto" },
                  { id: "servico-publico", label: "Serviços Públicos" },
                  { id: "infraestrutura", label: "Comércio & Centro" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategory(tab.id as CategoryFilter)}
                    className={`px-2.5 py-1 text-xs border transition cursor-pointer ${
                      activeCategory === tab.id
                        ? "bg-[#C59B6D] text-[#11221B] border-[#C59B6D] font-semibold"
                        : "bg-transparent text-[#E6DFD3]/75 border-[#F7F5F0]/15 hover:border-[#C59B6D]/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* POI List */}
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {filteredPois.map((poi) => {
                  const isSelected = poi.id === selectedPoiId;
                  return (
                    <button
                      key={poi.id}
                      type="button"
                      onClick={() => handleSelectPoi(poi)}
                      className={`w-full text-left p-3.5 border transition cursor-pointer ${
                        isSelected
                          ? "bg-[#1D352B] border-[#C59B6D]"
                          : "bg-[#11221B]/55 border-[#F7F5F0]/10 hover:border-[#C59B6D]/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-[#C59B6D]">
                          {poi.categoryLabel}
                        </span>
                        <span className="text-xs text-[#E6DFD3]/85 font-medium">
                          {poi.distance} · {poi.travelTime}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-[#F7F5F0] mt-1">
                        {poi.name}
                      </div>
                      <p className="text-xs text-[#E6DFD3]/75 mt-1 line-clamp-2 leading-relaxed">
                        {poi.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Direct Google Maps Actions */}
          <div className="mt-6 pt-4 border-t border-[#F7F5F0]/10 grid grid-cols-2 gap-2.5">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${PROPERTY_SUMMARY.centerCoordinates.lat},${PROPERTY_SUMMARY.centerCoordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium border border-[#C59B6D]/50 text-[#F7F5F0] hover:bg-[#C59B6D]/15 transition"
            >
              <span>Abrir no Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C59B6D]" />
            </a>
            <a
              href="https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=-26.85678,-49.07638"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium border border-[#F7F5F0]/20 text-[#E6DFD3] hover:border-[#C59B6D]/50 transition"
            >
              <span>Ver Rua (Street View)</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#C59B6D]" />
            </a>
          </div>
        </div>

        {/* Right Interactive 2D Google Map Viewport */}
        <div className="lg:col-span-8 relative min-h-[540px] lg:min-h-[640px] bg-[#0D1B15] border border-[#C59B6D]/30 overflow-hidden">
          {/* Top Floating Bar: Map Mode Switcher */}
          <div className="absolute top-4 left-4 right-4 z-[500] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div className="bg-[#11221B]/90 backdrop-blur-md border border-[#C59B6D]/35 px-3.5 py-2 text-xs text-[#F7F5F0] pointer-events-auto flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C59B6D]" />
              <span>Rua 1º de Janeiro, nº 2.650 · Bairro Fidélis, Blumenau</span>
            </div>

            <div className="bg-[#11221B]/90 backdrop-blur-md border border-[#C59B6D]/35 p-1 flex items-center gap-1 pointer-events-auto">
              {(
                [
                  { id: "hybrid", label: "Satélite + Ruas" },
                  { id: "satellite", label: "Satélite Puro" },
                  { id: "roadmap", label: "Mapa de Ruas" },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setMapStyle(mode.id)}
                  className={`px-3 py-1 text-xs transition cursor-pointer ${
                    mapStyle === mode.id
                      ? "bg-[#C59B6D] text-[#11221B] font-semibold"
                      : "text-[#E6DFD3]/80 hover:text-[#F7F5F0]"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Legend Overlay */}
          <div className="absolute bottom-6 left-4 z-[500] bg-[#11221B]/92 backdrop-blur-md border border-[#C59B6D]/30 px-4 py-3 text-xs text-[#F7F5F0] max-w-md pointer-events-auto">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C59B6D] mb-1.5">
              Legenda do Mapa
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-[#E6DFD3]/90">
              <div className="flex items-center gap-2">
                <span className="w-3 h-2 bg-[#C59B6D]/50 border border-[#D4A373] inline-block" />
                <span>Terreno (10.361 m²)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-[#F4D06F] inline-block" />
                <span>Frente R. 1º de Janeiro (67,5m)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-[#52B788] inline-block" />
                <span>Frente R. Frieda Beck (180,7m)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 border-b-2 border-dashed border-[#E09F3E] inline-block" />
                <span>Rota até a BR-470 (220 m)</span>
              </div>
            </div>
          </div>

          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#11221B] text-[#E6DFD3] text-sm z-20">
              Carregando Google Maps...
            </div>
          )}

          <div
            ref={mapContainerRef}
            className="w-full h-full min-h-[540px] lg:min-h-[640px]"
          />
        </div>
      </div>
    </div>
  );
}
