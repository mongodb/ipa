import { type ReactElement } from "react";
import clsx from "clsx";
import styles from "./NumberCircle.module.css";

interface NumberCircleProps {
  className?: string;
}

// Decorative: hidden from assistive tech — list semantics carry the
// real numbering.
export function NumberCircle({ className }: NumberCircleProps): ReactElement {
  return <span aria-hidden="true" className={clsx(styles.circle, className)} />;
}
