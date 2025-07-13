import { query } from '../config/database.js';
import { FormSubmission, CreateFormSubmissionRequest, UpdateFormSubmissionRequest, DatabaseResult } from '../types/index.js';

export class FormService {
  // 创建表单提交
  static async createFormSubmission(data: CreateFormSubmissionRequest): Promise<DatabaseResult<FormSubmission>> {
    try {
      const { company_name, user_name, phone, company_types, source_url } = data;
      
      const result = await query(
        `INSERT INTO form_submissions (company_name, user_name, phone, company_types, source_url)
         VALUES ($1, $2, $3, $4, $5)
      `,
        [company_name, user_name, phone, JSON.stringify(company_types), source_url]
      );

      // SQLite 获取最后插入行
      const lastRow = await query('SELECT * FROM form_submissions ORDER BY id DESC LIMIT 1');

      return {
        success: true,
        data: lastRow.rows[0] as FormSubmission
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
      
      const result = await query(
        `SELECT * FROM form_submissions 
         ORDER BY created_at DESC 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      return {
        success: true,
        data: result.rows as FormSubmission[]
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
      const result = await query(
        'SELECT * FROM form_submissions WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return {
          success: false,
          error: '表单提交不存在'
        };
      }

      return {
        success: true,
        data: result.rows[0] as FormSubmission
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
      const values: any[] = [id];
      let paramIndex = 2;

      if (status !== undefined) {
        updateFields.push(`status = $${paramIndex++}`);
        values.push(status);
      }

      if (notes !== undefined) {
        updateFields.push(`notes = $${paramIndex++}`);
        values.push(notes);
      }

      if (updateFields.length === 0) {
        return {
          success: false,
          error: '没有提供更新字段'
        };
      }

      const result = await query(
        `UPDATE form_submissions 
         SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
      `,
        values
      );

      const updatedRow = await query('SELECT * FROM form_submissions WHERE id = $1', [id]);

      return {
        success: true,
        data: updatedRow.rows[0] as FormSubmission
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
      const result = await query(
        'DELETE FROM form_submissions WHERE id = $1',
        [id]
      );

      if (result.rowCount === 0) {
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
      const result = await query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
          COUNT(CASE WHEN status = 'invalid' THEN 1 END) as invalid
        FROM form_submissions
      `);

      return {
        success: true,
        data: result.rows[0]
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