// Firebase 프로젝트 설정값 템플릿
// GitHub Actions 배포 시 저장소 Secrets 값으로 이 템플릿의 ${...} 부분이 치환되어
// js/firebase-config.js가 자동 생성됩니다. (자세한 절차는 README.md 참고)
// 로컬에서 직접 테스트하려면 이 파일을 복사해 js/firebase-config.js를 만들고
// ${...} 부분을 실제 값으로 바꿔서 사용하세요. (해당 파일은 git에 커밋하지 않습니다)
export const firebaseConfig = {
  apiKey: "${FIREBASE_API_KEY}",
  authDomain: "${FIREBASE_AUTH_DOMAIN}",
  projectId: "${FIREBASE_PROJECT_ID}",
  storageBucket: "${FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${FIREBASE_APP_ID}",
};
