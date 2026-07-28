## 명령어
- 개발 서버: `npm run dev` (root — client :5173 + server :4000 동시 실행)
- 빌드: client `npm run build` (server는 빌드 없음)
- 린트: 없음
- 타입체크: 없음
- 테스트: 테스트 프레임워크 없음

## 절대 금지
- `.env*` 파일 내용을 커밋하거나 출력하지 말 것
- `git push --force` 금지
- 데이터에 대해 파괴적 SQL(DROP/TRUNCATE 등)을 직접 실행하지 말 것 — 현재는 DB 없음
- UI/스타일 작업 전에는 반드시 DESIGN.md를 읽을 것

## 규칙
- 미배포, 로컬 개발 전용 (이번 단계에서는 배포 설정 없음)
- 데이터는 `server/data/`의 in-memory mock (JSON 기반), 추후 실제 DB로 교체 예정 — 영속성 없음
- React 18 + Vite / Express 4. 회원가입·로그인은 mock 인증(비밀번호 미검증)이므로 실제 보안 로직이 없음 — 프로덕션 전환 시 반드시 교체 필요
