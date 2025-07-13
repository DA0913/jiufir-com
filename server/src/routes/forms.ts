import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { FormService } from '../services/formService.js';
import { CreateFormSubmissionRequest, UpdateFormSubmissionRequest } from '../types/index.js';

const router = Router();

// 验证表单提交数据
const validateFormSubmission = [
  body('company_name').trim().isLength({ min: 1 }).withMessage('公司名称不能为空'),
  body('user_name').trim().isLength({ min: 1 }).withMessage('用户姓名不能为空'),
  body('phone').matches(/^1[3-9]\d{9}$/).withMessage('请输入正确的手机号码'),
  body('company_types').isArray({ min: 1 }).withMessage('请至少选择一个公司类型'),
  body('source_url').isURL().withMessage('来源URL格式不正确')
];

// 提交表单
router.post('/submit', validateFormSubmission, async (req: Request, res: Response) => {
  try {
    // 检查验证错误
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '表单验证失败',
        errors: errors.array()
      });
    }

    const formData: CreateFormSubmissionRequest = {
      company_name: req.body.company_name,
      user_name: req.body.user_name,
      phone: req.body.phone,
      company_types: req.body.company_types,
      source_url: req.body.source_url
    };

    const result = await FormService.createFormSubmission(formData);

    if (result.success) {
      res.status(201).json({
        success: true,
        message: '表单提交成功',
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: '表单提交失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('表单提交处理错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取所有表单提交（管理员接口）
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await FormService.getAllFormSubmissions(page, limit);

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
        message: '获取表单提交失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('获取表单提交错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 根据ID获取表单提交
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await FormService.getFormSubmissionById(id);

    if (result.success) {
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
    console.error('获取表单提交错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 更新表单提交状态（管理员接口）
router.patch('/:id', [
  body('status').optional().isIn(['pending', 'processing', 'completed', 'invalid']).withMessage('状态值无效'),
  body('notes').optional().isString().withMessage('备注必须是字符串')
], async (req: Request, res: Response) => {
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
    const updateData: UpdateFormSubmissionRequest = req.body;

    const result = await FormService.updateFormSubmission(id, updateData);

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
    console.error('更新表单提交错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 删除表单提交（管理员接口）
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await FormService.deleteFormSubmission(id);

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
    console.error('删除表单提交错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取表单提交统计（管理员接口）
router.get('/stats/summary', async (req: Request, res: Response) => {
  try {
    const result = await FormService.getFormSubmissionStats();

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: '获取统计失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('获取表单统计错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

export default router; 