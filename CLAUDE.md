## 명령어
- 개발 서버: `npm run dev` (root — client :5173 + server :4000 동시 실행)
- 빌드: client `npm run build` (server는 빌드 없음)
- 예시 데이터 시드: `npm run seed --prefix server` (1회성, 이미 데이터가 있으면 건너뜀)
- 린트: 없음
- 타입체크: 없음
- 테스트: 테스트 프레임워크 없음

## 절대 금지
- `.env*` 파일 내용을 커밋하거나 출력하지 말 것
- **Firebase 서비스 계정 키(private key)를 출력·커밋·공유하지 말 것** — `server/.env`에만 존재
- `git push --force` 금지
- 운영 데이터에 대해 파괴적 작업(컬렉션 일괄 삭제 등)을 함부로 실행하지 말 것

## 규칙
- 미배포, 로컬 개발 전용 (배포 설정 없음)
- **데이터는 Firestore에 저장된다** (`server/data/*.js`가 Firestore 접근 레이어). 서버 재시작해도 유지됨
- **인증은 Firebase Auth**(이메일/비밀번호). 클라이언트가 로그인 후 ID 토큰을 받고,
  `api/client.js`가 모든 요청에 `Authorization: Bearer <token>`을 자동으로 붙인다
- 서버는 **요청 본문의 userId를 절대 신뢰하지 않는다.** 신원은 검증된 토큰(`req.uid`)에서만 얻는다
- 사용자 문서 ID = Firebase Auth uid (문자열). 예전 숫자 id가 아니므로 비교 시 주의
- 브라우저는 Firestore에 직접 접근하지 않는다 — 모든 접근은 Express + Admin SDK 경유.
  따라서 `firestore.rules`는 클라이언트 직접 접근을 전부 차단하고 있다
- 시세 그래프(`server/data/priceHistory.js`)는 어종 id를 시드로 한 결정적 더미 데이터 — Firestore에 저장하지 않음
- React 18 + Vite / Express 4
