# partim3-TIL-server

EXPRESS를 이용한 프로젝트 TIL 서버 코드

# 로컬 환경 세팅

1. npm install
2. npm install -g typeorm
3. env 폴더생성 및 development.env생성
4. npm run dev 로 테스트

# 배포 환경 세팅

1. npm install
2. npm install -g typeorm
3. npm install -g pm2
4. env 폴더생성 및 production.env 생성
5. npm run pm2:start 으로 시작
6. npm run pm2:stop 으로 중지

# 환경변수

```
## Environment ##
NODE_ENV=

## Server ##
PORT=

DB_CONNECTION=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=

## ormconfig.ts ##

ENTITIES=src/db/entities/**/*{.ts,.js}

TOKEN_SECRET=

KAKAO_CLIENTID=
NAVER_CLIENTID=
GOOGLE_CLIENTID=

GITHUB_CLIENTID =
GITHUB_CLIENTSECRET =

## Setup jet-logger ##
JET_LOGGER_MODE=(((development: CONSOLE, prodcution: FILE)))
JET_LOGGER_FILEPATH=jet-logger.log
JET_LOGGER_TIMESTAMP=TRUE
JET_LOGGER_FORMAT=LINE
```
