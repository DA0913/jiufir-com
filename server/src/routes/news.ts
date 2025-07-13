import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { NewsService } from '../services/newsService.js';
import { CreateNewsArticleRequest, UpdateNewsArticleRequest } from '../types/index.js';

const router = Router();

// 获取所有新闻文章
router.get('/', (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;

    const result = NewsService.getAllNewsArticles(page, limit, category);

    if (result.success) {
      res.json({
        success: true,
        message: '获取新闻列表成功',
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
        message: '获取新闻列表失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('获取新闻列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取精选新闻
router.get('/featured', (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    const result = NewsService.getFeaturedNews(limit);

    if (result.success) {
      res.json({
        success: true,
        message: '获取精选新闻成功',
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
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取新闻分类
router.get('/categories', (req: Request, res: Response) => {
  try {
    const result = NewsService.getNewsCategories();

    if (result.success) {
      res.json({
        success: true,
        message: '获取新闻分类成功',
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: '获取新闻分类失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('获取新闻分类错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取新闻统计
router.get('/stats', (req: Request, res: Response) => {
  try {
    const result = NewsService.getNewsStats();

    if (result.success) {
      res.json({
        success: true,
        message: '获取新闻统计成功',
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: '获取新闻统计失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('获取新闻统计错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 根据ID获取新闻详情
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '缺少新闻ID参数'
      });
    }

    const result = NewsService.getNewsArticleById(id);

    if (result.success) {
      res.json({
        success: true,
        message: '获取新闻详情成功',
        data: result.data
      });
    } else {
      res.status(404).json({
        success: false,
        message: '新闻不存在',
        error: result.error
      });
    }
  } catch (error) {
    console.error('获取新闻详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 创建新闻文章（管理员接口）
router.post('/', [
  body('title').trim().isLength({ min: 1 }).withMessage('标题不能为空'),
  body('category').trim().isLength({ min: 1 }).withMessage('分类不能为空'),
  body('publish_time').isISO8601().withMessage('发布时间格式不正确'),
  body('summary').optional().trim(),
  body('content').optional().trim(),
  body('is_featured').optional().isBoolean().withMessage('精选状态必须是布尔值')
], (req: Request, res: Response) => {
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
      is_featured: req.body.is_featured || false
    };

    const result = NewsService.createNewsArticle(newsData);

    if (result.success) {
      res.status(201).json({
        success: true,
        message: '创建新闻文章成功',
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: '创建新闻文章失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('创建新闻文章错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 更新新闻文章（管理员接口）
router.patch('/:id', [
  body('title').optional().trim().isLength({ min: 1 }).withMessage('标题不能为空'),
  body('category').optional().trim().isLength({ min: 1 }).withMessage('分类不能为空'),
  body('publish_time').optional().isISO8601().withMessage('发布时间格式不正确'),
  body('summary').optional().trim(),
  body('content').optional().trim(),
  body('is_featured').optional().isBoolean().withMessage('精选状态必须是布尔值')
], (req: Request, res: Response) => {
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
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '缺少新闻ID参数'
      });
    }

    const updateData: UpdateNewsArticleRequest = {
      title: req.body.title,
      category: req.body.category,
      publish_time: req.body.publish_time,
      image_url: req.body.image_url,
      summary: req.body.summary,
      content: req.body.content,
      is_featured: req.body.is_featured
    };

    const result = NewsService.updateNewsArticle(id, updateData);

    if (result.success) {
      res.json({
        success: true,
        message: '更新新闻文章成功',
        data: result.data
      });
    } else {
      res.status(404).json({
        success: false,
        message: '更新新闻文章失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('更新新闻文章错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 删除新闻文章（管理员接口）
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '缺少新闻ID参数'
      });
    }

    const result = NewsService.deleteNewsArticle(id);

    if (result.success) {
      res.json({
        success: true,
        message: '删除新闻文章成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '删除新闻文章失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('删除新闻文章错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

export default router; 