# 마이링크 (MyLink)

마이링크(MyLink)는 크리에이터와 개인이 흩어져 있는 자신만의 다양한 링크를 하나의 페이지로 모아 효과적으로 퍼스널 브랜딩을 할 수 있도록 돕는 멀티 링크 프로필 서비스입니다.

## 🚀 주요 기능

- **간편한 소셜 로그인**: Firebase Auth를 기반으로 구글 소셜 계정을 통해 손쉽게 가입하고 로그인할 수 있습니다.
- **나만의 퍼블릭 URL**: `displayName`을 활용하여 사용자 고유의 퍼블릭 프로필 주소(`/[displayName]`)를 제공합니다.
- **직관적인 인라인 편집**: 대시보드에서 별도의 페이지 이동 없이 연필 아이콘을 클릭하여 실명(`username`), 닉네임/슬러그(`displayName`), 소개글, 링크 항목 등을 즉시 수정할 수 있습니다.
- **링크 관리 및 파비콘 자동 연동**: 손쉽게 새로운 링크를 추가하고 삭제할 수 있으며, 구글 API를 활용해 등록한 링크의 파비콘을 자동으로 불러와 시각적으로 예쁘게 표시합니다.
- **링크 클릭 통계**: 내 프로필을 방문한 사람들이 어떤 링크를 가장 많이 클릭했는지 확인할 수 있는 개별 링크 조회수를 제공합니다.

## 🛠 기술 스택

**Frontend**
- Next.js 16.1.7 (App Router, Turbopack)
- React 19.0.0
- TypeScript
- Tailwind CSS 4.2.1
- shadcn/ui
- Remix Icon

**Backend & Auth**
- Firebase Authentication (Google 소셜 로그인)
- Firebase Firestore (데이터베이스)

## 📁 주요 디렉토리 구조

- `app/`: Next.js App Router 기반의 페이지 및 레이아웃 (대시보드 및 퍼블릭 프로필 동적 라우팅)
- `components/`: 재사용 가능한 UI 및 비즈니스 로직 컴포넌트 (`shadcn/ui` 기반)
- `lib/`: 유틸리티 함수 및 Firebase 설정
- `hooks/`: 커스텀 React 훅 (Auth, Firestore 데이터 패칭 등)
- `types/`: TypeScript 타입 정의
- `docs/`: 기획서 (PRD, 와이어프레임 등)

## 💻 시작하기

프로젝트를 로컬 환경에서 실행하는 방법입니다.

### 1. 환경 변수 설정
프로젝트 루트에 `.env.local` 파일을 생성하고 Firebase 관련 환경 변수를 입력합니다.
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. 패키지 설치 및 실행
```bash
# 패키지 설치
npm install

# 로컬 개발 서버 실행 (Turbopack 사용)
npm run dev
```
브라우저에서 `http://localhost:3000`에 접속하여 확인할 수 있습니다.

## 📜 주요 명령어

- `npm run dev`: 로컬 개발 서버 실행
- `npm run build`: 프로덕션 빌드 생성
- `npm run start`: 프로덕션 서버 실행
- `npm run lint`: ESLint를 통한 코드 린팅
- `npm run format`: Prettier를 통한 코드 포맷팅
- `npm run typecheck`: TypeScript 타입 체크
