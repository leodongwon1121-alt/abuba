import { adminAuth } from "../firebase.js";

// Authorization: Bearer <idToken> 을 검증해 req.uid를 채운다.
async function readUid(req) {
  const header = req.headers.authorization ?? "";
  if (!header.startsWith("Bearer ")) {
    return null;
  }
  try {
    const decoded = await adminAuth.verifyIdToken(header.slice(7));
    return decoded.uid;
  } catch {
    return null;
  }
}

// 로그인이 반드시 필요한 라우트용.
export async function requireAuth(req, res, next) {
  const uid = await readUid(req);
  if (!uid) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
  req.uid = uid;
  next();
}

// 로그인 여부에 따라 응답이 달라지는(하지만 비로그인도 허용되는) 라우트용.
export async function optionalAuth(req, res, next) {
  req.uid = await readUid(req);
  next();
}
