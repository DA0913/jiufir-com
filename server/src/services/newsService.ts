import { run, get, all } from '../config/sqlite';
import { NewsArticle, CreateNewsArticleRequest, DatabaseResult } from '../types/index.js';

export class NewsService {
  // 创建新闻文章
  static async createNewsArticle(data: CreateNewsArticleRequest): Promise<DatabaseResult<NewsArticle>> {
    try {
      const { title, category, publish_time, image_url, summary, content, is_featured } = data;
      
      const insertInfo = run(
        `INSERT INTO news_articles (title, category, publish_time, image_url, summary, content, is_featured)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, category, publish_time, image_url, summary, content, is_featured ? 1 : 0]
      );

      const newArticle = get<NewsArticle>('SELECT * FROM news_articles WHERE id = ?', [insertInfo.lastInsertRowid]);

      return {
        success: true,
        data: newArticle!
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
      
      const articles = all<NewsArticle>(
        `SELECT * FROM news_articles 
         ORDER BY publish_time DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      return {
        success: true,
        data: articles
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
      const featured = all<NewsArticle>(
        `SELECT * FROM news_articles 
         WHERE is_featured = 1 
         ORDER BY publish_time DESC 
         LIMIT ?`,
        [limit]
      );

      return {
        success: true,
        data: featured
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
      const article = get<NewsArticle>('SELECT * FROM news_articles WHERE id = ?', [id]);

      if (!article) {
        return {
          success: false,
          error: '新闻文章不存在'
        };
      }
      return {
        success: true,
        data: article
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
      
      const articles = all<NewsArticle>(
        `SELECT * FROM news_articles 
         WHERE category = ? 
         ORDER BY publish_time DESC 
         LIMIT ? OFFSET ?`,
        [category, limit, offset]
      );

      return {
        success: true,
        data: articles
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
      const updateInfo = run('UPDATE news_articles SET views = views + 1 WHERE id = ?', [id]);

      return {
        success: updateInfo.changes > 0,
        data: updateInfo.changes > 0
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
      const values: any[] = [];

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          updateFields.push(`${key} = ?`);
          // 布尔字段转 0/1
          if (key === 'is_featured') {
            values.push(value ? 1 : 0);
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

      // WHERE id = ?
      values.push(id);

      const stmt = run(
        `UPDATE news_articles 
         SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        values
      );

      if (stmt.changes === 0) {
        return {
          success: false,
          error: '新闻文章不存在'
        };
      }
      const updated = get<NewsArticle>('SELECT * FROM news_articles WHERE id = ?', [id]);

      return {
        success: true,
        data: updated!
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
      const delInfo = run('DELETE FROM news_articles WHERE id = ?', [id]);

      return {
        success: delInfo.changes > 0,
        data: delInfo.changes > 0
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
      const rows = all<{ category: string }>('SELECT DISTINCT category FROM news_articles ORDER BY category');
      const categories = rows.map(r => r.category);
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