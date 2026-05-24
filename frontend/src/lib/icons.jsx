// Realistic SVG icons for auto parts categories.

export const EngineIcon = ({ className = "w-8 h-8", stroke = "currentColor" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="12" y="20" width="32" height="28" rx="2" />
    <rect x="44" y="26" width="10" height="16" rx="1" />
    <path d="M20 20v-6h12v6" />
    <path d="M16 28h4M16 34h4M16 40h4" />
    <circle cx="32" cy="34" r="4" />
    <path d="M24 48v4M40 48v4" />
    <path d="M8 30h4M8 38h4" />
  </svg>
);

export const GearboxIcon = ({ className = "w-8 h-8", stroke = "currentColor" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="32" cy="32" r="20" />
    <path d="M32 16v32M16 32h32" />
    <path d="M19 19l26 26M19 45L45 19" />
    <circle cx="32" cy="32" r="4" fill={stroke} />
    <circle cx="32" cy="16" r="3" />
    <circle cx="32" cy="48" r="3" />
    <circle cx="16" cy="32" r="3" />
    <circle cx="48" cy="32" r="3" />
  </svg>
);

export const TransmissionIcon = ({ className = "w-8 h-8", stroke = "currentColor" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="14" cy="32" r="8" />
    <circle cx="50" cy="32" r="8" />
    <path d="M14 32h36" />
    <path d="M22 32l4-6M22 32l4 6M42 32l-4-6M42 32l-4 6" />
  </svg>
);

export const SuspensionIcon = ({ className = "w-8 h-8", stroke = "currentColor" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="26" y="10" width="12" height="6" />
    <rect x="26" y="48" width="12" height="6" />
    <path d="M30 16l4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4" />
    <path d="M34 16l-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4" />
  </svg>
);

export const SteeringIcon = ({ className = "w-8 h-8", stroke = "currentColor" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="32" cy="32" r="20" />
    <circle cx="32" cy="32" r="5" />
    <path d="M32 12v15M12 32h15M52 32H37M32 52V37" />
  </svg>
);

export const BrakeIcon = ({ className = "w-8 h-8", stroke = "currentColor" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="32" cy="32" r="20" />
    <circle cx="32" cy="32" r="14" />
    <circle cx="32" cy="32" r="6" />
    <path d="M32 12v8M32 44v8M12 32h8M44 32h8" />
    <rect x="42" y="26" width="10" height="12" rx="1" />
  </svg>
);

export const BatteryIcon = ({ className = "w-8 h-8", stroke = "currentColor" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="10" y="20" width="44" height="28" rx="2" />
    <rect x="18" y="14" width="8" height="6" />
    <rect x="38" y="14" width="8" height="6" />
    <path d="M20 32h6M23 29v6" />
    <path d="M38 32h6" />
  </svg>
);

export const HeadlightIcon = ({ className = "w-8 h-8", stroke = "currentColor" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 20c8-4 24-4 34 0l4 8c-12 6-26 6-38 0z" />
    <circle cx="28" cy="28" r="4" />
    <path d="M52 22l8-2M52 28l8 0M52 34l8 2" />
  </svg>
);

export const WiringIcon = ({ className = "w-8 h-8", stroke = "currentColor" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 24c8 0 8 16 16 16s8-16 16-16 8 16 16 16" />
    <rect x="4" y="20" width="6" height="8" />
    <rect x="54" y="36" width="6" height="8" />
  </svg>
);

export const WiperIcon = ({ className = "w-8 h-8", stroke = "currentColor" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="50" r="3" />
    <path d="M18 50L46 16" />
    <path d="M44 14l4 4" />
    <path d="M10 36c4-8 12-14 22-16" strokeDasharray="2 3" />
  </svg>
);

export const AlarmIcon = ({ className = "w-8 h-8", stroke = "currentColor" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="20" y="20" width="24" height="28" rx="2" />
    <path d="M26 20v-6a6 6 0 0 1 12 0v6" />
    <circle cx="32" cy="32" r="3" />
    <path d="M32 35v6" />
  </svg>
);

export const CarFrontIcon = ({ className = "w-8 h-8", stroke = "currentColor" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 40c0-6 4-10 10-12l4-10h20l4 10c6 2 10 6 10 12v8H8z" />
    <circle cx="18" cy="48" r="4" />
    <circle cx="46" cy="48" r="4" />
    <path d="M14 36h6M44 36h6" />
  </svg>
);

export const CarBackIcon = ({ className = "w-8 h-8", stroke = "currentColor" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 40c0-4 2-8 6-10v-10h36v10c4 2 6 6 6 10v8H8z" />
    <circle cx="18" cy="48" r="4" />
    <circle cx="46" cy="48" r="4" />
    <rect x="12" y="34" width="8" height="4" />
    <rect x="44" y="34" width="8" height="4" />
  </svg>
);

export const DoorIcon = ({ className = "w-8 h-8", stroke = "currentColor" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 12h28l8 6v34H14z" />
    <path d="M40 18v34" />
    <circle cx="22" cy="36" r="2" />
    <rect x="18" y="22" width="18" height="10" />
  </svg>
);

export const MirrorIcon = ({ className = "w-8 h-8", stroke = "currentColor" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 24c8-6 28-6 36 0l-4 16c-8 4-20 4-28 0z" />
    <path d="M14 24L8 18" />
  </svg>
);

export const RoofIcon = ({ className = "w-8 h-8", stroke = "currentColor" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 36L20 18h24l12 18" />
    <rect x="20" y="36" width="24" height="6" />
    <path d="M8 36h48" />
  </svg>
);

export const FusesIcon = ({ className = "w-8 h-8", stroke = "currentColor" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="10" y="22" width="10" height="20" rx="1" />
    <rect x="22" y="18" width="10" height="24" rx="1" />
    <rect x="34" y="22" width="10" height="20" rx="1" />
    <rect x="46" y="18" width="10" height="24" rx="1" />
    <path d="M15 16v6M27 12v6M39 16v6M51 12v6M15 42v6M27 42v6M39 42v6M51 42v6" />
  </svg>
);

export const InfoIcon = ({ className = "w-8 h-8", stroke = "currentColor" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="10" y="14" width="44" height="36" rx="3" />
    <path d="M18 24h28M18 32h28M18 40h18" />
    <circle cx="48" cy="40" r="3" fill={stroke} stroke="none" />
  </svg>
);

export const SeatIcon = ({ className = "w-8 h-8", stroke = "currentColor" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 50h20M20 50V30c0-4 4-8 8-8h6v18" />
    <path d="M34 30h6c4 0 8 4 8 8v8h-6" />
    <path d="M16 50v4M36 50v4" />
  </svg>
);

export const CarSideIcon = ({ className = "w-8 h-8", stroke = "currentColor" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 44l4-14 8-6h28l8 6 4 14v6H6z" />
    <circle cx="18" cy="50" r="4" />
    <circle cx="46" cy="50" r="4" />
    <path d="M18 24l4-8h20l4 8" />
    <path d="M30 16v10" />
  </svg>
);

export const IconByKey = {
  engine: EngineIcon,
  gearbox: GearboxIcon,
  transmission: TransmissionIcon,
  suspension: SuspensionIcon,
  steering: SteeringIcon,
  brake: BrakeIcon,
  battery: BatteryIcon,
  headlight: HeadlightIcon,
  wiring: WiringIcon,
  wiper: WiperIcon,
  alarm: AlarmIcon,
  front: CarFrontIcon,
  back: CarBackIcon,
  door: DoorIcon,
  mirror: MirrorIcon,
  roof: RoofIcon,
  "car-body": CarFrontIcon,
  "car-front": CarFrontIcon,
  "car-back": CarBackIcon,
  "car-side": CarSideIcon,
  fuses: FusesIcon,
  info: InfoIcon,
  seat: SeatIcon,
};

export function CategoryIcon({ name, className = "w-10 h-10", stroke = "currentColor" }) {
  const Comp = IconByKey[name] || EngineIcon;
  return <Comp className={className} stroke={stroke} />;
}
