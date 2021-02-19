const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(bodyParser.json());

app.post("/api/posts", (req, res, next) => {
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: 'success'
    });
})
app.get('/api/posts', (req, res, next) => {
    const posts = [
        { id: '1001', title: '第一篇博客', content: 'this is coming from the server' },
        { id: '1002', title: '第二篇博客', content: 'this is coming from the server' }
    ]
    res.status(200).json({
        message: 'success',
        posts: posts
    });
})


module.exports = app;