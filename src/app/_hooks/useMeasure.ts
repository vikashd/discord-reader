import { useEffect, useRef, useState } from "react";

export const useMeasure = <T extends Element>(): [
  React.RefObject<T>,
  DOMRect | undefined
] => {
  const ref = useRef<T>(null);
  const [bounds, setBounds] = useState<DOMRect>();

  useEffect(() => {
    const cb: ResizeObserverCallback = ([entry]: ResizeObserverEntry[]) => {
      setBounds(entry.target.getBoundingClientRect());
    };

    const ro = new ResizeObserver(cb);

    if (ref.current) {
      ro.observe(ref.current);
    }

    return () => {
      ro.disconnect();
    };
  }, []);

  return [ref, bounds];
};
