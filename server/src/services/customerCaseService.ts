import { run, get, all } from '../config/sqlite';
import { CustomerCase, CreateCustomerCaseRequest, DatabaseResult } from '../types/index.js';

export class CustomerCaseService {
  // 创建客户案例
  static async createCustomerCase(data: CreateCustomerCaseRequest): Promise<DatabaseResult<CustomerCase>> {
    try {
      const {
        company_name,
        company_logo,
        industry,
        description,
        results,
        metrics,
        is_featured = false,
        sort_order = 0,
        status = 'active'
      } = data as any;

      const insertInfo = run(
        `INSERT INTO customer_cases (
          company_name,
          company_logo,
          industry,
          description,
          results,
          metrics,
          is_featured,
          sort_order,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          company_name,
          company_logo,
          industry,
          description,
          results,
          JSON.stringify(metrics ?? {}),
          is_featured ? 1 : 0,
          sort_order,
          status
        ]
      );

      const newCase = get<CustomerCase>('SELECT * FROM customer_cases WHERE id = ?', [insertInfo.lastInsertRowid]);

      return {
        success: true,
        data: newCase!
      };
    } catch (error) {
      console.error('创建客户案例失败:', error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  // 获取所有客户案例
  static async getAllCustomerCases(page = 1, limit = 10): Promise<DatabaseResult<CustomerCase[]>> {
    try {
      const offset = (page - 1) * limit;
      const cases = all<CustomerCase>(
        `SELECT * FROM customer_cases ORDER BY sort_order ASC, created_at DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );
      return {
        success: true,
        data: cases
      };
    } catch (error) {
      console.error('获取客户案例失败:', error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  // 根据ID获取客户案例
  static async getCustomerCaseById(id: string): Promise<DatabaseResult<CustomerCase>> {
    try {
      const record = get<CustomerCase>('SELECT * FROM customer_cases WHERE id = ?', [id]);
      if (!record) {
        return {
          success: false,
          error: '客户案例不存在'
        };
      }
      return {
        success: true,
        data: record
      };
    } catch (error) {
      console.error('获取客户案例失败:', error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  // 更新客户案例
  static async updateCustomerCase(id: string, data: Partial<CreateCustomerCaseRequest>): Promise<DatabaseResult<CustomerCase>> {
    try {
      const updateFields: string[] = [];
      const values: any[] = [];

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          updateFields.push(`${key} = ?`);
          if (key === 'metrics' && typeof value === 'object') {
            values.push(JSON.stringify(value));
          } else if (key === 'is_featured') {
            values.push(value ? 1 : 0);
          } else {
            values.push(value);
          }
        }
      });

      if (updateFields.length === 0) {
        return { success: false, error: '没有提供更新字段' };
      }

      // updated_at
      updateFields.push('updated_at = CURRENT_TIMESTAMP');

      values.push(id);

      const stmt = run(
        `UPDATE customer_cases SET ${updateFields.join(', ')} WHERE id = ?`,
        values
      );

      if (stmt.changes === 0) {
        return { success: false, error: '客户案例不存在' };
      }

      const updated = get<CustomerCase>('SELECT * FROM customer_cases WHERE id = ?', [id]);
      return { success: true, data: updated! };
    } catch (error) {
      console.error('更新客户案例失败:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  // 删除客户案例
  static async deleteCustomerCase(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const delInfo = run('DELETE FROM customer_cases WHERE id = ?', [id]);
      return {
        success: delInfo.changes > 0,
        data: delInfo.changes > 0
      };
    } catch (error) {
      console.error('删除客户案例失败:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  // 获取精选客户案例
  static async getFeaturedCustomerCases(limit = 5): Promise<DatabaseResult<CustomerCase[]>> {
    try {
      const featured = all<CustomerCase>(
        `SELECT * FROM customer_cases WHERE is_featured = 1 AND status = 'active' ORDER BY sort_order ASC LIMIT ?`,
        [limit]
      );
      return { success: true, data: featured };
    } catch (error) {
      console.error('获取精选客户案例失败:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  // 获取行业列表
  static async getIndustries(): Promise<DatabaseResult<string[]>> {
    try {
      const rows = all<{ industry: string }>('SELECT DISTINCT industry FROM customer_cases ORDER BY industry');
      const industries = rows.map(r => r.industry);
      return { success: true, data: industries };
    } catch (error) {
      console.error('获取行业列表失败:', error);
      return { success: false, error: (error as Error).message };
    }
  }
}