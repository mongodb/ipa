import type { ReactNode } from "react";

export default function MdxComponentStub({
  children,
}: {
  children?: ReactNode;
}) {
  return children ?? null;
}
