const Post = require('../models/post');

exports.createPost = (req, res, next) => {
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
};
exports.updatePost= (req, res, next) => {
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
      if (result.n > 0) {
          res.status(200).json({ message: "Update successful!" });
      } else {
          res.status(401).json({ message: "Not authorized!" });
      }
    });
  }
  exports.getPosts = (req, res, next) => {
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

}
  exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    });
  }

  exports.deletePost = (req, res, next) => {
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

}