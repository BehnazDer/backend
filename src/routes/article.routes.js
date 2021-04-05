import express from 'express';
import {
  getArticles,
  getArticleById,
  createArticle,
  deleteArticle,
} from '../controllers';
import {
  verifyToken,
  checkCreateArticlePermission,
  checkDeleteArticlePermission,
  articleCache,
} from '../middleware';

const router = express.Router();

router
  .route('/articles')
  .get(getArticles)
  .post(verifyToken, checkCreateArticlePermission, createArticle);

router
  .route('/articles/:id')
  .get(articleCache, getArticleById)
  .delete(verifyToken, checkDeleteArticlePermission, deleteArticle);

export default router;
