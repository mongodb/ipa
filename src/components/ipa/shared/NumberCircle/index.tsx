import { type ReactElement } from "react";
import clsx from "clsx";
import styles from "./NumberCircle.module.css";

interface NumberCircleProps {
  // Optional size/font overrides via --number-circle-* custom properties.
  className?: string;
}

// Decorative numbering circle drawing the `number-circle` CSS counter,
// which the consumer's list resets and increments. Hidden from assistive
// tech — list semantics carry the real numbering.
export function NumberCircle({ className }: NumberCircleProps): ReactElement {
  return <span aria-hidden="true" className={clsx(styles.circle, className)} />;
}
