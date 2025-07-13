import React, { useState, useEffect } from 'react';
import { memo, useMemo, useCallback, Suspense } from 'react';
import { 
  Calendar, 
  Tag, 
  Search, 
  Filter, 
  Clock, 
  TrendingUp,
  BookOpen,
  Globe,
  Users,
  ArrowRight,
  Eye,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Phone,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ExternalLink,
  Star,
  Bookmark,
  Share2
} from 'lucide-react';
import { NewsArticle, getNewsArticles } from '../lib/api';
import NewsDetail from './NewsDetail';
import FormButton from './FormButton';

// 轮播Banner数据
const BANNER_SLIDES = [
  {
    id: 1,
    title: '久火ERP 2024重大功能更新',
    description: 'AI智能决策模块正式上线，为外贸企业提供更精准的市场预测和业务决策支持，助力企业数字化转型升级。',
    buttonText: '了解详情',
    buttonLink: '#',
    backgroundImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: '产品更新'
  },
  {
    id: 2,
    title: '全新供应链协同平台发布',
    description: '打通供应商、工厂、物流商信息壁垒，构建高效协同生态，实现供应链全链路数字化管理。',
    buttonText: '立即体验',
    buttonLink: '#',
    backgroundImage: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: '新功能'
  },
  {
    id: 3,
    title: '客户成功案例：业绩增长300%',
    description: '某知名制造企业通过久火ERP实现业务流程优化，订单处理效率提升60%，年度业绩增长300%。',
    buttonText: '查看案例',
    buttonLink: '#',
    backgroundImage: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: '成功案例'
  }
];

// 预定义的模拟数据，避免每次渲染重新创建
const MOCK_ARTICLES: NewsArticle[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: '久火ERP助力外贸企业数字化转型，订单处理效率提升60%',
    category: '公司新闻',
    publish_time: '2024-12-20 10:30:00',
    image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    summary: '久火ERP通过智能化管理系统，帮助众多外贸企业实现数字化转型，显著提升运营效率。系统集成了PDM产品管理、SRM供应链管理等12大核心模块。',
    views: 1250,
    is_featured: true,
    created_at: '2024-12-20T10:30:00Z',
    updated_at: '2024-12-20T10:30:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: '2024年外贸行业发展趋势分析：数字化成为核心竞争力',
    category: '行业动态',
    publish_time: '2024-12-19 14:20:00',
    image_url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
    summary: '深度解析2024年外贸行业发展趋势，数字化转型已成为企业提升竞争力的关键因素。AI技术在供应链管理中的应用日益广泛。',
    views: 980,
    is_featured: false,
    created_at: '2024-12-19T14:20:00Z',
    updated_at: '2024-12-19T14:20:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    title: '新版外贸政策解读：跨境电商迎来新机遇',
    category: '政策解读',
    publish_time: '2024-12-18 09:15:00',
    image_url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    summary: '详细解读最新外贸政策变化，为跨境电商企业带来的新机遇和挑战。政策优化为企业出海提供更多便利。',
    views: 756,
    is_featured: true,
    created_at: '2024-12-18T09:15:00Z',
    updated_at: '2024-12-18T09:15:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: '久火ERP新功能发布：AI智能决策模块正式上线',
    category: '公司新闻',
    publish_time: '2024-12-17 16:45:00',
    image_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
    summary: 'AI智能决策模块的上线，将为外贸企业提供更精准的市场预测和业务决策支持。基于大数据分析的智能推荐系统。',
    views: 1100,
    is_featured: false,
    created_at: '2024-12-17T16:45:00Z',
    updated_at: '2024-12-17T16:45:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    title: 'ERP系统选择指南：中小外贸企业如何选择合适的管理系统',
    category: '操作指南',
    publish_time: '2024-12-15 13:20:00',
    image_url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
    summary: '为中小外贸企业提供ERP系统选择的详细指南，帮助企业做出明智的决策。从功能需求到成本考量的全面分析。',
    views: 1350,
    is_featured: true,
    created_at: '2024-12-15T13:20:00Z',
    updated_at: '2024-12-15T13:20:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    title: '客户成功案例：某知名制造企业通过久火ERP实现业务增长300%',
    category: '新闻中心',
    publish_time: '2024-12-14 10:00:00',
    image_url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400',
    summary: '深度分析客户成功案例，展示久火ERP如何帮助企业实现显著的业务增长。从系统实施到效果呈现的完整过程。',
    views: 2100,
    is_featured: false,
    created_at: '2024-12-14T10:00:00Z',
    updated_at: '2024-12-14T10:00:00Z'
  }
];

// 预定义分类数据
const CATEGORIES = [
  { value: 'all', label: '全部资讯', count: 0 },
  { value: '公司新闻', label: '公司新闻', count: 0 },
  { value: '新闻中心', label: '新闻中心', count: 0 },
  { value: '行业动态', label: '行业动态', count: 0 },
  { value: '政策解读', label: '政策解读', count: 0 },
  { value: '市场分析', label: '市场分析', count: 0 },
  { value: '操作指南', label: '操作指南', count: 0 }
];

const TradeKnowledge = memo(() => {
  const [articles, setArticles] = useState<NewsArticle[]>(MOCK_ARTICLES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  
  // Banner轮播状态
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Banner轮播自动播放
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % BANNER_SLIDES.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // 优化的筛选函数
  const filteredArticles = useMemo(() => {
    let filtered = articles;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.summary?.toLowerCase().includes(searchLower)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    return filtered;
  }, [articles, searchTerm, selectedCategory]);

  // 优化的分类统计
  const categoryStats = useMemo(() => {
    return CATEGORIES.map(cat => ({
      ...cat,
      count: cat.value === 'all' ? articles.length : articles.filter(a => a.category === cat.value).length
    }));
  }, [articles]);

  // 优化的文章分组
  const { featuredArticles, regularArticles } = useMemo(() => {
    const featured = filteredArticles.filter(article => article.is_featured);
    const regular = filteredArticles.filter(article => !article.is_featured);
    return { featuredArticles: featured, regularArticles: regular };
  }, [filteredArticles]);

  // 优化的日期格式化
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }, []);

  const formatTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // 优化的文章点击处理
  const handleArticleClick = useCallback(async (article: NewsArticle) => {
    // 更新本地状态
    setArticles(prev => 
      prev.map(a => 
        a.id === article.id ? { ...a, views: a.views + 1 } : a
      )
    );
    
    setSelectedArticle(article);
  }, []);

  // 简化的相关文章点击处理
  const handleRelatedArticleClick = useCallback((relatedArticle: NewsArticle) => {
    setSelectedArticle(relatedArticle);
  }, []);

  // 优化的事件处理函数
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  const handleCategorySelect = useCallback((categoryValue: string) => {
    setSelectedCategory(categoryValue);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Banner导航函数
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % BANNER_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(prev => !prev);
  }, []);

  // 初始化数据
  useEffect(() => {
    setArticles(MOCK_ARTICLES);
  }, []);

  // 如果选择了文章，显示文章详情
  if (selectedArticle) {
    return (
      <NewsDetail 
        article={selectedArticle} 
        onBack={() => setSelectedArticle(null)}
        onArticleClick={handleRelatedArticleClick}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 w-full">
      {/* Banner区域 - 保持不变 */}
      <section className="relative min-h-[500px] flex items-center overflow-hidden py-16 w-full">
        <div className="absolute inset-0">
          <img
            src="/2dedee27edae73e00af82b262d86584e898c6085369e50-DvbSFE (1).jpg"
            alt="外贸智库背景"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm mb-6">
              <div className="w-2 h-2 bg-[#194fe8] rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">外贸智库</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              洞察行业趋势，赋能实战运营
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto mb-8">
              汇聚外贸政策解读、数字化转型指南、标杆案例分析，助力企业少走弯路
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <FormButton>
                免费试用30天
              </FormButton>
              <FormButton variant="outline">
                <Phone className="w-5 h-5" />
                <span>400-026-2606</span>
              </FormButton>
            </div>
          </div>
        </div>
      </section>

      {/* 产品更新轮播Banner */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gray-50 rounded-full border border-gray-200 mb-6">
              <div className="w-2 h-2 bg-[#194fe8] rounded-full mr-2"></div>
              <span className="text-sm font-medium text-gray-700">产品动态</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">最新产品更新</h2>
            <p className="text-lg text-gray-600">了解久火ERP最新功能和产品动态</p>
          </div>

          <div className="relative">
            {/* 轮播内容 */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              {BANNER_SLIDES.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={slide.backgroundImage}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
                  
                  <div className="absolute inset-0 flex items-center">
                    <div className="max-w-2xl mx-auto px-8 text-center text-white">
                      <div className="inline-block px-3 py-1 bg-[#194fe8] rounded-full text-sm font-medium mb-4">
                        {slide.category}
                      </div>
                      <h3 className="text-3xl font-bold mb-4">{slide.title}</h3>
                      <p className="text-lg mb-6 opacity-90">{slide.description}</p>
                      <button className="bg-white text-[#194fe8] hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors">
                        {slide.buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 导航按钮 */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>

            {/* 播放控制 */}
            <button
              onClick={toggleAutoPlay}
              className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
            >
              {isAutoPlaying ? (
                <Pause className="w-5 h-5 text-gray-600" />
              ) : (
                <Play className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* 指示器 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {BANNER_SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* 左侧边栏 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-24">
              {/* 搜索框 */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="搜索资讯..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent"
                  />
                </div>
              </div>

              {/* 分类筛选 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">资讯分类</h3>
                  <button
                    onClick={toggleFilters}
                    className="lg:hidden text-gray-500"
                  >
                    {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
                
                <div className={`space-y-2 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {categoryStats.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => handleCategorySelect(category.value)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                        selectedCategory === category.value
                          ? 'bg-[#194fe8] text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">{category.label}</span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        selectedCategory === category.value
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 热门标签 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">热门标签</h3>
                <div className="flex flex-wrap gap-2">
                  {['数字化转型', 'AI智能', '供应链管理', '跨境电商', '政策解读', '市场分析'].map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="lg:col-span-3">
            {/* 精选文章 */}
            {featuredArticles.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center space-x-2 mb-6">
                  <Star className="w-5 h-5 text-[#194fe8]" />
                  <h2 className="text-2xl font-bold text-gray-900">精选推荐</h2>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {featuredArticles.slice(0, 4).map((article) => (
                    <article
                      key={article.id}
                      className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#194fe8] hover:shadow-lg transition-all duration-300 group max-w-sm mx-auto"
                    >
                      {/* 文章封面图片 */}
                      {article.image_url && (
                        <div className="aspect-[16/10] overflow-hidden">
                          <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      )}
                      
                      <div className="p-5">
                        {/* 文章分类和时间 */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-block px-2 py-1 bg-[#194fe8] text-white text-xs font-medium rounded">
                            {article.category}
                          </span>
                          <div className="flex items-center text-gray-500 text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(article.publish_time)}
                          </div>
                        </div>
                        
                        {/* 标题 */}
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#194fe8] transition-colors line-clamp-2 leading-tight">
                          {article.title}
                        </h3>
                        
                        {/* 摘要 */}
                        {article.summary && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                            {article.summary}
                          </p>
                        )}
                        
                        {/* 阅读量和操作按钮 */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center text-gray-500 text-xs">
                              <Eye className="w-3 h-3 mr-1" />
                              {article.views} 次阅读
                          </div>
                          
                          <button 
                            onClick={() => handleArticleClick(article)}
                            className="bg-[#194fe8] hover:bg-[#1640c7] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                          >
                            阅读全文
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* 最新资讯 */}
            <Suspense fallback={
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-[#194fe8] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">正在加载最新资讯...</p>
              </div>
            }>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-[#194fe8]" />
                    <h2 className="text-2xl font-bold text-gray-900">最新资讯</h2>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    共 {filteredArticles.length} 篇文章
                  </div>
                </div>

                {/* 文章网格 */}
                <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {regularArticles.map((article) => (
                    <article
                      key={article.id}
                      className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#194fe8] hover:shadow-lg transition-all duration-300 group max-w-sm mx-auto"
                    >
                      {/* 封面图片 */}
                      {article.image_url && (
                        <div className="aspect-[16/10] overflow-hidden">
                          <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      )}
                      
                      <div className="p-5">
                        {/* 文章分类和时间 */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                            {article.category}
                          </span>
                          <div className="flex items-center text-gray-500 text-xs">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(article.publish_time)}
                          </div>
                        </div>
                        
                        {/* 标题 */}
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#194fe8] transition-colors line-clamp-2 leading-tight">
                          {article.title}
                        </h3>
                        
                        {/* 摘要 */}
                        {article.summary && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                            {article.summary}
                          </p>
                        )}
                        
                        {/* 阅读量和操作按钮 */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center text-gray-500 text-xs">
                              <Eye className="w-3 h-3 mr-1" />
                              {article.views} 次阅读
                          </div>
                          
                          <button 
                            onClick={() => handleArticleClick(article)}
                            className="bg-[#194fe8] hover:bg-[#1640c7] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                          >
                            阅读全文
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* 加载更多 */}
                {filteredArticles.length > 0 && (
                  <div className="text-center mt-12">
                    <button className="bg-[#194fe8] hover:bg-[#1640c7] text-white font-medium py-3 px-8 rounded-lg transition-colors">
                      加载更多资讯
                    </button>
                  </div>
                )}

                {/* 无结果提示 */}
                {filteredArticles.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">暂无相关资讯</h3>
                    <p className="text-gray-500">请尝试调整搜索条件或浏览其他分类</p>
                  </div>
                )}
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
});

TradeKnowledge.displayName = 'TradeKnowledge';

export default TradeKnowledge;