import { query, queryOne, execute } from '../config/database.js';
import { FormSubmission, CreateFormSubmissionRequest, UpdateFormSubmissionRequest, DatabaseResult } from '../types/index.js';

export class FormService {
  // 创建表单提交
  static createFormSubmission(data: CreateFormSubmissionRequest): DatabaseResult<FormSubmission> {
    try {
      const { company_name, user_name, phone, company_types, source_url } = data;
      
      const result = execute(
        `INSERT INTO form_submissions (company_name, user_name, phone, company_types, source_url)
         VALUES (?, ?, ?, ?, ?)`,
        [company_name, user_name, phone, JSON.stringify(company_types), source_url]
      );

      if (result.lastInsertRowid) {
        // 获取刚插入的记录
        const insertedRecord = queryOne(
          'SELECT * FROM form_submissions WHERE id = ?',
          [result.lastInsertRowid]
        );

        return {
          success: true,
          data: insertedRecord.rows[0] as FormSubmission
        };
      }

      throw new Error('插入失败');
    } catch (error) {
      console.error('创建表单提交失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 获取所有表单提交
  static getAllFormSubmissions(page: number = 1, limit: number = 10): DatabaseResult<FormSubmission[]> {
    try {
      const offset = (page - 1) * limit;
      
      const result = query(
        `SELECT * FROM form_submissions 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
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
  static getFormSubmissionById(id: string): DatabaseResult<FormSubmission> {
    try {
      const result = queryOne(
        'SELECT * FROM form_submissions WHERE id = ?',
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

  // 更新表单提交
  static updateFormSubmission(id: string, data: UpdateFormSubmissionRequest): DatabaseResult<FormSubmission> {
    try {
      const { status, notes } = data;
      
      const result = execute(
        `UPDATE form_submissions 
         SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [status, notes, id]
      );

      if (result.changes === 0) {
        return {
          success: false,
          error: '表单提交不存在或未更新'
        };
      }

      // 获取更新后的记录
      const updatedRecord = queryOne(
        'SELECT * FROM form_submissions WHERE id = ?',
        [id]
      );

      return {
        success: true,
        data: updatedRecord.rows[0] as FormSubmission
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
  static deleteFormSubmission(id: string): DatabaseResult<boolean> {
    try {
      const result = execute(
        'DELETE FROM form_submissions WHERE id = ?',
        [id]
      );

      if (result.changes === 0) {
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
  static getFormSubmissionStats(): DatabaseResult<any> {
    try {
      const totalResult = queryOne('SELECT COUNT(*) as total FROM form_submissions');
      const statusResult = query(`
        SELECT status, COUNT(*) as count 
        FROM form_submissions 
        GROUP BY status
      `);

      const total = totalResult.rows[0]?.total || 0;
      const statusStats = statusResult.rows.reduce((acc: any, row: any) => {
        acc[row.status] = row.count;
        return acc;
      }, {});

      return {
        success: true,
        data: {
          total,
          statusStats,
          pending: statusStats.pending || 0,
          processing: statusStats.processing || 0,
          completed: statusStats.completed || 0,
          invalid: statusStats.invalid || 0
        }
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