import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { CustomerCaseService } from '../services/customerCaseService.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// 查询列表（可选过滤）
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', industry, status, keyword } = req.query;
    const result = await CustomerCaseService.getAllCustomerCases(
      parseInt(String(page)),
      parseInt(String(limit)),
      { industry: industry as string | undefined, status: status as string | undefined, keyword: keyword as string | undefined }
    );

    if (result.success) {
      res.json({ success: true, data: result.data });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 行业列表
router.get('/industries', async (_req: Request, res: Response) => {
  const result = await CustomerCaseService.getIndustries();
  result.success
    ? res.json({ success: true, data: result.data })
    : res.status(500).json({ success: false, message: result.error });
});

// 获取详情
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  const id = String(req.params.id);
  const result = await CustomerCaseService.getCustomerCaseById(id);
  result.success
    ? res.json({ success: true, data: result.data })
    : res.status(404).json({ success: false, message: result.error });
});

// 创建（需要认证）
router.post(
  '/',
  authMiddleware,
  [
    body('company_name').notEmpty(),
    body('company_logo').notEmpty(),
    body('industry').notEmpty(),
    body('description').notEmpty(),
    body('results').notEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const result = await CustomerCaseService.createCustomerCase(req.body);
    result.success
      ? res.status(201).json({ success: true, data: result.data })
      : res.status(500).json({ success: false, message: result.error });
  }
);

// 更新
router.put('/:id', authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
  const id = String(req.params.id);
  const result = await CustomerCaseService.updateCustomerCase(id, req.body);
  result.success
    ? res.json({ success: true, data: result.data })
    : res.status(404).json({ success: false, message: result.error });
});

// 删除
router.delete('/:id', authMiddleware, async (req: Request<{ id: string }>, res: Response) => {
  const id = String(req.params.id);
  const result = await CustomerCaseService.deleteCustomerCase(id);
  result.success
    ? res.json({ success: true })
    : res.status(404).json({ success: false, message: result.error });
});

// 批量删除
router.post('/batch-delete', authMiddleware, async (req: Request, res: Response) => {
  const { ids } = req.body as { ids: number[] };
  const result = CustomerCaseService.batchDelete(ids);
  result.success
    ? res.json({ success: true })
    : res.status(500).json({ success: false, message: result.error });
});

// 批量更新状态
router.post('/batch-update-status', authMiddleware, async (req: Request, res: Response) => {
  const { ids, status } = req.body as { ids: number[]; status: string };
  const result = CustomerCaseService.batchUpdateStatus(ids, status);
  result.success
    ? res.json({ success: true })
    : res.status(500).json({ success: false, message: result.error });
});

export default router;