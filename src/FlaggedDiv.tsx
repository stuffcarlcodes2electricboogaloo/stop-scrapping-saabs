import type { HTMLAttributes, ReactNode } from "react";
import { useFlags } from "launchdarkly-react-client-sdk";

const DEFAULT_FLAG_KEY = "ui-divs-enabled";

type FlaggedDivProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  flagKey?: string;
};

const FlaggedDiv = ({ children, flagKey = DEFAULT_FLAG_KEY, ...props }: FlaggedDivProps) => {
  const flags = useFlags();
  const enabled = (flags as Record<string, boolean | undefined>)[flagKey];

  if (enabled === false) {
    return null;
  }

  return <div {...props}>{children}</div>;
};

export default FlaggedDiv;
