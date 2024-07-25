import { memo, useRef, useEffect } from "react";

export default memo(({ value }: { value: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current!.outerHTML = value;
  }, []);

  return <div ref={ref} />;
});
