# 반응속도 측정 웹앱

버튼을 누르면 게임이 시작되고, 화면이 빨간색으로 바뀌는 순간 클릭까지 걸린 시간(ms)을 측정하는 웹앱입니다.
기록은 Firebase Firestore에 저장되고, 랭킹(TOP 10)을 결과 화면에서 확인할 수 있습니다.

## 동작 방식

1. "게임 시작" 버튼을 누르면 화면이 파란색으로 바뀌고 대기 상태가 됩니다.
2. 1~12초 사이 랜덤한 시간이 지나면 화면이 빨간색으로 바뀝니다.
3. 빨간색으로 바뀐 뒤 클릭하면 반응 시간(ms)이 초록색 결과 화면에 표시됩니다.
4. 결과 화면에서 닉네임을 입력하고 저장하면 Firestore에 기록이 저장되고 랭킹이 갱신됩니다.
5. 빨간색이 되기 전에 클릭하면 실패 처리되며, 다시 시도할 수 있습니다.

## 프로젝트 구조

```
index.html          게임 화면 마크업
style.css           화면별 스타일 (파란/빨간/초록/실패)
js/game.js           게임 상태 관리 로직 (대기 → 판정 → 결과/실패)
js/db.js             saveScore(nickname, ms) / getTop(n) — DB 접근 함수
js/firebase-config.js  Firebase 프로젝트 설정값 (직접 채워야 함)
firestore.rules      Firestore 보안 규칙
.github/workflows/deploy.yml  GitHub Pages 자동 배포 워크플로우
```

## Firebase 프로젝트 준비 방법

이 앱은 Firebase Firestore를 DB로 사용합니다. 아래 순서대로 직접 프로젝트를 생성하고 설정값을 넣어주세요.

1. [Firebase 콘솔](https://console.firebase.google.com)에 접속해 로그인합니다.
2. "프로젝트 추가"를 눌러 새 프로젝트를 만듭니다 (Google Analytics는 선택 사항, 꺼도 무방합니다).
3. 왼쪽 메뉴에서 **빌드 > Firestore Database**로 이동해 "데이터베이스 만들기"를 클릭합니다.
   - 위치는 아무 곳이나 선택 가능하지만, 한국에서 사용한다면 `asia-northeast3(서울)`을 추천합니다.
   - 보안 규칙은 우선 "테스트 모드"로 시작해도 되지만, 배포 전에는 이 저장소의 `firestore.rules` 내용을 콘솔의 "Firestore Database > 규칙" 탭에 붙여넣고 게시(Publish)하세요.
4. 프로젝트 개요 화면에서 톱니바퀴(프로젝트 설정) > **일반** 탭으로 이동합니다.
5. 아래로 스크롤해 "내 앱" 섹션에서 웹 아이콘(`</>`)을 눌러 웹 앱을 등록합니다. (Firebase Hosting은 선택하지 않아도 됩니다 — 프론트엔드는 GitHub Pages에 배포합니다.)
6. 등록하면 아래와 같은 형태의 설정 객체가 나타납니다.

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

7. 이 값을 `js/firebase-config.js` 파일의 placeholder에 그대로 붙여넣고 커밋/푸시하면 됩니다.
   (Firebase 웹 API 키는 비밀값이 아니라 프로젝트 식별용이라 공개 저장소에 있어도 안전합니다. 실제 데이터 보호는 Firestore 보안 규칙이 담당합니다.)

## GitHub Pages 배포

- `main` 브랜치에 푸시되면 `.github/workflows/deploy.yml` 워크플로우가 자동으로 정적 파일을 GitHub Pages에 배포합니다.
- 저장소 **Settings > Pages**에서 Source를 "GitHub Actions"로 설정해야 합니다.
- 배포 후 `https://<username>.github.io/<repo>/` 주소로 접속할 수 있습니다.

## DB 함수

- `saveScore(nickname, ms)` — 닉네임과 반응 시간(ms)을 `scores` 컬렉션에 저장합니다.
- `getTop(n)` — 반응 시간이 빠른 순으로 상위 n개 기록을 반환합니다.

두 함수 모두 `js/db.js`에 정의되어 있으며, 다른 로직과 분리되어 있어 DB(Firestore)를 교체하더라도 이 파일만 수정하면 됩니다.
