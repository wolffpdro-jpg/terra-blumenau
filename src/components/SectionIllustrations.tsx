import React from "react";

/**
 * Minimalist line illustrations for Section 04 cards.
 * Palette follows the site identity: deep green, bronze, soft green, cream.
 */

type Kind = "house-deck" | "events-garden" | "old-house";

const BRONZE = "#C59B6D";
const GREEN = "#52B788";
const CREAM = "#E6DFD3";
const DEEP = "#11221B";

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <line x1="0" y1="0" x2="0" y2="-26" stroke={CREAM} strokeOpacity="0.7" strokeWidth="2" />
      <circle cx="0" cy="-40" r="16" fill={GREEN} fillOpacity="0.25" stroke={GREEN} strokeWidth="1.8" />
      <circle cx="-9" cy="-30" r="9" fill={GREEN} fillOpacity="0.2" stroke={GREEN} strokeWidth="1.5" />
      <circle cx="10" cy="-31" r="10" fill={GREEN} fillOpacity="0.2" stroke={GREEN} strokeWidth="1.5" />
    </g>
  );
}

function Leaf({ x, y, r = 0 }: { x: number; y: number; r?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) rotate(${r})`}
      d="M0 0 C 8 -10 8 -22 0 -30 C -8 -22 -8 -10 0 0 Z"
      fill={GREEN}
      fillOpacity="0.28"
      stroke={GREEN}
      strokeWidth="1.5"
    />
  );
}

export function SectionIllustration({
  kind,
  label,
}: {
  kind: Kind;
  label: string;
}) {
  return (
    <svg
      viewBox="0 0 400 208"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label}
      className="w-full h-full"
    >
      <defs>
        <linearGradient id={`sky-${kind}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1D352B" />
          <stop offset="1" stopColor="#152820" />
        </linearGradient>
      </defs>
      <rect width="400" height="208" fill={`url(#sky-${kind})`} />

      {/* sun / moon */}
      <circle cx="326" cy="52" r="20" fill={BRONZE} fillOpacity="0.18" stroke={BRONZE} strokeWidth="1.8" />

      {/* distant hills */}
      <path
        d="M0 148 C 60 118 110 118 170 140 C 230 112 300 108 400 142 L400 208 L0 208 Z"
        fill={GREEN}
        fillOpacity="0.10"
      />
      {/* ground */}
      <line x1="0" y1="172" x2="400" y2="172" stroke={CREAM} strokeOpacity="0.35" strokeWidth="1.5" />
      <rect y="172" width="400" height="36" fill={DEEP} fillOpacity="0.55" />

      {kind === "house-deck" && (
        <g>
          {/* house body */}
          <rect x="120" y="112" width="120" height="60" fill="none" stroke={CREAM} strokeWidth="2.2" />
          <polygon points="108,112 180,70 252,112" fill={BRONZE} fillOpacity="0.2" stroke={BRONZE} strokeWidth="2.2" strokeLinejoin="round" />
          {/* door + window */}
          <rect x="138" y="130" width="22" height="42" fill="none" stroke={BRONZE} strokeWidth="2" />
          <rect x="176" y="128" width="40" height="28" fill={BRONZE} fillOpacity="0.15" stroke={CREAM} strokeWidth="1.8" />
          <line x1="196" y1="128" x2="196" y2="156" stroke={CREAM} strokeWidth="1.5" />
          {/* deck */}
          <rect x="240" y="152" width="96" height="8" fill={BRONZE} fillOpacity="0.35" stroke={BRONZE} strokeWidth="2" />
          {[250, 280, 310, 330].map((x) => (
            <line key={x} x1={x} y1="160" x2={x} y2="172" stroke={BRONZE} strokeWidth="2" />
          ))}
          {/* railing */}
          <line x1="240" y1="134" x2="336" y2="134" stroke={CREAM} strokeOpacity="0.8" strokeWidth="1.8" />
          {[240, 264, 288, 312, 336].map((x) => (
            <line key={x} x1={x} y1="134" x2={x} y2="152" stroke={CREAM} strokeOpacity="0.8" strokeWidth="1.8" />
          ))}
          <Tree x={66} y={172} />
          <Tree x={366} y={172} s={0.8} />
          <Leaf x={100} y={172} r={-12} />
        </g>
      )}

      {kind === "events-garden" && (
        <g>
          {/* open pavilion */}
          <polygon points="100,98 200,66 300,98" fill={BRONZE} fillOpacity="0.2" stroke={BRONZE} strokeWidth="2.2" strokeLinejoin="round" />
          <line x1="116" y1="98" x2="116" y2="172" stroke={CREAM} strokeWidth="2.2" />
          <line x1="284" y1="98" x2="284" y2="172" stroke={CREAM} strokeWidth="2.2" />
          <line x1="200" y1="82" x2="200" y2="172" stroke={CREAM} strokeOpacity="0.5" strokeWidth="1.6" />
          {/* string lights */}
          <path d="M116 108 Q 158 128 200 108 Q 242 128 284 108" fill="none" stroke={BRONZE} strokeWidth="1.5" />
          {[134, 158, 182, 218, 242, 266].map((x, i) => (
            <circle key={x} cx={x} cy={i % 2 ? 122 : 118} r="3" fill={BRONZE} />
          ))}
          {/* tables */}
          {[150, 250].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy="150" rx="22" ry="5" fill="none" stroke={CREAM} strokeWidth="1.8" />
              <line x1={x} y1="155" x2={x} y2="172" stroke={CREAM} strokeWidth="1.8" />
            </g>
          ))}
          <Tree x={52} y={172} s={1.1} />
          <Tree x={352} y={172} s={1.1} />
          <Tree x={18} y={172} s={0.7} />
          {/* parked cars */}
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${150 + i * 34} 190)`}>
              <rect x="0" y="0" width="26" height="10" rx="3" fill="none" stroke={CREAM} strokeOpacity="0.55" strokeWidth="1.4" />
            </g>
          ))}
        </g>
      )}

      {kind === "old-house" && (
        <g>
          {/* older house */}
          <rect x="70" y="116" width="100" height="56" fill="none" stroke={CREAM} strokeOpacity="0.8" strokeWidth="2.2" />
          <polygon points="60,116 120,82 180,116" fill="none" stroke={BRONZE} strokeWidth="2.2" strokeLinejoin="round" strokeDasharray="6 4" />
          <rect x="86" y="134" width="18" height="38" fill="none" stroke={CREAM} strokeOpacity="0.7" strokeWidth="1.8" />
          <rect x="124" y="132" width="30" height="22" fill="none" stroke={CREAM} strokeOpacity="0.7" strokeWidth="1.8" />
          {/* open area with blueprint-style corner marks */}
          <g stroke={BRONZE} strokeWidth="2" fill="none">
            <path d="M214 128 h18 M214 128 v18" />
            <path d="M356 128 h-18 M356 128 v18" />
            <path d="M214 170 h18 M214 170 v-18" />
            <path d="M356 170 h-18 M356 170 v-18" />
          </g>
          <text x="285" y="154" textAnchor="middle" fontSize="12" letterSpacing="2" fill={BRONZE} fontFamily="sans-serif">
            NOVO PROJETO
          </text>
          <Tree x={198} y={172} s={0.9} />
          <Tree x={372} y={172} s={0.9} />
        </g>
      )}
    </svg>
  );
}
