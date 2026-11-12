"use client";

import React from "react";
import {
  CAD_STREET_ALIGNMENTS,
  CAD_PROPERTY_POLYGON,
  CAD_DASHED_SEGMENTS,
  CAD_DIMENSION_LINES,
  CAD_MAJOR_CONTOURS,
  CAD_MINOR_CONTOURS,
  CAD_BUILDING_2650_BOX,
  CAD_INSET_BOX,
  CAD_INSET_DETAIL_LINE,
  CAD_INSET_CALLOUT_LINE,
} from "@/data/cadSurveyData";

function pointsToSvgPath(pts: [number, number][], close = false): string {
  if (!pts.length) return "";
  const d = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`)
    .join(" ");
  return close ? `${d} Z` : d;
}

const PERIMETER_LABELS: {
  x: number;
  y: number;
  rot: number;
  text: string;
  highlight?: boolean;
}[] = [
  { x: 605, y: 235, rot: -38.8, text: "10,63 m", highlight: true },
  { x: 735, y: 258, rot: 14.9, text: "32,74 m", highlight: true },
  { x: 892, y: 306, rot: 21.8, text: "25,65 m", highlight: true },
  { x: 896, y: 405, rot: -56.9, text: "35,00 m" },
  { x: 926, y: 545, rot: 24.7, text: "30,00 m" },
  { x: 1068, y: 492, rot: -55.8, text: "35,00 m" },
  { x: 1138, y: 416, rot: 37.9, text: "9,12" },
  { x: 1176, y: 452, rot: 50.5, text: "9,48" },
  { x: 1206, y: 498, rot: 64.8, text: "10,98" },
  { x: 1226, y: 548, rot: 72.4, text: "8,41" },
  { x: 1242, y: 606, rot: 75.0, text: "13,46" },
  { x: 1260, y: 679, rot: 81.6, text: "14,07" },
  { x: 1286, y: 751, rot: 81.6, text: "14,04" },
  { x: 1300, y: 830, rot: 80.1, text: "12,51" },
  { x: 1316, y: 898, rot: 71.9, text: "12,92" },
  { x: 1326, y: 967, rot: 59.7, text: "10,93" },
  { x: 1358, y: 1014, rot: 38.0, text: "6,41" },
  { x: 1065, y: 990, rot: 5.2, text: "103,64 m" },
  { x: 850, y: 815, rot: -70.2, text: "55,94 m" },
  { x: 720, y: 650, rot: 5.6, text: "58,59 m" },
  { x: 580, y: 585, rot: -79.3, text: "20,29 m", highlight: true },
  { x: 604, y: 395, rot: -84.2, text: "47,29 m", highlight: true },
];

const ELEVATION_LABELS = [
  { x: 962, y: 1014, text: "30 m" },
  { x: 1020, y: 1018, text: "35 m" },
  { x: 1074, y: 1022, text: "40 m" },
  { x: 1131, y: 1028, text: "45 m" },
  { x: 1188, y: 1033, text: "50 m" },
  { x: 1258, y: 1037, text: "55 m" },
  { x: 1327, y: 1044, text: "60 m" },
];

export default function TopographicBlueprint() {
  const streetStroke = "#94A3B8";
  const dashedStroke = "#64748B";
  const propertyFill = "rgba(197, 155, 109, 0.14)";
  const propertyStroke = "#E6DFD3";
  const majorContourStroke = "#D97706";
  const minorContourStroke = "rgba(197, 155, 109, 0.35)";
  const textPrimary = "#F7F5F0";
  const textSecondary = "#CBD5E1";
  const accentColor = "#C59B6D";

  return (
    <div className="rounded-xl border border-[#C59B6D]/25 bg-[#11221B] text-[#F7F5F0] shadow-xl overflow-hidden">
      {/* Static 2D Vector CAD Plan */}
      <div className="relative w-full select-none overflow-hidden p-2 sm:p-4">
        <svg
          viewBox="240 50 1280 1080"
          className="w-full h-auto max-h-[640px] mx-auto block"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Planta Planialtimétrica 2D do Terreno na Rua 1º de Janeiro, 2.650"
        >
          <defs>
            <pattern
              id="cad-grid"
              width="283.46"
              height="283.45"
              patternUnits="userSpaceOnUse"
              x="202"
              y="231.7"
            >
              <path
                d="M 283.46 0 L 0 0 0 283.45"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          <g>
            {/* Subtle 50m UTM Grid Background */}
            <rect
              x="200"
              y="55"
              width="1420"
              height="1080"
              fill="url(#cad-grid)"
            />

            {/* 1. Dashed Street Centerlines ("Eixo da Via") & Neighbor Parcel Lines */}
            <g>
              {CAD_DASHED_SEGMENTS.map((seg, idx) => (
                <path
                  key={`dash-${idx}`}
                  d={pointsToSvgPath(seg)}
                  fill="none"
                  stroke={dashedStroke}
                  strokeWidth="1.2"
                  strokeDasharray="6,4"
                  opacity="0.75"
                />
              ))}
            </g>

            {/* 2. Street Alignment Lines ("Alinhamento Predial" for Rua 1º de Janeiro & Rua Frieda Beck) */}
            <g>
              {CAD_STREET_ALIGNMENTS.map((line, idx) => (
                <path
                  key={`street-${idx}`}
                  d={pointsToSvgPath(line)}
                  fill="none"
                  stroke={streetStroke}
                  strokeWidth="1.8"
                />
              ))}

              {/* Street Dimension Helper Lines (24,00m / 12,00m and 10,00m / 5,00m) */}
              {CAD_DIMENSION_LINES.map((line, idx) => (
                <path
                  key={`dimline-${idx}`}
                  d={pointsToSvgPath(line)}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1.2"
                />
              ))}

              {/* Street Names & Width Callouts */}
              <g fontFamily="var(--font-jakarta), sans-serif">
                {/* RUA 1º DE JANEIRO */}
                <text
                  x="512"
                  y="474"
                  fill={textPrimary}
                  fontSize="15"
                  fontWeight="700"
                  letterSpacing="0.12em"
                  transform="rotate(-84.2, 512, 474)"
                >
                  RUA 1º DE JANEIRO
                </text>
                <text
                  x="367"
                  y="758"
                  fill={textSecondary}
                  fontSize="10.5"
                  fontWeight="500"
                  transform="rotate(-68.5, 367, 758)"
                >
                  Alinhamento Predial (Lado Ímpar)
                </text>
                <text
                  x="512"
                  y="820"
                  fill={textSecondary}
                  fontSize="10.5"
                  fontWeight="500"
                  transform="rotate(-67.6, 512, 820)"
                >
                  Alinhamento Predial (Lado Par)
                </text>
                <text
                  x="453"
                  y="727"
                  fill={accentColor}
                  fontSize="10.5"
                  fontWeight="600"
                  transform="rotate(-67.6, 453, 727)"
                >
                  Eixo da Via
                </text>
                <text
                  x="439"
                  y="752"
                  fill={accentColor}
                  fontSize="11"
                  fontWeight="700"
                  transform="rotate(22.4, 439, 752)"
                >
                  24,00 m
                </text>
                <text
                  x="414"
                  y="720"
                  fill={textSecondary}
                  fontSize="10"
                  fontWeight="600"
                  transform="rotate(22.4, 414, 720)"
                >
                  12,00
                </text>
                <text
                  x="476"
                  y="745"
                  fill={textSecondary}
                  fontSize="10"
                  fontWeight="600"
                  transform="rotate(22.4, 476, 745)"
                >
                  12,00
                </text>

                {/* RUA FRIEDA BECK */}
                <text
                  x="742"
                  y="224"
                  fill={textPrimary}
                  fontSize="14.5"
                  fontWeight="700"
                  letterSpacing="0.1em"
                  transform="rotate(14.9, 742, 224)"
                >
                  RUA FRIEDA BECK
                </text>
                <text
                  x="883"
                  y="232"
                  fill={textSecondary}
                  fontSize="10.5"
                  fontWeight="500"
                  transform="rotate(21, 883, 232)"
                >
                  Alinhamento Predial
                </text>
                <text
                  x="874"
                  y="260"
                  fill={accentColor}
                  fontSize="10.5"
                  fontWeight="600"
                  transform="rotate(21.7, 874, 260)"
                >
                  Eixo da Via
                </text>
                <text
                  x="655"
                  y="184"
                  fill={textSecondary}
                  fontSize="9.5"
                  transform="rotate(14.7, 655, 184)"
                >
                  Lado Ímpar
                </text>
                <text
                  x="651"
                  y="226"
                  fill={textSecondary}
                  fontSize="9.5"
                  transform="rotate(14.7, 651, 226)"
                >
                  Lado Par
                </text>
                <text
                  x="696"
                  y="226"
                  fill={accentColor}
                  fontSize="10.5"
                  fontWeight="700"
                  transform="rotate(-75.1, 696, 226)"
                >
                  10,00
                </text>
                <text
                  x="716"
                  y="214"
                  fill={textSecondary}
                  fontSize="9.5"
                  transform="rotate(-75.1, 716, 214)"
                >
                  5,00
                </text>
                <text
                  x="710"
                  y="241"
                  fill={textSecondary}
                  fontSize="9.5"
                  transform="rotate(-75.1, 710, 241)"
                >
                  5,00
                </text>
              </g>
            </g>

            {/* 3. Property Polygon Fill */}
            <path
              d={pointsToSvgPath(CAD_PROPERTY_POLYGON, true)}
              fill={propertyFill}
              stroke="none"
            />

            {/* 4. Topographic Contour Lines (30m to 60m) */}
            <g>
              {CAD_MINOR_CONTOURS.map((c, idx) => (
                <path
                  key={`min-c-${idx}`}
                  d={pointsToSvgPath(c)}
                  fill="none"
                  stroke={minorContourStroke}
                  strokeWidth="1"
                />
              ))}
              {CAD_MAJOR_CONTOURS.map((c, idx) => (
                <path
                  key={`maj-c-${idx}`}
                  d={pointsToSvgPath(c)}
                  fill="none"
                  stroke={majorContourStroke}
                  strokeWidth="1.6"
                />
              ))}

              {/* Elevation Labels (30 m .. 60 m) */}
              {ELEVATION_LABELS.map((el) => (
                <text
                  key={el.text}
                  x={el.x}
                  y={el.y}
                  fill={majorContourStroke}
                  fontSize="12"
                  fontWeight="700"
                  fontFamily="var(--font-jetbrains), monospace"
                  textAnchor="middle"
                >
                  {el.text}
                </text>
              ))}
            </g>

            {/* 5. Official 10.361,46 m² Property Boundary Outline */}
            <path
              d={pointsToSvgPath(CAD_PROPERTY_POLYGON, true)}
              fill="none"
              stroke={propertyStroke}
              strokeWidth="3"
              strokeLinejoin="round"
            />

            {/* Highlight Primary West Frontage (Rua 1º de Janeiro) */}
            <path
              d="M 562.1,641.8 L 583.1,528.8 L 607.3,261.9 L 619.7,238.1 L 650.6,231.9"
              fill="none"
              stroke="#C59B6D"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* Building nº 2.650 Box & Setback */}
            <g>
              <path
                d={pointsToSvgPath(CAD_BUILDING_2650_BOX, true)}
                fill="#1E3A2F"
                stroke={propertyStroke}
                strokeWidth="1.5"
              />
              <text
                x="668"
                y="297"
                fill={textPrimary}
                fontSize="11.5"
                fontWeight="700"
                textAnchor="middle"
                fontFamily="var(--font-jakarta), sans-serif"
              >
                nº 2.650
              </text>
              <text
                x="624"
                y="270"
                fill={textSecondary}
                fontSize="9.5"
                fontWeight="600"
                fontFamily="var(--font-jetbrains), monospace"
              >
                6,00m
              </text>
            </g>

            {/* Center Area Title */}
            <g textAnchor="middle" fontFamily="var(--font-jakarta), sans-serif">
              <rect
                x="690"
                y="416"
                width="136"
                height="44"
                rx="6"
                fill="rgba(17,34,27,0.88)"
                stroke="#C59B6D"
                strokeWidth="1.2"
              />
              <text
                x="758"
                y="434"
                fill={accentColor}
                fontSize="11"
                fontWeight="700"
              >
                ÁREA TOTAL
              </text>
              <text
                x="758"
                y="451"
                fill={textPrimary}
                fontSize="13.5"
                fontWeight="800"
              >
                10.361,46 m²
              </text>
            </g>

            {/* 6. Perimeter Dimensions, Neighbor Confrontantes & Detail Box */}
            <g fontFamily="var(--font-jetbrains), monospace">
              {/* Vertex Dots */}
              {CAD_PROPERTY_POLYGON.map((pt, idx) => (
                <circle
                  key={`v-${idx}`}
                  cx={pt[0]}
                  cy={pt[1]}
                  r="3"
                  fill="#C59B6D"
                  stroke="#11221B"
                  strokeWidth="1"
                />
              ))}

              {/* Segment Length Labels */}
              {PERIMETER_LABELS.map((lbl, idx) => (
                <text
                  key={`plbl-${idx}`}
                  x={lbl.x}
                  y={lbl.y}
                  fill={lbl.highlight ? accentColor : textPrimary}
                  fontSize={lbl.highlight ? "11.5" : "10.5"}
                  fontWeight="700"
                  textAnchor="middle"
                  transform={`rotate(${lbl.rot}, ${lbl.x}, ${lbl.y})`}
                >
                  {lbl.text}
                </text>
              ))}

              {/* Neighbor Confrontantes */}
              <g
                fontFamily="var(--font-jakarta), sans-serif"
                textAnchor="middle"
              >
                {/* Ewaldo Mund */}
                <text
                  x="975"
                  y="446"
                  fill={textPrimary}
                  fontSize="11.5"
                  fontWeight="700"
                >
                  EWALDO MUND
                </text>
                <text
                  x="975"
                  y="461"
                  fill={textSecondary}
                  fontSize="9.5"
                  fontWeight="500"
                >
                  MATRÍCULA Nº 25.220 - 3º OFÍCIO
                </text>

                {/* Ademir Goldacker */}
                <text
                  x="705"
                  y="777"
                  fill={textPrimary}
                  fontSize="11.5"
                  fontWeight="700"
                >
                  ADEMIR GOLDACKER
                </text>
                <text
                  x="705"
                  y="792"
                  fill={textSecondary}
                  fontSize="9.5"
                  fontWeight="500"
                >
                  MATRÍCULA Nº 25.018 - 3º OFÍCIO
                </text>

                {/* JE Comércio */}
                <text
                  x="1065"
                  y="1058"
                  fill={textPrimary}
                  fontSize="11.5"
                  fontWeight="700"
                >
                  JE - COMÉRCIO E LOCAÇÕES LTDA EPP
                </text>
                <text
                  x="1065"
                  y="1073"
                  fill={textSecondary}
                  fontSize="9.5"
                  fontWeight="500"
                >
                  MATRÍCULA Nº 25.679 - 3º OFÍCIO
                </text>
              </g>

              {/* Inset Detail Box (0,37 m jog between V19 and V20) */}
              <g>
                <path
                  d={pointsToSvgPath(CAD_INSET_BOX, true)}
                  fill="#0C1813"
                  stroke={streetStroke}
                  strokeWidth="1.2"
                />
                <path
                  d={pointsToSvgPath(CAD_INSET_DETAIL_LINE)}
                  fill="none"
                  stroke="#C59B6D"
                  strokeWidth="2"
                />
                <path
                  d={pointsToSvgPath(CAD_INSET_CALLOUT_LINE)}
                  fill="none"
                  stroke={dashedStroke}
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <text
                  x="692"
                  y="888"
                  fill={accentColor}
                  fontSize="10.5"
                  fontWeight="700"
                >
                  Detalhe: 0,37 m
                </text>
              </g>
            </g>

            {/* 7. Compass Rose (Top-Left) */}
            <g transform="translate(335, 145)">
              <circle
                cx="0"
                cy="0"
                r="28"
                fill="rgba(12,24,19,0.8)"
                stroke="#C59B6D"
                strokeWidth="1.2"
              />
              <polygon points="0,-22 5,0 0,-5 -5,0" fill="#C59B6D" />
              <polygon
                points="0,22 5,0 0,5 -5,0"
                fill={textSecondary}
                opacity="0.5"
              />
              <line
                x1="-20"
                y1="0"
                x2="20"
                y2="0"
                stroke="#C59B6D"
                strokeWidth="1"
              />
              <text
                x="0"
                y="-33"
                textAnchor="middle"
                fill="#C59B6D"
                fontSize="11"
                fontWeight="800"
              >
                N
              </text>
              <text
                x="0"
                y="41"
                textAnchor="middle"
                fill={textSecondary}
                fontSize="9"
                fontWeight="600"
              >
                S
              </text>
              <text
                x="35"
                y="3"
                textAnchor="middle"
                fill={textSecondary}
                fontSize="9"
                fontWeight="600"
              >
                L
              </text>
              <text
                x="-35"
                y="3"
                textAnchor="middle"
                fill={textSecondary}
                fontSize="9"
                fontWeight="600"
              >
                O
              </text>
            </g>

            {/* 8. Graphic Scale Bar (Bottom-Left: 0 — 5 — 10 — 20 — 30 — 40 Metros) */}
            <g
              transform="translate(290, 1070)"
              fontFamily="var(--font-jetbrains), monospace"
            >
              <text
                x="0"
                y="-10"
                fill={textSecondary}
                fontSize="10"
                fontWeight="600"
              >
                ESCALA GRÁFICA (METROS)
              </text>
              <rect x="0" y="0" width="28.35" height="6" fill="#C59B6D" />
              <rect
                x="28.35"
                y="0"
                width="28.35"
                height="6"
                fill="none"
                stroke="#C59B6D"
                strokeWidth="1"
              />
              <rect x="56.7" y="0" width="56.7" height="6" fill="#C59B6D" />
              <rect
                x="113.4"
                y="0"
                width="56.7"
                height="6"
                fill="none"
                stroke="#C59B6D"
                strokeWidth="1"
              />
              <rect x="170.1" y="0" width="56.7" height="6" fill="#C59B6D" />
              <text
                x="0"
                y="19"
                fill={textPrimary}
                fontSize="10"
                textAnchor="middle"
              >
                0
              </text>
              <text
                x="28.35"
                y="19"
                fill={textPrimary}
                fontSize="10"
                textAnchor="middle"
              >
                5
              </text>
              <text
                x="56.7"
                y="19"
                fill={textPrimary}
                fontSize="10"
                textAnchor="middle"
              >
                10
              </text>
              <text
                x="113.4"
                y="19"
                fill={textPrimary}
                fontSize="10"
                textAnchor="middle"
              >
                20
              </text>
              <text
                x="170.1"
                y="19"
                fill={textPrimary}
                fontSize="10"
                textAnchor="middle"
              >
                30
              </text>
              <text
                x="226.8"
                y="19"
                fill={textPrimary}
                fontSize="10"
                textAnchor="middle"
              >
                40 m
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
