# partim3-TIL-server

EXPRESS를 이용한 프로젝트 TIL 서버 코드

# 로컬 테스트 환경

1. npm install
2. npm install -g typeorm
3. env 폴더에 development.env 생성 후

```
## Environment ##
NODE_ENV=development

## Server ##
PORT=

DB_CONNECTION=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

TOKEN_SECRET=

KAKAO_CLIENTID=
NAVER_CLIENTID=
GOOGLE_CLIENTID=

GITHUB_CLIENTID =
GITHUB_CLIENTSECRET =

## Setup jet-logger ##
JET_LOGGER_MODE=CONSOLE
JET_LOGGER_FILEPATH=jet-logger.log
JET_LOGGER_TIMESTAMP=TRUE
JET_LOGGER_FORMAT=LINE
```

npm run dev 로 테스트
