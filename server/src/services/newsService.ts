import { query } from '../config/database.js';
import { NewsArticle, CreateNewsArticleRequest, DatabaseResult } from '../types/index.js';

export class NewsService {
  // 创建新闻文章
  static async createNewsArticle(data: CreateNewsArticleRequest): Promise<DatabaseResult<NewsArticle>> {
    try {
      const { title, category, publish_time, image_url, summary, content, is_featured } = data;
      
      const result = await query(
        `INSERT INTO news_articles (title, category, publish_time, image_url, summary, content, is_featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [title, category, publish_time, image_url, summary, content, is_featured || false]
      );

      return {
        success: true,
        data: result.rows[0] as NewsArticle
      };
    } catch (error) {
      console.error('创建新闻文章失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 获取所有新闻文章
  static async getAllNewsArticles(page: number = 1, limit: number = 10): Promise<DatabaseResult<NewsArticle[]>> {
    try {
      const offset = (page - 1) * limit;
      
      const result = await query(
        `SELECT * FROM news_articles 
         ORDER BY publish_time DESC 
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      return {
        success: true,
        data: result.rows as NewsArticle[]
      };
    } catch (error) {
      console.error('获取新闻文章失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 获取精选新闻文章
  static async getFeaturedNewsArticles(limit: number = 5): Promise<DatabaseResult<NewsArticle[]>> {
    try {
      const result = await query(
        `SELECT * FROM news_articles 
         WHERE is_featured = true 
         ORDER BY publish_time DESC 
         LIMIT $1`,
        [limit]
      );

      return {
        success: true,
        data: result.rows as NewsArticle[]
      };
    } catch (error) {
      console.error('获取精选新闻失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 根据ID获取新闻文章
  static async getNewsArticleById(id: string): Promise<DatabaseResult<NewsArticle>> {
    try {
      const result = await query(
        'SELECT * FROM news_articles WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return {
          success: false,
          error: '新闻文章不存在'
        };
      }

      return {
        success: true,
        data: result.rows[0] as NewsArticle
      };
    } catch (error) {
      console.error('获取新闻文章失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 根据分类获取新闻文章
  static async getNewsArticlesByCategory(category: string, page: number = 1, limit: number = 10): Promise<DatabaseResult<NewsArticle[]>> {
    try {
      const offset = (page - 1) * limit;
      
      const result = await query(
        `SELECT * FROM news_articles 
         WHERE category = $1 
         ORDER BY publish_time DESC 
         LIMIT $2 OFFSET $3`,
        [category, limit, offset]
      );

      return {
        success: true,
        data: result.rows as NewsArticle[]
      };
    } catch (error) {
      console.error('获取分类新闻失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 增加文章浏览量
  static async incrementViews(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const result = await query(
        'UPDATE news_articles SET views = views + 1 WHERE id = $1',
        [id]
      );

      return {
        success: result.rowCount > 0,
        data: result.rowCount > 0
      };
    } catch (error) {
      console.error('增加浏览量失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 更新新闻文章
  static async updateNewsArticle(id: string, data: Partial<CreateNewsArticleRequest>): Promise<DatabaseResult<NewsArticle>> {
    try {
      const updateFields: string[] = [];
      const values: any[] = [id];
      let paramIndex = 2;

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          updateFields.push(`${key} = $${paramIndex++}`);
          values.push(value);
        }
      });

      if (updateFields.length === 0) {
        return {
          success: false,
          error: '没有提供更新字段'
        };
      }

      const result = await query(
        `UPDATE news_articles 
         SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return {
          success: false,
          error: '新闻文章不存在'
        };
      }

      return {
        success: true,
        data: result.rows[0] as NewsArticle
      };
    } catch (error) {
      console.error('更新新闻文章失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 删除新闻文章
  static async deleteNewsArticle(id: string): Promise<DatabaseResult<boolean>> {
    try {
      const result = await query(
        'DELETE FROM news_articles WHERE id = $1',
        [id]
      );

      return {
        success: result.rowCount > 0,
        data: result.rowCount > 0
      };
    } catch (error) {
      console.error('删除新闻文章失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 获取新闻分类列表
  static async getNewsCategories(): Promise<DatabaseResult<string[]>> {
    try {
      const result = await query(
        'SELECT DISTINCT category FROM news_articles ORDER BY category'
      );

      const categories = result.rows.map(row => row.category);
      return {
        success: true,
        data: categories
      };
    } catch (error) {
      console.error('获取新闻分类失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }
} 