### backend setup

```sh
# cd C:\JnJ-soft\Projects\internal\jnj-youtube\backend\nodejs
cd /Users/youchan/Dev/Jnj-soft/Projects/internal/backend-youtube/nodejs

# basic, youtube
npm i dotenv axios express cors youtube-captions-scraper @distube/ytdl-core

# jnjsoft
npm i jnj-lib-base jnj-lib-google

# graphql
npm install -D @apollo/server apollo-server-express
```

### express server

```js
# server 시작
// cd C:\JnJ-soft\Projects\internal\jnj-youtube\backend\nodejs\express

cd /Users/youchan/Dev/Jnj-soft/Projects/internal/backend-youtube/nodejs/express
node youtube.js
```

### graphql server

```js
# server 시작
// cd C:\JnJ-soft\Projects\internal\jnj-youtube\backend\nodejs\graphql

cd /Users/youchan/Dev/Jnj-soft/Projects/internal/backend-youtube/nodejs/graphql
node index_http.js
```

### github

```sh
cd /Users/youchan/Dev/Jnj-soft/Projects/internal/backend-youtube

github -e pushRepo -n backend-youtube -u jnjsoftweb -d "backend for youtube tools"
```
