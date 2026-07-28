import { Router } from 'express';
import { addRecord, deleteRecord, listByUser, updateRecord } from '../data/harvestRecords.js';

const router = Router();

function parseUserId(value) {
  const userId = Number(value);
  return Number.isInteger(userId) && userId > 0 ? userId : null;
}

router.get('/', (req, res) => {
  const userId = parseUserId(req.query.userId);
  if (!userId) {
    return res.status(400).json({ message: 'userId가 필요합니다.' });
  }

  res.json(listByUser(userId));
});

router.post('/', (req, res) => {
  const userId = parseUserId(req.body.userId);
  const { species, amountKg, date, regionId } = req.body;

  if (!userId || !species || !amountKg || !date || !regionId) {
    return res.status(400).json({ message: '어종, 수확량, 날짜, 장소를 모두 입력해주세요.' });
  }

  const record = addRecord({
    userId,
    species,
    amountKg: Number(amountKg),
    date,
    regionId,
  });

  res.status(201).json(record);
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const userId = parseUserId(req.body.userId);
  const { species, amountKg, date, regionId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'userId가 필요합니다.' });
  }

  const updated = updateRecord(id, userId, {
    species,
    amountKg: Number(amountKg),
    date,
    regionId,
  });

  if (!updated) {
    return res.status(404).json({ message: '기록을 찾을 수 없습니다.' });
  }

  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const userId = parseUserId(req.query.userId);

  if (!userId) {
    return res.status(400).json({ message: 'userId가 필요합니다.' });
  }

  const deleted = deleteRecord(id, userId);
  if (!deleted) {
    return res.status(404).json({ message: '기록을 찾을 수 없습니다.' });
  }

  res.status(204).end();
});

export default router;
