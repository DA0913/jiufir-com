import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { NewsService } from '../services/newsService.js';
import { authMiddleware } from '../middleware/auth.js';
import { CreateNewsArticleRequest } from '../types/index.js';

const router = Router();

// 验证新闻文章数据
const validateNewsArticle = [
  body('title').trim().isLength({ min: 1, max: 500 }).withMessage('标题长度必须在1-500字符之间'),
  body('category').trim().isLength({ min: 1, max: 100 }).withMessage('分类长度必须在1-100字符之间'),
  body('publish_time').isISO8601().withMessage('发布时间格式不正确'),
  body('image_url').optional().isURL().withMessage('图片URL格式不正确'),
  body('summary').optional().isString().withMessage('摘要必须是字符串'),
  body('content').optional().isString().withMessage('内容必须是字符串'),
  body('is_featured').optional().isBoolean().withMessage('精选状态必须是布尔值')
];

// 获取所有新闻文章
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await NewsService.getAllNewsArticles(page, limit);

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        pagination: {
          page,
          limit,
          total: result.data?.length || 0
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: '获取新闻文章失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('获取新闻文章错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取精选新闻文章
router.get('/featured', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const result = await NewsService.getFeaturedNewsArticles(limit);

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: '获取精选新闻失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('获取精选新闻错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 根据ID获取新闻文章
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await NewsService.getNewsArticleById(id);

    if (result.success) {
      // 增加浏览量
      await NewsService.incrementViews(id);
      
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('获取新闻文章错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 根据分类获取新闻文章
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await NewsService.getNewsArticlesByCategory(category, page, limit);

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        pagination: {
          page,
          limit,
          total: result.data?.length || 0
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: '获取分类新闻失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('获取分类新闻错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 创建新闻文章（管理员接口）
router.post('/', authMiddleware, validateNewsArticle, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '数据验证失败',
        errors: errors.array()
      });
    }

    const newsData: CreateNewsArticleRequest = {
      title: req.body.title,
      category: req.body.category,
      publish_time: req.body.publish_time,
      image_url: req.body.image_url,
      summary: req.body.summary,
      content: req.body.content,
      is_featured: req.body.is_featured
    };

    const result = await NewsService.createNewsArticle(newsData);

    if (result.success) {
      res.status(201).json({
        success: true,
        message: '新闻文章创建成功',
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: '新闻文章创建失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('创建新闻文章错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 更新新闻文章（管理员接口）
router.patch('/:id', authMiddleware, validateNewsArticle, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '数据验证失败',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updateData: Partial<CreateNewsArticleRequest> = req.body;

    const result = await NewsService.updateNewsArticle(id, updateData);

    if (result.success) {
      res.json({
        success: true,
        message: '更新成功',
        data: result.data
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('更新新闻文章错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 删除新闻文章（管理员接口）
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await NewsService.deleteNewsArticle(id);

    if (result.success) {
      res.json({
        success: true,
        message: '删除成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: result.error
      });
    }
  } catch (error) {
    console.error('删除新闻文章错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取新闻分类列表
router.get('/categories/list', async (req: Request, res: Response) => {
  try {
    const result = await NewsService.getNewsCategories();

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: '获取分类列表失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('获取分类列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

export default router; 