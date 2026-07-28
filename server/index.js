import express from 'express';
import authRouter from './routes/auth.js';
import harvestRouter from './routes/harvest.js';
import maintenanceRouter from './routes/maintenance.js';
import { MASTER_EMAIL, MASTER_PASSWORD, seedMasterAccount } from './data/seedMasterAccount.js';

const app = express();
const PORT = 4000;

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/harvest', harvestRouter);
app.use('/api/maintenance', maintenanceRouter);

seedMasterAccount();

app.listen(PORT, () => {
  console.log(`어부바 서버 실행 중: http://localhost:${PORT}`);
  console.log(`개발용 마스터 계정: ${MASTER_EMAIL} / ${MASTER_PASSWORD}`);
});
