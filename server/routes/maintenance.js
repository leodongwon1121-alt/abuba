import { Router } from "express";
import {
  addRecord,
  deleteRecord,
  listByUser,
  updateRecord,
} from "../data/shipMaintenanceRecords.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

// 정비 이력도 전부 본인 것만 다룬다.
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
    const { date, part, memo } = req.body;

    if (!date || !part) {
      return res
        .status(400)
        .json({ message: "정비 날짜와 부품을 입력해주세요." });
    }

    const record = await addRecord({
      userId: req.uid,
      date,
      part,
      memo: memo || "",
    });

    res.status(201).json(record);
  }),
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { date, part, memo } = req.body;

    const updated = await updateRecord(req.params.id, req.uid, {
      date,
      part,
      memo: memo || "",
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
