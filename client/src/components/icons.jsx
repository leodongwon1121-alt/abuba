const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
  width: 20,
  height: 20,
  "aria-hidden": "true",
  focusable: "false",
};

export function WeatherIcon(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="9" cy="9" r="4" />
      <path d="M15 16h3a3 3 0 0 0 0-6 4.5 4.5 0 0 0-8.5-1.5" />
      <path d="M3 16h9" />
    </svg>
  );
}

export function HarvestIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M3 8l9-4 9 4-9 4-9-4z" />
      <path d="M3 8v8l9 4 9-4V8" />
      <path d="M12 12v8" />
    </svg>
  );
}

export function CalendarIcon(props) {
  return (
    <svg {...common} {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="M9 15l6-4" />
    </svg>
  );
}

export function WrenchIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5z" />
    </svg>
  );
}

export function QrIcon(props) {
  return (
    <svg {...common} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM14 20h3M20 14v3M20 20v.01" />
    </svg>
  );
}

export function MarketIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M3 9l1.5-5h15L21 9" />
      <path d="M4 9h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9z" />
      <path d="M9 13a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function StarIcon({ filled, ...props }) {
  return (
    <svg {...common} fill={filled ? "currentColor" : "none"} {...props}>
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5z" />
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="11" cy="11" r="6" />
      <path d="M15.5 15.5L20 20" />
    </svg>
  );
}

export function LogoutIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M14 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h8" />
      <path d="M17 8l4 4-4 4M21 12H10" />
    </svg>
  );
}

export function UserIcon(props) {
  return (
    <svg {...common} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}

export function EmptyIcon(props) {
  return (
    <svg {...common} {...props}>
      <path
        d="M12 3a5 5 0 0 1 5 5c0 2-1 3-2 4s-2 1.5-2 3"
        strokeDasharray="3 3"
      />
      <path d="M12 17v.01" strokeDasharray="0" />
    </svg>
  );
}

export function CloseIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function BackIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function HomeIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M4 10.5L12 4l8 6.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8.5z" />
      <path d="M9.5 20v-5h5v5" />
    </svg>
  );
}

export function CameraIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

export function ChevronRightIcon(props) {
  return (
    <svg {...common} {...props}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}
