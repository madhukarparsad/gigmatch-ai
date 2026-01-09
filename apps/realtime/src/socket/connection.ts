import { Server, Socket } from "socket.io";

/**
 * Handles all socket-level events.
 * Single responsibility: connection lifecycle.
 */
export function registerSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("🔌 Socket connected:", socket.id);

    /**
     * Client must join with userId
     * Room name === userId (Google-style simple routing)
     */
    socket.on("join", (userId: string) => {
      if (!userId) return;

      socket.join(userId);
      console.log(`👤 User ${userId} joined room`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
    });
  });
}
