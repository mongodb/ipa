import { type ReactElement } from "react";

interface IconProps {
  className?: string;
}

// Icons are decorative (aria-hidden) and inherit color via currentColor —
// consumers pair them with a visible text label and size them via className.

export function CheckSquareIcon({ className }: IconProps): ReactElement {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <rect
        x="1.5"
        y="1.5"
        width="13"
        height="13"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4.6 8.2 7 10.5l4.4-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
