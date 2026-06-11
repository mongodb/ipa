import { type ReactElement } from "react";
import { Badge, type BadgeColor } from "../../../ui/Badge";
import type { State } from "../../../../types/ipa";

const STATE_CONFIG: Record<State, { label: string; color: BadgeColor }> = {
  adopt: { label: "Adopt", color: "green" },
  experimental: { label: "Experimental", color: "amber" },
  deprecated: { label: "Deprecated", color: "red" },
  retired: { label: "Retired", color: "muted" },
};

interface StateBadgeProps {
  state: State;
}

// Renders a Badge for an IPA lifecycle state.
// Shared by PrincipleHeader and GuidelineHeader.
export function StateBadge({ state }: StateBadgeProps): ReactElement {
  const { label, color } = STATE_CONFIG[state];
  return (
    <Badge color={color} dot>
      {label}
    </Badge>
  );
}
