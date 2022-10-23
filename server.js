
require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

const posts = [
    {
        username: "Bob",
        title: "Post 1"
    },
    {
        username: "Jim",
        title: "Post 2"
    },
]

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // 해석: authHeader가 존재하면 authHeader를 공백을 기준으로 나눈 뒤, 1번째 인덱스를 가져온다.
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => { // jwt.verif해석: 토큰을 검증한다. 토큰, 비밀키, 콜백함수를 인자로 받는다.
        if (err) return res.sendStatus(403);
        req.user = user;
        next(); // next()를 호출해야지 다음 미들웨어로 넘어간다.
    });
    // 해석: user는 토큰을 해석한 결과물이다. 즉, user는 { name: username }이다.
}

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
});


app.listen(3004, () => {
    console.log('Server is running on port 3004');
});