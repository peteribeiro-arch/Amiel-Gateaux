import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showBackground?: boolean;
}

export default function Logo({
  className = '',
  size = 48,
  showBackground = true,
}: LogoProps) {
  return (
    <svg
      id="amiel-gateaux-logo"
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      {/* Background (Optional - Rounded square with beautiful brand dark color) */}
      {showBackground && (
        <rect
          width="200"
          height="200"
          rx="44"
          fill="#3A2213"
          className="transition-all"
        />
      )}

      {/* COLUMN 1: LEFT SIDE (A & Cake Slice) */}
      <g>
        {/* Stylized Serif Letter 'A' */}
        <text
          x="52"
          y="85"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="68"
          fontWeight="400"
          fill="#E5B28D"
          textAnchor="middle"
        >
          A
        </text>

        {/* Slice of Pie / Cake */}
        <g transform="translate(14, 110)">
          {/* Main Wedge crust and plate-line */}
          <path
            d="M 12,38 L 56,26 C 58,16 53,8 46,5 L 12,38 Z"
            fill="none"
            stroke="#E5B28D"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Elegant Scalloped / Wavy Crust at the back */}
          <path
            d="M 46,5 C 49,4 52,6 53,9 C 55,12 53,16 56,19 C 58,22 61,21 60,25 C 59,29 57,30 56,31 L 56,31"
            fill="none"
            stroke="#E5B28D"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Filling Layer Cream Line */}
          <path
            d="M 18,34 L 50,26"
            stroke="#E5B28D"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Strawberry on top */}
          <circle cx="36" cy="14" r="3.5" fill="#E5B28D" />
        </g>
      </g>

      {/* COLUMN 2: CENTER (Vertical Text "AMIEL GÂTEAUX") */}
      <text
        x="100"
        y="30"
        fontFamily="'Outfit', 'Inter', sans-serif"
        fontSize="10"
        fontWeight="800"
        letterSpacing="0.05em"
        fill="#E5B28D"
        textAnchor="middle"
      >
        <tspan x="100" dy="0">A</tspan>
        <tspan x="100" dy="11">M</tspan>
        <tspan x="100" dy="11">I</tspan>
        <tspan x="100" dy="11">E</tspan>
        <tspan x="100" dy="11">L</tspan>
        <tspan x="100" dy="18">G</tspan>
        <tspan x="100" dy="11">Â</tspan>
        <tspan x="100" dy="11">T</tspan>
        <tspan x="100" dy="11">E</tspan>
        <tspan x="100" dy="11">A</tspan>
        <tspan x="100" dy="11">U</tspan>
        <tspan x="100" dy="11">X</tspan>
      </text>

      {/* COLUMN 3: RIGHT SIDE (Cupcake & G) */}
      <g>
        {/* Cupcake / Brigadeiro with Sprinkles */}
        <g transform="translate(116, 40)">
          {/* Pleated Cup Base */}
          <path
            d="M 16,28 L 48,28 L 40,46 L 24,46 Z"
            fill="none"
            stroke="#E5B28D"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Pleats Lines */}
          <line x1="22" y1="28" x2="27" y2="46" stroke="#E5B28D" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="29" y1="28" x2="31" y2="46" stroke="#E5B28D" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="35" y1="28" x2="35" y2="46" stroke="#E5B28D" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="42" y1="28" x2="39" y2="46" stroke="#E5B28D" strokeWidth="2.5" strokeLinecap="round" />

          {/* Dome Top (Brigadeiro / Muffin) */}
          <path
            d="M 12,28 C 12,6 52,6 52,28"
            fill="none"
            stroke="#E5B28D"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Sprinkles (Granulado) scattered inside the dome */}
          <line x1="20" y1="20" x2="25" y2="16" stroke="#E5B28D" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="28" y1="14" x2="33" y2="11" stroke="#E5B28D" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="38" y1="16" x2="43" y2="12" stroke="#E5B28D" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="24" x2="21" y2="21" stroke="#E5B28D" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="24" y1="24" x2="29" y2="20" stroke="#E5B28D" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="33" y1="25" x2="38" y2="21" stroke="#E5B28D" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="42" y1="24" x2="47" y2="20" stroke="#E5B28D" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Stylized Serif Letter 'G' */}
        <text
          x="148"
          y="150"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="68"
          fontWeight="400"
          fill="#E5B28D"
          textAnchor="middle"
        >
          G
        </text>
      </g>
    </svg>
  );
}
