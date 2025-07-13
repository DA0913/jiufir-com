import { run, get, all } from '../config/sqlite.js';
import { CustomerCase, CreateCustomerCaseRequest, DatabaseResult } from '../types/index.js';

export class CustomerCaseService {
  /** 新增客户案例 */
  static async create(data: CreateCustomerCaseRequest): Promise<DatabaseResult<CustomerCase>> {
    try {
      const {
        company_name,
        company_logo,
        industry,
        description,
        results,
        metrics = {},
        is_featured = false,
        sort_order = 0,
        status = 'active'
      } = data;

      const insert = run(
        `INSERT INTO customer_cases (company_name, company_logo, industry, description, results, metrics, is_featured, sort_order, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          company_name,
          company_logo,
          industry,
          description,
          results,
          JSON.stringify(metrics),
          is_featured ? 1 : 0,
          sort_order,
          status
        ]
      );

      const inserted = get<CustomerCase>('SELECT * FROM customer_cases WHERE id = ?', [insert.lastInsertRowid]);
      return {
        success: true,
        data: inserted as CustomerCase
      };
    } catch (err) {
      console.error('创建客户案例失败:', err);
      return { success: false, error: '服务器错误' };
    }
  }

  /** 分页获取列表 */
  static async list(page = 1, limit = 10): Promise<DatabaseResult<CustomerCase[]>> {
    try {
      const offset = (page - 1) * limit;
      const rows = all<CustomerCase>('SELECT * FROM customer_cases ORDER BY sort_order ASC LIMIT ? OFFSET ?', [limit, offset]);
      return { success: true, data: rows };
    } catch (err) {
      console.error('获取案例列表失败:', err);
      return { success: false, error: '服务器错误' };
    }
  }

  /** 根据ID获取 */
  static async getById(id: string): Promise<DatabaseResult<CustomerCase>> {
    try {
      const row = get<CustomerCase>('SELECT * FROM customer_cases WHERE id = ?', [id]);
      if (!row) return { success: false, error: '案例不存在' };
      return { success: true, data: row };
    } catch (err) {
      console.error('获取案例详情失败:', err);
      return { success: false, error: '服务器错误' };
    }
  }

  /** 更新 */
  static async update(id: string, data: Partial<CreateCustomerCaseRequest>): Promise<DatabaseResult<CustomerCase>> {
    try {
      const updateFields: string[] = [];
      const values: any[] = [];

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          updateFields.push(`${key} = ?`);
          if (key === 'is_featured') {
            values.push((value as any) ? 1 : 0);
          } else if (key === 'metrics') {
            values.push(JSON.stringify(value));
          } else {
            values.push(value);
          }
        }
      });

      if (updateFields.length === 0) {
        return { success: false, error: '没有提供更新字段' };
      }

      const sql = `UPDATE customer_cases SET ${updateFields.join(', ')}, updated_at = datetime('now') WHERE id = ?`;
      run(sql, [...values, id]);

      const updated = get<CustomerCase>('SELECT * FROM customer_cases WHERE id = ?', [id]);
      if (!updated) return { success: false, error: '案例不存在' };
      return { success: true, data: updated };
    } catch (err) {
      console.error('更新案例失败:', err);
      return { success: false, error: '服务器错误' };
    }
  }

  /** 删除 */
  static async remove(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const del = run('DELETE FROM customer_cases WHERE id = ?', [id]);
      return { success: del.changes > 0, data: del.changes > 0 };
    } catch (err) {
      console.error('删除案例失败:', err);
      return { success: false, error: '服务器错误' };
    }
  }

  /** 行业列表 */
  static async industries(): Promise<DatabaseResult<string[]>> {
    try {
      const rows = all<{ industry: string }>('SELECT DISTINCT industry FROM customer_cases ORDER BY industry');
      return { success: true, data: rows.map(r => r.industry) };
    } catch (err) {
      console.error('获取行业列表失败:', err);
      return { success: false, error: '服务器错误' };
    }
  }
}