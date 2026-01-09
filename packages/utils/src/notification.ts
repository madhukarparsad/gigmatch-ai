// import { io } from "@gigmatch/realtime-client";

// /**
//  * Central notification dispatcher
//  * (Google-style fan-out point)
//  */
// export async function sendNotification(params: {
//   userId: string;
//   type: string;
//   payload: any;
// }) {
//   const { userId, type, payload } = params;

//   // 🔔 Realtime delivery
//   io.to(userId).emit("notification", {
//     type,
//     payload,
//     createdAt: new Date()
//   });

//   // 📧 Email (stub for now)
//   console.log(
//     `📧 Email queued for user ${userId} [${type}]`
//   );
// }



import { emitEvent } from "./kafka";

/**
 * Central notification intent dispatcher
 * (NO delivery logic here)
 */
export async function sendNotification(params: {
  userId: string;
  type: string;
  payload: any;
}) {
  const { userId, type, payload } = params;

  // 🔔 Emit notification intent
  await emitEvent("notification.created", {
    userId,
    type,
    payload,
    createdAt: new Date().toISOString()
  });
}
