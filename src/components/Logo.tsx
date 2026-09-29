export function Logo({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#171b24" />
      <circle cx="9" cy="10" r="3.2" fill="#38bdf8" />
      <circle cx="23" cy="10" r="3.2" fill="#fbbf24" />
      <circle cx="16" cy="23" r="3.2" fill="#e535ab" />
      <path d="M9 10 L23 10 L16 23 Z" fill="none" stroke="#e7e9f0" strokeOpacity=".5" strokeWidth="1.2" />
    </svg>
  );
}
