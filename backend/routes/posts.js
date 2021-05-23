const express = require('express');
const multer = require("multer");

const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

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
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext)
    }
});

router.post("", checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
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
router.put(
    "/:id",
    checkAuth,
    multer({ storage: storage }).single("image"),
    (req, res, next) => {
      let imagePath = req.body.imagePath;
      if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
      }
      const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
      });
      console.log(post);
      Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
        if (result.nModified > 0) {
            res.status(200).json({ message: "Update successful!" });
        } else {
            res.status(401).json({ message: "Not authorized!" });
        }
      });
    }
  );
router.get('', (req, res, next) => {
    // const posts = [
    //     { id: '1001', title: '第一篇博客', content: 'this is coming from the server' },
    //     { id: '1002', title: '第二篇博客', content: 'this is coming from the server' }
    // ]
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchPosts;
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery
        .then(documents => {
            fetchPosts = documents;
            return Post.count();
        })
        .then(count => {
            res.status(200).json({
                message: 'success',
                posts: fetchPosts,
                maxPosts: count
            });
        });

});

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    });
  });

  
router.delete("/:id", checkAuth, (req, res, next) => {
    console.log(req.params.id);
    Post.deleteOne({
        _id: req.params.id,
        creator: req.userData.userId
    })
        .then(result => {
            console.log(result)
            if (result.n > 0) {
                res.status(200).json({
                    message: 'delete success'
                });
            } else {
                res.status(401).json({
                    message: 'Not authroized!'
                });
            }
            
        })

});

module.exports = router;