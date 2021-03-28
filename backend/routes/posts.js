const { cbrt, MIN_SAFE_INTEGER } = require('core-js/fn/number');
const express = require('express');
const multer = require("multer");

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mine type');
        if (isValid) {
            error = nll;
        }
        cbrt(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext)
    }
});

router.post("/api/posts", multer({ storage: storage }).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    })
    post.save().then(createdPost => {
        console.log(createdPost);
        res.status(201).json({
            message: 'success',
            post: {
                ...createdPost,
                id: createdPost._id
            }
        });
    });

})
router.get('/api/posts', (req, res, next) => {
    // const posts = [
    //     { id: '1001', title: '第一篇博客', content: 'this is coming from the server' },
    //     { id: '1002', title: '第二篇博客', content: 'this is coming from the server' }
    // ]
    const pageSize = req.query.pageSize;
    const currentPage = req.query.page;
    const postQuery = Post.find();
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery.then(posts => {
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