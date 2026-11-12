import React from "react";

interface RWLogoProps {
  className?: string;
  showText?: boolean;
  variant?: "light" | "dark" | "bronze";
}

/**
 * Vector reconstruction of the RW (Robert Wolff - Corretor de Imóveis)
 * architectural house + monogram emblem from the official business card.
 */
export function RWLogo({
  className = "h-16",
  showText = false,
  variant = "light",
}: RWLogoProps) {
  const strokeColor =
    variant === "light"
      ? "#F7F5F0"
      : variant === "bronze"
      ? "#B88E63"
      : "#11221B";

  const subtextColor =
    variant === "light"
      ? "rgba(247, 245, 240, 0.78)"
      : variant === "bronze"
      ? "#B88E63"
      : "#182E25";

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 260 155"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-full"
        aria-label="Robert Wolff Corretor de Imóveis - Logo RW"
      >
        {/* Outer Roof & Chimney */}
        <path
          d="M18 82 L130 12 L172 38 L172 20 L194 20 L194 52 L242 82 L227 82 L130 22 L33 82 Z"
          stroke={strokeColor}
          strokeWidth="4.5"
          strokeLinejoin="miter"
        />

        {/* Letter R (Double-line outlined geometric monogram integrated with roof) */}
        <path
          d="M52 142 V56 H96 C115 56 126 66 126 81 C126 94 117 103 102 106 L128 142 H105 L82 108 H70 V142 H52 Z"
          stroke={strokeColor}
          strokeWidth="4.5"
          strokeLinejoin="miter"
        />
        {/* Inner counter of R */}
        <path
          d="M70 71 V93 H94 C103 93 108 88 108 82 C108 75 103 71 94 71 H70 Z"
          stroke={strokeColor}
          strokeWidth="4.5"
          strokeLinejoin="miter"
        />

        {/* Letter W (Double-line outlined geometric monogram interlocking with R and right roof) */}
        <path
          d="M118 56 H135 L148 112 L164 56 H181 L197 112 L212 63 L228 73 L205 142 H187 L172 90 L157 142 H139 L118 56 Z"
          stroke={strokeColor}
          strokeWidth="4.5"
          strokeLinejoin="miter"
        />
      </svg>

      {showText && (
        <div className="mt-2 text-center">
          <div
            className="text-xl font-medium tracking-wide leading-tight"
            style={{ color: strokeColor }}
          >
            Robert Wolff
          </div>
          <div
            className="text-[10px] tracking-[0.28em] uppercase mt-0.5 font-mono"
            style={{ color: subtextColor }}
          >
            Corretor de Imóveis
          </div>
        </div>
      )}
    </div>
  );
}

