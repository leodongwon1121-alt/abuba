// Firebase Auth 에러 코드는 그대로 보여주면 사용자가 알아볼 수 없다.
const MESSAGES = {
  "auth/invalid-email": "이메일 형식을 확인해주세요.",
  "auth/email-already-in-use": "이미 가입된 이메일입니다.",
  "auth/weak-password": "비밀번호는 6자 이상이어야 합니다.",
  "auth/invalid-credential": "이메일 또는 비밀번호가 올바르지 않습니다.",
  "auth/wrong-password": "이메일 또는 비밀번호가 올바르지 않습니다.",
  "auth/user-not-found": "가입된 계정을 찾을 수 없습니다.",
  "auth/too-many-requests": "시도가 너무 많습니다. 잠시 후 다시 시도해주세요.",
  "auth/network-request-failed": "네트워크 연결을 확인해주세요.",
};

export function authErrorMessage(err) {
  return MESSAGES[err?.code] || err?.message || "처리 중 문제가 발생했습니다.";
}
