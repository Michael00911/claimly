export function Logo({ className = "", size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shield shape */}
      <path
        d="M20 2L4 10V19C4 29.5 11 36.5 20 38C29 36.5 36 29.5 36 19V10L20 2Z"
        fill="#001a4e"
      />
      {/* Airplane silhouette */}
      <path
        d="M28 17.5L22 15.5V11.5C22 10.67 21.33 10 20.5 10H19.5C18.67 10 18 10.67 18 11.5V15.5L12 17.5V20L18 18.5V24L16 25.5V27.5L20 26L24 27.5V25.5L22 24V18.5L28 20V17.5Z"
        fill="#00b349"
      />
      {/* Checkmark */}
      <path
        d="M15 20.5L18.5 24L26 16"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LogoWithText({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <Logo size={size} />
      <span
        className="font-headline font-bold tracking-tight text-primary"
        style={{ fontSize: size * 0.65 }}
      >
        Claimly
      </span>
    </div>
  );
}
