import { run, get, all } from '../config/sqlite';
import { FormSubmission, CreateFormSubmissionRequest, UpdateFormSubmissionRequest, DatabaseResult } from '../types/index.js';

export class FormService {
  // 创建表单提交
  static async createFormSubmission(data: CreateFormSubmissionRequest): Promise<DatabaseResult<FormSubmission>> {
    try {
      const { company_name, user_name, phone, company_types, source_url } = data;
      
      // 使用 better-sqlite3 同步插入
      const insertInfo = run(
        `INSERT INTO form_submissions (company_name, user_name, phone, company_types, source_url)
         VALUES (?, ?, ?, ?, ?)`,
        [company_name, user_name, phone, JSON.stringify(company_types), source_url]
      );

      // 查询刚刚插入的记录
      const newRecord = get<FormSubmission>(
        'SELECT * FROM form_submissions WHERE id = ?',
        [insertInfo.lastInsertRowid]
      );

      return {
        success: true,
        data: newRecord!
      };
    } catch (error) {
      console.error('创建表单提交失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 获取所有表单提交
  static async getAllFormSubmissions(page: number = 1, limit: number = 10): Promise<DatabaseResult<FormSubmission[]>> {
    try {
      const offset = (page - 1) * limit;
      
      const submissions = all<FormSubmission>(
        `SELECT * FROM form_submissions 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      return {
        success: true,
        data: submissions
      };
    } catch (error) {
      console.error('获取表单提交失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 根据ID获取表单提交
  static async getFormSubmissionById(id: string): Promise<DatabaseResult<FormSubmission>> {
    try {
      const record = get<FormSubmission>('SELECT * FROM form_submissions WHERE id = ?', [id]);

      if (!record) {
        return {
          success: false,
          error: '表单提交不存在'
        };
      }

      return {
        success: true,
        data: record
      };
    } catch (error) {
      console.error('获取表单提交失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 更新表单提交状态
  static async updateFormSubmission(id: string, data: UpdateFormSubmissionRequest): Promise<DatabaseResult<FormSubmission>> {
    try {
      const { status, notes } = data;
      const updateFields: string[] = [];
      const values: any[] = [];

      if (status !== undefined) {
        updateFields.push(`status = ?`);
        values.push(status);
      }

      if (notes !== undefined) {
        updateFields.push(`notes = ?`);
        values.push(notes);
      }

      // 最后添加 WHERE 条件参数 id
      values.push(id);

      if (updateFields.length === 0) {
        return {
          success: false,
          error: '没有提供更新字段'
        };
      }

      const stmt = run(
        `UPDATE form_submissions 
         SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        values
      );

      if (stmt.changes === 0) {
        return {
          success: false,
          error: '表单提交不存在'
        };
      }

      // 返回更新后的记录
      const updated = get<FormSubmission>('SELECT * FROM form_submissions WHERE id = ?', [id]);

      return {
        success: true,
        data: updated!
      };
    } catch (error) {
      console.error('更新表单提交失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 删除表单提交
  static async deleteFormSubmission(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const deleteInfo = run('DELETE FROM form_submissions WHERE id = ?', [id]);

      if (deleteInfo.changes === 0) {
        return {
          success: false,
          error: '表单提交不存在'
        };
      }

      return {
        success: true,
        data: true
      };
    } catch (error) {
      console.error('删除表单提交失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 获取表单提交统计
  static async getFormSubmissionStats(): Promise<DatabaseResult<any>> {
    try {
      const stats = get(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'invalid' THEN 1 ELSE 0 END) as invalid
        FROM form_submissions`
      );

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('获取表单统计失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }
} 