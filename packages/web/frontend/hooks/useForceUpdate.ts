import { useEffect, useState } from "react";

export default function useForceUpdate(
  effect: React.EffectCallback,
  deps: React.DependencyList = []
) {
  const [flag, setFlag] = useState(0);

  useEffect(effect, [flag, ...deps]);

  return () => setFlag(flag + 1);
}
