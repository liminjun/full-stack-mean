const express = require('express');
const Post = require('../models/post');

const router = express.Router();


router.post("/api/posts", (req, res, next) => {
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
router.get('/api/posts', (req, res, next) => {
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

router.delete("/api/posts/:id", (req, res, next) => {
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

});

module.exports = router;