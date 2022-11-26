import { FC, useEffect, useRef, useState } from "react";
import { useDraw } from "../hooks/useDraw";
import { HexColorPicker } from "react-colorful";
import { getDatabase, onValue, ref, set } from "firebase/database";
import Head from "next/head";

import { DrawLine } from "../utils/DrawLine";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
interface pageProps {}
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_apiKey,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  databaseURL: process.env.NEXT_PUBLIC_databaseURL,
  projectId: process.env.NEXT_PUBLIC_projectId,
  storageBucket: process.env.NEXT_PUBLIC_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_appId,
  measurementId: process.env.NEXT_PUBLIC_measurementId,
};
const Page: FC<pageProps> = ({}) => {
  const globalSocketRef: any = useRef(null);
  const { canvasRef, onMouseDown, onClear, saveAsImage } = useDraw(createLine);
  const [color, setColor] = useState("#0066a7");

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    // if (globalSocketRef.current != null) {
    // globalSocketRef.current.emit("draw-line", {
    //   prevPoint,
    //   currentPoint,
    //   color,
    // });
    DrawLine({ prevPoint, currentPoint, ctx, color });
    const db = getDatabase();
    set(ref(db, "canvas"), {
      prevPoint,
      currentPoint,
      ctx,
      color,
    });
    // }
  }
  // console.log("vall", JSON.parse(process.env.NEXT_PUBLIC_ENV_FirebaseConfig));

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const database = getDatabase(app);
    console.log("heeeelo");
  }, []);
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      const db = getDatabase();
      const starCountRef = ref(db, "canvas");
      onValue(starCountRef, (snapshot) => {
        const { prevPoint, currentPoint, color } = snapshot.val();

        DrawLine({ prevPoint, currentPoint, ctx, color });
      });
    }

    // fetch("/api/socketio").finally(() => {
    // const socket = io();
    // globalSocketRef.current = socket;
    // socket.emit("client-ready");
    // socket.on("get-canvas-state", () => {
    //   if (!canvasRef.current?.toDataURL()) return;
    //   socket.emit("canvas-state", canvasRef.current?.toDataURL());
    // });
    // socket.on("canvas-state-from-server", (state) => {
    //   const img = new Image();
    //   img.src = state;
    //   img.onload = () => {
    //     ctx?.drawImage(img, 0, 0);
    //   };
    // });
    // socket.on("draw-line", ({ prevPoint, currentPoint, color }) => {
    //   if (!ctx) {
    //     return;
    //   }
    //   DrawLine({ prevPoint, currentPoint, ctx, color });
    // });
    // socket.on("clear", () => {
    //   onClear();
    // });
    // });
    return () => {
      if (!globalSocketRef.current && globalSocketRef.current != null) {
        globalSocketRef.current.off("get-canvas-state");
        globalSocketRef.current.off("canvas-state-from-server");

        globalSocketRef.current.off("draw-line");
        globalSocketRef.current.off("clear");
      }
    };
  }, [canvasRef, onClear]);
  return (
    <div className="w-screen h-screen justify-center flex bg-white">
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <div className="">
        <h1 className="  text-center py-2 text-2xl ">
          Use your mouse and start painting
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
          onClick={() => {
            onClear();
            if (!globalSocketRef.current) {
              return;
            }

            globalSocketRef.current.emit("clear");
          }}
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
