type IconProps = { className?: string };

/** Generic tool icon set for category cards — no branded/trademarked marks. */
export function CategoryIcon({ icon, className = "h-7 w-7" }: { icon: string; className?: string }) {
  switch (icon) {
    case "bolt":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 3l1.6 3.8 4.1.4-3.1 2.8.9 4-3.5-2.1-3.5 2.1.9-4-3.1-2.8 4.1-.4L12 3z"
            fill="currentColor"
          />
          <circle cx="12" cy="14.5" r="0.01" />
        </svg>
      );
    case "screwdriver":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
          <path d="M14.5 3.5l6 6-2 2-6-6 2-2z" fill="currentColor" stroke="none" />
          <path d="M17 7l-9.5 9.5" strokeLinecap="round" />
          <path d="M4 20l2.5-1 1-2.5-2-2-2.5 1L2 18l2 2z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "gauge":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
          <circle cx="12" cy="13" r="7.5" />
          <path d="M12 13l3.5-3.5" strokeLinecap="round" />
          <path d="M8 4.5h8" strokeLinecap="round" />
        </svg>
      );
    case "pipe":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
          <rect x="3" y="9" width="12" height="6" rx="1" />
          <path d="M15 10.5h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4" />
          <path d="M6 9v6M9 9v6" />
        </svg>
      );
    case "wrench":
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
          <path
            d="M14.7 6.3a4 4 0 0 0-5.4 4.9L4 16.5 7.5 20l5.3-5.3a4 4 0 0 0 4.9-5.4l-2.6 2.6-2.1-2.1 2.7-2.5z"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export function SearchIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

export function CartIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M3 4h2l1.4 12.6A2 2 0 0 0 8.4 18.5h9.2a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.5" cy="21" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="21" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PhoneIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.2 2.2z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3 0 1.4 1 2.7 1.1 2.9.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.6.2-1.1.2-1.3-.1-.1-.3-.2-.5-.3z" />
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 0 1 6.9 12.6l-.3.5.5 2-2-.6-.5.3A8.2 8.2 0 1 1 12 3.8z" />
    </svg>
  );
}

export function ChevronRightIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className} aria-hidden="true">
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrustBadgeIcon({
  kind,
  className = "h-8 w-8",
}: {
  kind: "catalog" | "years" | "delivery" | "shield";
  className?: string;
}) {
  const common = { className, fill: "none", stroke: "currentColor", strokeWidth: 1.6 } as const;
  switch (kind) {
    case "catalog":
      return (
        <svg viewBox="0 0 24 24" {...common} aria-hidden="true">
          <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
          <path d="M8 4.5v15M12.5 9h5M12.5 13h5" strokeLinecap="round" />
        </svg>
      );
    case "years":
      return (
        <svg viewBox="0 0 24 24" {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7v5l3.2 1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "delivery":
      return (
        <svg viewBox="0 0 24 24" {...common} aria-hidden="true">
          <rect x="2.5" y="7" width="12" height="9" rx="1" />
          <path d="M14.5 10h4l3 3v3h-7z" />
          <circle cx="7" cy="18" r="1.6" fill="currentColor" stroke="none" />
          <circle cx="17.5" cy="18" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "shield":
    default:
      return (
        <svg viewBox="0 0 24 24" {...common} aria-hidden="true">
          <path d="M12 3.5l7 2.7v5.2c0 4.3-2.9 7.6-7 9.1-4.1-1.5-7-4.8-7-9.1V6.2L12 3.5z" />
          <path d="M9 12l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}
