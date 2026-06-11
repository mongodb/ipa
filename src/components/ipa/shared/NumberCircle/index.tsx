import { type ReactElement } from "react";
import clsx from "clsx";
import styles from "./NumberCircle.module.css";

interface NumberCircleProps {
  // The consumer's module class: supplies the counter digit via ::before
  // and may override --number-circle-size.
  className?: string;
}

// Decorative numbering circle. The visible number comes from a CSS
// counter owned by the consumer, so nothing is announced to assistive
// tech — list semantics carry the real numbering.
export function NumberCircle({ className }: NumberCircleProps): ReactElement {
  return <span aria-hidden="true" className={clsx(styles.circle, className)} />;
}
