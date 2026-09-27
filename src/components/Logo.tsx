export function Logo({ className = "", withText = true }: { className?: string; withText?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="38" height="38" rx="8" fill="#284a65" />
        <g stroke="#f76a00" strokeWidth="3.2" strokeLinecap="round">
          <path d="M12 27 L24 15" />
          <path d="M23 10.5a4 4 0 1 1 6.5 4.5L15 29.5 10.5 25 25 10.5a4 4 0 0 1 4.5-.5" />
        </g>
        <circle cx="13" cy="27" r="2.6" fill="#f76a00" />
      </svg>
      {withText && (
        <span className="font-heading text-lg leading-none tracking-wide text-steel-900">
          RAVI TOOLS
          <span className="block text-[10px] font-body font-semibold uppercase tracking-[0.2em] text-safety-600">
            &amp; Hydraulics
          </span>
        </span>
      )}
    </span>
  );
}
