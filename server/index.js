import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { firebaseReady } from "./firebase.js";
import authRouter from "./routes/auth.js";
import harvestRouter from "./routes/harvest.js";
import maintenanceRouter from "./routes/maintenance.js";
import marketRouter from "./routes/market.js";
import fishersRouter from "./routes/fishers.js";

const app = express();
// 호스팅(Render 등)은 띄울 포트를 PORT로 지정해준다. 로컬은 기존대로 4000.
const PORT = process.env.PORT || 4000;
const clientDist = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "client",
  "dist",
);

// 아바타가 base64로 들어오므로 기본 100kb 제한으로는 부족하다.
app.use(express.json({ limit: "2mb" }));

app.use("/api/auth", authRouter);
app.use("/api/harvest", harvestRouter);
app.use("/api/maintenance", maintenanceRouter);
app.use("/api/market", marketRouter);
app.use("/api/fishers", fishersRouter);

// 배포 환경에서는 빌드된 프론트를 이 서버가 같이 서빙한다(같은 오리진이라 CORS 불필요).
// 로컬 개발에는 client/dist가 없으므로 이 블록을 건너뛰고 Vite 개발 서버가 프론트를 담당한다.
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));

  // /market 같은 react-router 경로로 바로 들어오거나 새로고침해도 index.html을 내려준다.
  // /api/* 는 위 라우터에서 처리되지 않은 것이므로 그대로 404가 나게 둔다.
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      next();
      return;
    }
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

// asyncHandler가 넘긴 에러를 여기서 JSON으로 응답한다.
app.use((err, _req, res, _next) => {
  console.error("[api error]", err);
  res.status(500).json({ message: "서버에서 문제가 발생했습니다." });
});

app.listen(PORT, () => {
  console.log(`어부바 서버 실행 중: 포트 ${PORT}`);
  if (!firebaseReady) {
    console.warn(
      "⚠️  Firebase 미설정 — server/.env를 채우기 전에는 API가 동작하지 않습니다.",
    );
  }
});
