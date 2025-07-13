import { run, get, all } from '../config/sqlite.js';
import { NewsArticle, CreateNewsArticleRequest, DatabaseResult } from '../types/index.js';

export class NewsService {
  // 创建新闻文章
  static async createNewsArticle(data: CreateNewsArticleRequest): Promise<DatabaseResult<NewsArticle>> {
    try {
      const { title, category, publish_time, image_url, summary, content, is_featured } = data;

      const insert = run(
        `INSERT INTO news_articles (title, category, publish_time, image_url, summary, content, is_featured)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, category, publish_time, image_url, summary, content, is_featured ? 1 : 0]
      );

      const inserted = get<NewsArticle>('SELECT * FROM news_articles WHERE id = ?', [insert.lastInsertRowid]);

      return Promise.resolve({
        success: true,
        data: inserted as NewsArticle
      });
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
      const rows = all<NewsArticle>(
        `SELECT * FROM news_articles ORDER BY publish_time DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      return Promise.resolve({
        success: true,
        data: rows
      });
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
      const rows = all<NewsArticle>(
        `SELECT * FROM news_articles WHERE is_featured = 1 ORDER BY publish_time DESC LIMIT ?`,
        [limit]
      );

      return Promise.resolve({
        success: true,
        data: rows
      });
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
      const row = get<NewsArticle>('SELECT * FROM news_articles WHERE id = ?', [id]);

      if (!row) {
        return {
          success: false,
          error: '新闻文章不存在'
        };
      }

      return {
        success: true,
        data: row
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

      const rows = all<NewsArticle>(
        `SELECT * FROM news_articles WHERE category = ? ORDER BY publish_time DESC LIMIT ? OFFSET ?`,
        [category, limit, offset]
      );

      return Promise.resolve({
        success: true,
        data: rows
      });
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
      const update = run('UPDATE news_articles SET views = views + 1 WHERE id = ?', [id]);

      return Promise.resolve({
        success: update.changes > 0,
        data: update.changes > 0
      });
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
      const values: any[] = [];

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          updateFields.push(`${key} = ?`);
          // 布尔转整数
          if (key === 'is_featured') {
            values.push((value as any) ? 1 : 0);
          } else {
            values.push(value);
          }
        }
      });

      if (updateFields.length === 0) {
        return {
          success: false,
          error: '没有提供更新字段'
        };
      }

      const sql = `UPDATE news_articles SET ${updateFields.join(', ')}, updated_at = datetime('now') WHERE id = ?`;
      run(sql, [...values, id]);

      const updated = get<NewsArticle>('SELECT * FROM news_articles WHERE id = ?', [id]);

      if (!updated) {
        return {
          success: false,
          error: '新闻文章不存在'
        };
      }

      return Promise.resolve({
        success: true,
        data: updated
      });
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
      const del = run('DELETE FROM news_articles WHERE id = ?', [id]);

      return Promise.resolve({
        success: del.changes > 0,
        data: del.changes > 0
      });
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
      const rows = all<{ category: string }>('SELECT DISTINCT category FROM news_articles ORDER BY category');
      const categories = rows.map(r => r.category);

      return Promise.resolve({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('获取新闻分类失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }
} 