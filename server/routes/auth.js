import { Router } from "express";
import { createUser, findById, updateUser } from "../data/users.js";
import { addRecord as addMaintenanceRecord } from "../data/shipMaintenanceRecords.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

// 비밀번호는 Firebase Auth가 관리하므로 Firestore 프로필 문서에는 저장하지 않는다.
// 신원은 항상 검증된 토큰(req.uid)에서 가져온다 — 요청 본문의 id를 믿지 않는다.

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await findById(req.uid);
    if (!user) {
      return res.status(404).json({ message: "프로필을 찾을 수 없습니다." });
    }
    res.json(user);
  }),
);

router.post(
  "/signup/fisher",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { email, shipType, shipPurchaseDate, license, maintenance } =
      req.body;

    if (await findById(req.uid)) {
      return res
        .status(409)
        .json({ message: "이미 프로필이 있는 계정입니다." });
    }

    const user = await createUser(req.uid, {
      email,
      accountType: "fisher",
      nickname: "",
      bio: "",
      avatar: null,
      shipType: shipType ?? null,
      shipPurchaseDate: shipPurchaseDate ?? null,
      license: license ?? { hasLicense: false },
      maintenance: maintenance ?? { hasMaintenance: false },
    });

    if (maintenance?.hasMaintenance && maintenance.date && maintenance.parts) {
      await addMaintenanceRecord({
        userId: user.id,
        date: maintenance.date,
        part: maintenance.parts,
        memo: maintenance.memo || "",
      });
    }

    res.status(201).json(user);
  }),
);

router.post(
  "/signup/consumer",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { email, nickname } = req.body;

    if (!nickname) {
      return res.status(400).json({ message: "닉네임을 입력해주세요." });
    }
    if (await findById(req.uid)) {
      return res
        .status(409)
        .json({ message: "이미 프로필이 있는 계정입니다." });
    }

    const user = await createUser(req.uid, {
      email,
      accountType: "consumer",
      nickname,
      bio: "",
      avatar: null,
    });

    res.status(201).json(user);
  }),
);

// 어부·소비자 공통 프로필 수정(닉네임/소개/프로필 사진). 본인만 가능.
router.put(
  "/profile",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { nickname, bio, avatar } = req.body;

    const updates = {};
    if (nickname !== undefined) updates.nickname = nickname;
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;

    const updated = await updateUser(req.uid, updates);
    if (!updated) {
      return res.status(404).json({ message: "계정을 찾을 수 없습니다." });
    }
    res.json(updated);
  }),
);

// 선박 정보 수정(어부 전용). 본인만 가능.
router.put(
  "/fisher",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { shipType, shipPurchaseDate } = req.body;

    if (!shipType || !shipPurchaseDate) {
      return res
        .status(400)
        .json({ message: "선박 종류와 구매 날짜를 입력해주세요." });
    }

    const user = await findById(req.uid);
    if (!user || user.accountType !== "fisher") {
      return res.status(404).json({ message: "계정을 찾을 수 없습니다." });
    }

    res.json(await updateUser(req.uid, { shipType, shipPurchaseDate }));
  }),
);

export default router;
