export function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="9" cy="20" r="1.25" />
      <circle cx="17" cy="20" r="1.25" />
      <path d="M3 4h2l.6 3m0 0 .76 3.78a1 1 0 0 01 .82H19a1 1 0 0 0 .95-.68l1.6-5.34H6.16" />
    </svg>
  );
}
