import Post from '../models/post';
import Comment from '../models/comment';
import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';

/**
 * Get all posts
 * @param req
 * @param res
 * @returns void
 */

let _comments = [];

export function getPosts(req, res) {
  Comment.find().exec((error, comments) => {
    _comments = comments;
    Post.find().sort('-dateAdded').exec((err, posts) => {
      if (err) {
        res.status(500).send(err);
      }

      for (let i = 0; i < posts.length; i++) {
        for (let j = 0; j < _comments.length; j++) {
          if (_comments[j].pid === posts[i].cuid) {
            posts[i].comments.push({
              name: _comments[j].name,
              content: _comments[j].content,
              pid: _comments[j].pid,
              dateAdded: _comments[j].dateAdded,
              _id: _comments[j]._id,
            });
          }
        }
      }

      res.json({ posts });
    });
  });
}

/**
 * Save a post
 * @param req
 * @param res
 * @returns void
 */
export function addPost(req, res) {
  if (!req.body.post.name || !req.body.post.title || !req.body.post.content) {
    res.status(403).end();
  }

  const newPost = new Post(req.body.post);

  // Let's sanitize inputs
  newPost.title = sanitizeHtml(newPost.title);
  newPost.name = sanitizeHtml(newPost.name);
  newPost.content = sanitizeHtml(newPost.content);

  newPost.slug = slug(newPost.title.toLowerCase(), { lowercase: true });
  newPost.cuid = cuid();
  newPost.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ post: saved });
  });
}

/**
 * Save a post
 * @param req
 * @param res
 * @returns void
 */
export function addComment(req, res) {
  if (!req.body.comment.name || !req.body.comment.content) {
    res.status(403).end();
  }

  const newComment = new Comment(req.body.comment);

  // Let's sanitize inputs
  newComment.name = sanitizeHtml(newComment.name);
  newComment.content = sanitizeHtml(newComment.content);
  newComment.cuid = sanitizeHtml(newComment.cuid);

  newComment.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ comment: saved });
  });
}

/**
 * Get a single post
 * @param req
 * @param res
 * @returns void
 */
export function getPost(req, res) {
  Comment.find().exec((error, comments) => {
    _comments = comments;
    Post.findOne({ cuid: req.params.cuid }).exec((err, post) => {
      if (err) {
        res.status(500).send(err);
      }

      for (let j = 0; j < _comments.length; j++) {
        if (_comments[j].pid === post.cuid) {
          post.comments.push({
            name: _comments[j].name,
            content: _comments[j].content,
            pid: _comments[j].pid,
            dateAdded: _comments[j].dateAdded,
            _id: _comments[j]._id,
          });
        }
      }

      res.json({ post });
    });
  });
}

/**
 * Delete a post
 * @param req
 * @param res
 * @returns void
 */
export function deletePost(req, res) {
  Post.findOne({ cuid: req.params.cuid }).exec((err, post) => {
    if (err) {
      res.status(500).send(err);
    }

    post.remove(() => {
      res.status(200).end();
    });
  });
}
