import { query, queryOne, execute } from '../config/database.js';
import { NewsArticle, CreateNewsArticleRequest, UpdateNewsArticleRequest, DatabaseResult } from '../types/index.js';

export class NewsService {
  // 创建新闻文章
  static createNewsArticle(data: CreateNewsArticleRequest): DatabaseResult<NewsArticle> {
    try {
      const { title, category, publish_time, image_url, summary, content, is_featured } = data;
      
      const result = execute(
        `INSERT INTO news_articles (title, category, publish_time, image_url, summary, content, is_featured)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, category, publish_time, image_url, summary, content, is_featured ? 1 : 0]
      );

      if (result.lastInsertRowid) {
        // 获取刚插入的记录
        const insertedRecord = queryOne(
          'SELECT * FROM news_articles WHERE id = ?',
          [result.lastInsertRowid]
        );

        return {
          success: true,
          data: insertedRecord.rows[0] as NewsArticle
        };
      }

      throw new Error('插入失败');
    } catch (error) {
      console.error('创建新闻文章失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 获取所有新闻文章
  static getAllNewsArticles(page: number = 1, limit: number = 10, category?: string): DatabaseResult<NewsArticle[]> {
    try {
      const offset = (page - 1) * limit;
      let sql = `SELECT * FROM news_articles`;
      let params: any[] = [];

      if (category) {
        sql += ` WHERE category = ?`;
        params.push(category);
      }

      sql += ` ORDER BY publish_time DESC LIMIT ? OFFSET ?`;
      params.push(limit, offset);
      
      const result = query(sql, params);

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

  // 获取精选新闻
  static getFeaturedNews(limit: number = 5): DatabaseResult<NewsArticle[]> {
    try {
      const result = query(
        `SELECT * FROM news_articles 
         WHERE is_featured = 1 
         ORDER BY publish_time DESC 
         LIMIT ?`,
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
  static getNewsArticleById(id: string): DatabaseResult<NewsArticle> {
    try {
      const result = queryOne(
        'SELECT * FROM news_articles WHERE id = ?',
        [id]
      );

      if (result.rows.length === 0) {
        return {
          success: false,
          error: '新闻文章不存在'
        };
      }

      // 增加浏览量
      execute(
        'UPDATE news_articles SET views = views + 1 WHERE id = ?',
        [id]
      );

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

  // 更新新闻文章
  static updateNewsArticle(id: string, data: UpdateNewsArticleRequest): DatabaseResult<NewsArticle> {
    try {
      const { title, category, publish_time, image_url, summary, content, is_featured } = data;
      
      const result = execute(
        `UPDATE news_articles 
         SET title = ?, category = ?, publish_time = ?, image_url = ?, 
             summary = ?, content = ?, is_featured = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [title, category, publish_time, image_url, summary, content, is_featured ? 1 : 0, id]
      );

      if (result.changes === 0) {
        return {
          success: false,
          error: '新闻文章不存在或未更新'
        };
      }

      // 获取更新后的记录
      const updatedRecord = queryOne(
        'SELECT * FROM news_articles WHERE id = ?',
        [id]
      );

      return {
        success: true,
        data: updatedRecord.rows[0] as NewsArticle
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
  static deleteNewsArticle(id: string): DatabaseResult<boolean> {
    try {
      const result = execute(
        'DELETE FROM news_articles WHERE id = ?',
        [id]
      );

      if (result.changes === 0) {
        return {
          success: false,
          error: '新闻文章不存在'
        };
      }

      return {
        success: true,
        data: true
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
  static getNewsCategories(): DatabaseResult<string[]> {
    try {
      const result = query(
        'SELECT DISTINCT category FROM news_articles ORDER BY category'
      );

      return {
        success: true,
        data: result.rows.map((row: any) => row.category)
      };
    } catch (error) {
      console.error('获取新闻分类失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  // 获取新闻统计
  static getNewsStats(): DatabaseResult<any> {
    try {
      const totalResult = queryOne('SELECT COUNT(*) as total FROM news_articles');
      const featuredResult = queryOne('SELECT COUNT(*) as featured FROM news_articles WHERE is_featured = 1');
      const categoriesResult = query(`
        SELECT category, COUNT(*) as count 
        FROM news_articles 
        GROUP BY category
      `);

      const total = totalResult.rows[0]?.total || 0;
      const featured = featuredResult.rows[0]?.featured || 0;
      const categoryStats = categoriesResult.rows.reduce((acc: any, row: any) => {
        acc[row.category] = row.count;
        return acc;
      }, {});

      return {
        success: true,
        data: {
          total,
          featured,
          categoryStats
        }
      };
    } catch (error) {
      console.error('获取新闻统计失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }
} 