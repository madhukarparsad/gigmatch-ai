import { createServer } from "http";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./socket/connection";
import { initKafkaConsumers } from "./kafka/escrow.consumer";
import { initMilestoneConsumer } from "./kafka/milestone.consumer";
import { initNotificationConsumer } from "./kafka/notification.consumer";



initNotificationConsumer();
initMilestoneConsumer();


const httpServer = createServer();

export const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

// 🔌 socket lifecycle handled here
registerSocketHandlers(io);

httpServer.listen(6001, () => {
  console.log("⚡ Realtime server running on :6001");
});

// 🔄 start kafka consumers
initKafkaConsumers();
