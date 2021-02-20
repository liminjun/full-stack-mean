const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();
mongoose.connect("mongodb+srv://lee:h0tlsbOFcFFqfk3c@cluster0.qbx4p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    .then(() => {
        console.log("Connected to mongodb.");
    }).catch(() => {
        console.log("Failed to connect mongodb.");
    });


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(bodyParser.json());

app.post("/api/posts", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    })
    post.save().then(createdPost => {
        console.log(createdPost);
        res.status(201).json({
            message: 'success',
            postId: createdPost._id
        });
    });

})
app.get('/api/posts', (req, res, next) => {
    // const posts = [
    //     { id: '1001', title: '第一篇博客', content: 'this is coming from the server' },
    //     { id: '1002', title: '第二篇博客', content: 'this is coming from the server' }
    // ]
    Post.find()
        .then(posts => {
            res.status(200).json({
                message: 'success',
                posts: posts
            });
        });

});

app.delete("/api/posts/:id", (req, res, next) => {
    console.log(req.params.id);
    Post.deleteOne({
        _id: req.params.id
    })
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: 'success'
            });
        })

})


module.exports = app;