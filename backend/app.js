const express = require('express');

const app = express();

app.use('/api/posts', (req, res, next) => {
    const posts = [
        { id: '1001', title: 'helloworld', content: 'this is coming from the server' },
        { id: '1002', title: 'test', content: 'this is coming from the server' }
    ]
    res.status(200).json({
        message: 'success',
        posts: posts
    });
})


module.exports = app;