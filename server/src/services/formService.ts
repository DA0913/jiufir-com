import { run, get, all } from '../config/sqlite';
import { FormSubmission, CreateFormSubmissionRequest, UpdateFormSubmissionRequest, DatabaseResult } from '../types/index.js';

export class FormService {
  // 创建表单提交
  static async createFormSubmission(data: CreateFormSubmissionRequest): Promise<DatabaseResult<FormSubmission>> {
    try {
      const { company_name, user_name, phone, company_types, source_url } = data;
      
      const result = run(
        `INSERT INTO form_submissions (company_name, user_name, phone, company_types, source_url)
         VALUES (?, ?, ?, ?, ?)`,
        [company_name, user_name, phone, JSON.stringify(company_types), source_url]
      );

      // 获取插入的记录
      const insertedRecord = get<FormSubmission>(
        'SELECT * FROM form_submissions WHERE id = ?',
        [result.lastInsertRowid]
      );

      if (!insertedRecord) {
        return {
          success: false,
          error: '创建表单提交失败'
        };
      }

      // 解析 JSON 字段
      const formattedRecord = {
        ...insertedRecord,
        company_types: JSON.parse(insertedRecord.company_types as any)
      };

      return {
        success: true,
        data: formattedRecord
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
      
      const results = all<FormSubmission>(
        `SELECT * FROM form_submissions 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      // 解析 JSON 字段
      const formattedResults = results.map(record => ({
        ...record,
        company_types: JSON.parse(record.company_types as any)
      }));

      return {
        success: true,
        data: formattedResults
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
      const result = get<FormSubmission>(
        'SELECT * FROM form_submissions WHERE id = ?',
        [parseInt(id)]
      );

      if (!result) {
        return {
          success: false,
          error: '表单提交不存在'
        };
      }

      // 解析 JSON 字段
      const formattedResult = {
        ...result,
        company_types: JSON.parse(result.company_types as any)
      };

      return {
        success: true,
        data: formattedResult
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
        updateFields.push('status = ?');
        values.push(status);
      }

      if (notes !== undefined) {
        updateFields.push('notes = ?');
        values.push(notes);
      }

      if (updateFields.length === 0) {
        return {
          success: false,
          error: '没有提供更新字段'
        };
      }

      // 添加更新时间和ID
      updateFields.push('updated_at = datetime(\'now\')');
      values.push(parseInt(id));

      const result = run(
        `UPDATE form_submissions 
         SET ${updateFields.join(', ')}
         WHERE id = ?`,
        values
      );

      if (result.changes === 0) {
        return {
          success: false,
          error: '表单提交不存在'
        };
      }

      // 获取更新后的记录
      const updatedRecord = get<FormSubmission>(
        'SELECT * FROM form_submissions WHERE id = ?',
        [parseInt(id)]
      );

      if (!updatedRecord) {
        return {
          success: false,
          error: '获取更新后的记录失败'
        };
      }

      // 解析 JSON 字段
      const formattedRecord = {
        ...updatedRecord,
        company_types: JSON.parse(updatedRecord.company_types as any)
      };

      return {
        success: true,
        data: formattedRecord
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
      const result = run(
        'DELETE FROM form_submissions WHERE id = ?',
        [parseInt(id)]
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
  static async getFormSubmissionStats(): Promise<DatabaseResult<any>> {
    try {
      const result = get(`
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
        data: result
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