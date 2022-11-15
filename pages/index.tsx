import { FC, useState } from "react";
import { useDraw } from "../hooks/useDraw";
import { HexColorPicker } from "react-colorful";
import Head from "next/head";
interface pageProps {}

const Page: FC<pageProps> = ({}) => {
  const { canvasRef, onMouseDown, onClear, saveAsImage } = useDraw(drawLine);
  const [color, setColor] = useState("#0066a7");
  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = color;
    const lineWidth = 5;
    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();
    ctx.fillStyle = lineColor;

    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }
  return (
    <div className="w-screen h-screen justify-center flex bg-white">
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <div className="">
        <h1 className="  text-center py-2 text-2xl ">
          Use your mouse and start drawing
        </h1>

        <canvas
          onMouseDown={onMouseDown}
          ref={canvasRef}
          height={500}
          width={500}
          className="border border-black  rounded-md mt-4"
        />
      </div>

      <div className="flex flex-col align-middle justify-center ml-5">
        <HexColorPicker color={color} onChange={setColor} />

        <button
          onClick={saveAsImage}
          className="border border-black p-2 mt-6 bg-blue-700 text-white "
        >
          {" "}
          Save{" "}
        </button>

        <button
          onClick={onClear}
          className="border border-black p-2 mt-6 bg-amber-800 text-white "
        >
          {" "}
          Clear{" "}
        </button>
      </div>
    </div>
  );
};

export default Page;
