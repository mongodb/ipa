import { type ReactElement, type SVGProps } from "react";

export function CheckIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M2 9L6 13L14 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
