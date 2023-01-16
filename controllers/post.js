const Post = require('../models/post');
const Comment = require('../models/comment');
const expressAsync = require('express-async-handler');
const { body } = require('express-validator');
const Draft = require('../models/draft');

exports.homePage = expressAsync(async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('posted_by')
      .populate('comment')
      .lean();

    res.json(posts);
  } catch (error) {
    console.error(error);
  }
});

exports.getSinglePost = expressAsync(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('posted_by')
      .populate('comment')
      .lean();
    res.json(post);
  } catch (error) {
    console.error(error);
  }
});

exports.createPost = expressAsync(async (req, res) => {
  body('text', 'Text must not be empty').trim().isLength({ min: 1 }).escape();
  body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape();
  try {
    if (!req.body.text) {
      res.status(400);
      throw new Error('Missing text field.');
    }

    if (!req.body.title) {
      res.status(400);
      throw new Error('Missing title field');
    }

    const post = await Post.create({
      title: req.body.title,
      text: req.body.text,
      posted_by: req.user.id,
    });
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
  }
});

exports.updatePost = expressAsync(async (req, res) => {
  body('text', 'Text must not be empty').trim().isLength({ min: 1 }).escape();
  body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape();
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(400).json({ message: 'post not found' });
  }

  const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedPost);
});

exports.deletePost = expressAsync(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(400).json({ message: 'post not found' });
  }

  await post.deleteOne();
  res.status(200).json({ id: req.params.id, status: 'deleted' });
});

exports.getDraft = expressAsync(async (req, res) => {
  try {
    const drafts = await Draft.find().populate('posted_by').lean();

    res.json(drafts);
  } catch (error) {
    console.error(error);
  }
});

exports.getSingleDraft = expressAsync(async (req, res) => {
  try {
    const draft = await Draft.findById(req.params.id)
      .populate('posted_by')
      .lean();
    res.json(draft);
  } catch (error) {
    console.error(error);
  }
});

exports.createDraft = expressAsync(async (req, res) => {
  body('text', 'Text must not be empty').trim().isLength({ min: 1 }).escape();
  body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape();
  try {
    if (!req.body.text) {
      res.status(400, { message: 'Missing text field.' });
      throw new Error('Missing text field.');
    }

    if (!req.body.title) {
      res.status(400, { message: 'Missing title field' });
      throw new Error('Missing title field');
    }

    const draft = await Draft.create({
      title: req.body.title,
      text: req.body.text,
      posted_by: req.user.id,
    });
    res.status(200).json(draft);
  } catch (error) {
    console.error(error);
  }
});

exports.deleteDraft = expressAsync(async (req, res) => {
  const draft = await Draft.findById(req.params.id);

  if (!draft) {
    res.status(400).json({ message: 'draft not found' });
  }

  await Draft.deleteOne();
  res.status(200).json({ id: req.params.id, status: 'deleted' });
});

exports.updateDraft = expressAsync(async (req, res) => {
  body('text', 'Text must not be empty').trim().isLength({ min: 1 }).escape();
  body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape();
  const draft = await Draft.findById(req.params.id);
  if (!draft) {
    res.status(400).json({ message: 'draft not found' });
  }

  const updatedDraft = await Draft.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedDraft);
});

exports.createComment = expressAsync(async (req, res) => {
  body('text', 'Text must not be empty').trim().isLength({ min: 1 }).escape();
  body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape();
  try {
    if (!req.body.text) {
      res.status(400);
      throw new Error('Add a comment field.');
    }

    const comment = await Comment.create({
      username: req.body.username,
      text: req.body.text,
      postId: req.params.id,
    });
    await Post.findByIdAndUpdate(
      { _id: req.params.id },
      { $push: { comment } }
    );
    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
  }
});

exports.deleteComment = expressAsync(async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $pull: { comment: req.params.id },
      },
      {
        new: true,
      }
    );

    if (!post) {
      res.status(400).json({ message: 'Post not found' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({ id: req.params.id, status: 'comment deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
});
