### BACKEND

###

#### ref : reci

```
python의 selenium 라이브러리를 이용해 www.10000recipe.com에서 레시피 데이터를 크롤링하여 DB에 저장한다.

사용자 로그인, 냉장고 안 재료의 정보를 조회, 수정을 하게 하고 냉장고 안 재료에 대한 분류별 조회를 가능하게 한다.

재료에 따른 레시피를 제공한다.
```

#### Database

![DB_img](/uploads/d961524c8f1a8f9134fa3ca5d3045094/DB_img.JPG)



#### directory

```
/env
    - env.json
/middleware
    - db.js

/route
    /base
	    - auth.js
        - base.js
    /callback
        - callback.js
/sql
    /base
	    - base.xml
- README.md
- server.js
```

### description

```
node.js에서 express프레임워크를 사용하여 백엔드를 구축한다.
express에서 제공되는 기능으로
- 라우팅
- 미들웨어
- 에러처리
- 디버깅등으로

심플하지만 강력한 기능을 제공한다.
- https://expressjs.com/

다양한 미들웨어
- https://expressjs.com/en/resources/middleware.html


추가로 DB와 연동하기위해 mysql2라이브러리를 사용한다.

```

#### run

```
npm install
npm start

- http://localhost:3001

```

### routes

```
GET     http://localhost:3001/
GET     http://localhost:3001/base
GET     http://localhost:3001/base/auth/users/:id

POST    http://localhost:3001/base
PUT     http://localhost:3001/base
DELETE  http://localhost:3001/base
```
