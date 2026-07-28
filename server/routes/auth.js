import { Router } from 'express';
import { addUser, findByEmail, findById, updateUser } from '../data/users.js';
import { addRecord as addMaintenanceRecord } from '../data/shipMaintenanceRecords.js';

const router = Router();

function toPublicUser(user) {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

router.post('/signup/fisher', (req, res) => {
  const { email, password, shipType, shipPurchaseDate, license, maintenance } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
  }
  if (findByEmail(email)) {
    return res.status(409).json({ message: '이미 가입된 이메일입니다.' });
  }

  const user = addUser({
    email,
    password,
    accountType: 'fisher',
    shipType,
    shipPurchaseDate,
    license,
    maintenance,
  });

  if (maintenance?.hasMaintenance && maintenance.date && maintenance.parts) {
    addMaintenanceRecord({
      userId: user.id,
      date: maintenance.date,
      part: maintenance.parts,
      memo: maintenance.memo || '',
    });
  }

  res.status(201).json(toPublicUser(user));
});

router.put('/fisher/:id', (req, res) => {
  const id = Number(req.params.id);
  const { shipType, shipPurchaseDate } = req.body;

  if (!shipType || !shipPurchaseDate) {
    return res.status(400).json({ message: '선박 종류와 구매 날짜를 입력해주세요.' });
  }

  const user = findById(id);
  if (!user || user.accountType !== 'fisher') {
    return res.status(404).json({ message: '계정을 찾을 수 없습니다.' });
  }

  const updated = updateUser(id, { shipType, shipPurchaseDate });
  res.json(toPublicUser(updated));
});

router.post('/signup/consumer', (req, res) => {
  const { email, password, nickname } = req.body;

  if (!email || !password || !nickname) {
    return res.status(400).json({ message: '이메일, 닉네임, 비밀번호를 입력해주세요.' });
  }
  if (findByEmail(email)) {
    return res.status(409).json({ message: '이미 가입된 이메일입니다.' });
  }

  const user = addUser({ email, password, nickname, accountType: 'consumer' });

  res.status(201).json(toPublicUser(user));
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
  }

  const user = findByEmail(email);
  if (!user) {
    return res.status(404).json({ message: '가입된 계정을 찾을 수 없습니다.' });
  }

  res.json(toPublicUser(user));
});

export default router;
