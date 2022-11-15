import { useEffect, useRef, useState } from "react";

export const useDraw = (
  onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void
) => {
  const [mouseDown, setMouseDown] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPoint = useRef<null | Point>(null);

  const onMouseDown = () => {
    setMouseDown(true);
  };
  const onClear = () => {
    setMouseDown(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
  };
  const handler = (e: MouseEvent) => {
    if (mouseDown) {
      const currentPoint = computePointsincanvas(e);
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !currentPoint) return;

      onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
      prevPoint.current = currentPoint;
    }
  };
  const computePointsincanvas = (e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const x =
      ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
    const y =
      ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height;

    return { x, y };
  };
  const onMouseUpListener = (e: MouseEvent) => {
    setMouseDown(false);
    prevPoint.current = null;
  };

  const saveAsImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;
    for (var i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 255) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        data[i + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    var dataURL = canvas.toDataURL("image/png");

    var a = document.createElement("a");
    a.href = dataURL;
    a.download = "my-canvas.png";
    document.body.appendChild(a);
    a.click();
  };
  useEffect(() => {
    canvasRef.current?.addEventListener("mousemove", handler);
    window.addEventListener("mouseup", onMouseUpListener);
    return () => {
      canvasRef.current?.removeEventListener("mousemove", handler);
      window.removeEventListener("mouseup", onMouseUpListener);
    };
  }, [onDraw]);

  return { canvasRef, onMouseDown, onClear, saveAsImage };
};
