import express from "express";
import { firebaseReady } from "./firebase.js";
import authRouter from "./routes/auth.js";
import harvestRouter from "./routes/harvest.js";
import maintenanceRouter from "./routes/maintenance.js";
import marketRouter from "./routes/market.js";
import fishersRouter from "./routes/fishers.js";

const app = express();
const PORT = 4000;

// 아바타가 base64로 들어오므로 기본 100kb 제한으로는 부족하다.
app.use(express.json({ limit: "2mb" }));

app.use("/api/auth", authRouter);
app.use("/api/harvest", harvestRouter);
app.use("/api/maintenance", maintenanceRouter);
app.use("/api/market", marketRouter);
app.use("/api/fishers", fishersRouter);

// asyncHandler가 넘긴 에러를 여기서 JSON으로 응답한다.
app.use((err, _req, res, _next) => {
  console.error("[api error]", err);
  res.status(500).json({ message: "서버에서 문제가 발생했습니다." });
});

app.listen(PORT, () => {
  console.log(`어부바 서버 실행 중: http://localhost:${PORT}`);
  if (!firebaseReady) {
    console.warn(
      "⚠️  Firebase 미설정 — server/.env를 채우기 전에는 API가 동작하지 않습니다.",
    );
  }
});
