import { Router } from "express";
import {
  addRecord,
  deleteRecord,
  listByUser,
  updateRecord,
} from "../data/harvestRecords.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

// 수확 기록은 전부 본인 것만 다룬다 — 소유자는 토큰(req.uid)에서 가져온다.
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json(await listByUser(req.uid));
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { species, amountKg, date, regionId } = req.body;

    if (!species || !amountKg || !date || !regionId) {
      return res
        .status(400)
        .json({ message: "어종, 수확량, 날짜, 장소를 모두 입력해주세요." });
    }

    const record = await addRecord({
      userId: req.uid,
      species,
      amountKg: Number(amountKg),
      date,
      regionId,
    });

    res.status(201).json(record);
  }),
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { species, amountKg, date, regionId } = req.body;

    const updated = await updateRecord(req.params.id, req.uid, {
      species,
      amountKg: Number(amountKg),
      date,
      regionId,
    });

    if (!updated) {
      return res.status(404).json({ message: "기록을 찾을 수 없습니다." });
    }

    res.json(updated);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deleted = await deleteRecord(req.params.id, req.uid);
    if (!deleted) {
      return res.status(404).json({ message: "기록을 찾을 수 없습니다." });
    }
    res.status(204).end();
  }),
);

export default router;
