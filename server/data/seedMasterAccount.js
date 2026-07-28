import { addUser, findByEmail } from './users.js';
import { addRecord as addMaintenanceRecord } from './shipMaintenanceRecords.js';

// 개발용 고정 로그인 계정. 서버가 재시작될 때마다(node --watch) in-memory 데이터가
// 초기화되므로, 매번 다시 만들어지도록 여기서 시드한다.
export const MASTER_EMAIL = 'master@abuba.kr';
export const MASTER_PASSWORD = 'master1234';

export function seedMasterAccount() {
  if (findByEmail(MASTER_EMAIL)) {
    return;
  }

  const user = addUser({
    email: MASTER_EMAIL,
    password: MASTER_PASSWORD,
    accountType: 'fisher',
    shipType: '중형 어선',
    shipPurchaseDate: '2022-03-01',
    license: { hasLicense: true, licenseNumber: 'BS-0001' },
    maintenance: { hasMaintenance: false },
  });

  addMaintenanceRecord({
    userId: user.id,
    date: '2026-05-10',
    part: '엔진',
    memo: '정기 점검 및 오일 교체',
  });
}
