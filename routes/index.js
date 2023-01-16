var express = require('express');
var router = express.Router();

const homeController = require('../controllers/post');
const { protect } = require('../middleware/auth');

/* GET home page. */
router.get('/', homeController.homePage);

router.get('/posts/:id', homeController.getSinglePost);

router.post('/posts', protect, homeController.createPost);

router.put('/posts/:id', protect, homeController.updatePost);

router.delete('/posts/:id', protect, homeController.deletePost);

// Draft
router.get('/draft/:id', protect, homeController.getSingleDraft);

router.get('/draft', protect, homeController.getDraft);

router.post('/draft', protect, homeController.createDraft);

router.put('/draft/:id', protect, homeController.updateDraft);

router.delete('/draft/:id', protect, homeController.deleteDraft);

// comments

router.post('/posts/:id/comments', homeController.createComment);

router.delete(
  '/posts/:postId/comments/:id',
  protect,
  homeController.deleteComment
);

module.exports = router;
