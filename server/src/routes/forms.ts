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
router.post('/submit', validateFormSubmission, (req: Request, res: Response) => {
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

    const result = FormService.createFormSubmission(formData);

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
    console.error('表单提交错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取表单列表
router.get('/', (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = FormService.getAllFormSubmissions(page, limit);

    if (result.success) {
      res.json({
        success: true,
        message: '获取表单列表成功',
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
        message: '获取表单列表失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('获取表单列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取单个表单
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '缺少表单ID参数'
      });
    }
    
    const result = FormService.getFormSubmissionById(id);

    if (result.success) {
      res.json({
        success: true,
        message: '获取表单详情成功',
        data: result.data
      });
    } else {
      res.status(404).json({
        success: false,
        message: '表单不存在',
        error: result.error
      });
    }
  } catch (error) {
    console.error('获取表单详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 更新表单状态
router.patch('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '缺少表单ID参数'
      });
    }
    
    const updateData: UpdateFormSubmissionRequest = {
      status: req.body.status,
      notes: req.body.notes
    };

    const result = FormService.updateFormSubmission(id, updateData);

    if (result.success) {
      res.json({
        success: true,
        message: '更新表单状态成功',
        data: result.data
      });
    } else {
      res.status(404).json({
        success: false,
        message: '更新表单状态失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('更新表单状态错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 删除表单
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '缺少表单ID参数'
      });
    }
    
    const result = FormService.deleteFormSubmission(id);

    if (result.success) {
      res.json({
        success: true,
        message: '删除表单成功'
      });
    } else {
      res.status(404).json({
        success: false,
        message: '删除表单失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('删除表单错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取表单统计
router.get('/stats/overview', (req: Request, res: Response) => {
  try {
    const result = FormService.getFormSubmissionStats();

    if (result.success) {
      res.json({
        success: true,
        message: '获取统计信息成功',
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: '获取统计信息失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('获取统计信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

export default router; 