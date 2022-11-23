import { Server } from "socket.io";

const ioHandler = (res: any) => {
  if (!res.socket.server.io) {
    console.log("*First use, starting socket.io");

    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      socket.on("client-ready", () => {
        socket.broadcast.emit("get-canvas-state");
      });
      socket.on("canvas-state", (state) => {
        socket.broadcast.emit("canvas-state-from-server", state);
      });

      socket.on("draw-line", ({ prevPoint, currentPoint, color }) => {
        socket.broadcast.emit("draw-line", { prevPoint, currentPoint, color }); // sending data to alla
      });

      socket.on("clear", () => {
        io.emit("clear");
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("socket.io already running");
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
