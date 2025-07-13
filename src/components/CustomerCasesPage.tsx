import React, { useState, useEffect } from 'react';
import { 
  Building, 
  TrendingUp, 
  Award, 
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Target,
  Globe,
  Star,
  Eye,
  ChevronLeft,
  ChevronRight,
  Play,
  Calendar,
  MapPin,
  Phone
} from 'lucide-react';
import FormButton from './FormButton';

// Customer case data structure
interface CustomerCase {
  id: string;
  brandName: string;
  brandLogo: string;
  sceneImage: string;
  caseTitle: string;
  businessSummary: string;
  category: string;
  industry: string;
  results: string[];
  metrics: {
    label: string;
    value: string;
    improvement: string;
  }[];
  location?: string;
  implementationTime?: string;
  featured?: boolean;
}

const CustomerCasesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Featured cooperation banner data
  const cooperationBanner = {
    productImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200',
    brandName: '久火ERP',
    businessDescription: '专业的外贸企业数字化解决方案服务商，致力于为全球贸易企业提供一体化管理平台，助力企业实现数字化转型和业务增长。',
    partnerCount: '500+',
    successRate: '98%',
    coverageArea: '全球50+国家'
  };

  // Customer cases data
  const customerCases: CustomerCase[] = [
    {
      id: '1',
      brandName: '瑞丰建材集团',
      brandLogo: '/taishan.png',
      sceneImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      caseTitle: '建材行业数字化转型标杆案例',
      businessSummary: '瑞丰建材通过久火ERP系统实现了从传统建材贸易向数字化智能制造的全面转型，打通了采购、生产、销售全链条。',
      category: 'Manufacturing',
      industry: '建材制造',
      results: [
        '订单处理效率提升60%',
        '库存周转率提高40%',
        '客户满意度达到95%',
        '运营成本降低25%'
      ],
      metrics: [
        { label: '年销售额增长', value: '300%', improvement: '+300%' },
        { label: '库存周转率', value: '12次/年', improvement: '+40%' },
        { label: '订单处理时间', value: '2小时', improvement: '-60%' }
      ],
      location: '浙江杭州',
      implementationTime: '2023年3月',
      featured: true
    },
    {
      id: '2',
      brandName: '华为技术有限公司',
      brandLogo: '/lixuj.png',
      sceneImage: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
      caseTitle: '全球供应链协同管理解决方案',
      businessSummary: '华为通过久火ERP构建了覆盖全球的供应链协同网络，实现了多地区、多供应商的统一管理和实时协调。',
      category: 'Technology',
      industry: '通信设备',
      results: [
        '供应链响应速度提升50%',
        '全球库存优化30%',
        '供应商协同效率提升65%',
        '质量管控精度提升80%'
      ],
      metrics: [
        { label: '供应链效率', value: '提升50%', improvement: '+50%' },
        { label: '库存优化', value: '30%', improvement: '+30%' },
        { label: '协同效率', value: '65%', improvement: '+65%' }
      ],
      location: '广东深圳',
      implementationTime: '2023年1月',
      featured: true
    },
    {
      id: '3',
      brandName: '比亚迪股份',
      brandLogo: '/yixin.png',
      sceneImage: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      caseTitle: '新能源汽车产业链数字化管理',
      businessSummary: '比亚迪利用久火ERP打造了新能源汽车全产业链的数字化管理体系，从电池生产到整车制造实现全程可视化。',
      category: 'Auto & Motorcycle',
      industry: '新能源汽车',
      results: [
        '生产效率提升45%',
        '质量追溯精度100%',
        '供应链成本降低20%',
        '产品上市周期缩短30%'
      ],
      metrics: [
        { label: '生产效率', value: '45%', improvement: '+45%' },
        { label: '成本降低', value: '20%', improvement: '-20%' },
        { label: '上市周期', value: '缩短30%', improvement: '-30%' }
      ],
      location: '广东深圳',
      implementationTime: '2023年6月'
    },
    {
      id: '4',
      brandName: '海康威视',
      brandLogo: '/shixinw.png',
      sceneImage: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      caseTitle: '安防设备全球化运营管理',
      businessSummary: '海康威视通过久火ERP建立了覆盖全球的安防设备运营管理体系，实现了从研发到服务的全链条数字化。',
      category: 'Technology',
      industry: '安防设备',
      results: [
        '全球订单统一管理',
        '客户服务响应提升70%',
        '产品交付周期缩短40%',
        '运营成本优化35%'
      ],
      metrics: [
        { label: '服务响应', value: '70%', improvement: '+70%' },
        { label: '交付周期', value: '40%', improvement: '-40%' },
        { label: '成本优化', value: '35%', improvement: '-35%' }
      ],
      location: '浙江杭州',
      implementationTime: '2023年4月'
    },
    {
      id: '5',
      brandName: '大疆创新',
      brandLogo: '/taishan.png',
      sceneImage: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=800',
      caseTitle: '无人机产业智能制造升级',
      businessSummary: '大疆创新采用久火ERP实现了无人机产业的智能制造升级，从零部件管理到成品交付全程数字化控制。',
      category: 'Technology',
      industry: '无人机制造',
      results: [
        '制造精度提升90%',
        '产品质量稳定性提升85%',
        '生产周期缩短50%',
        '客户满意度达到98%'
      ],
      metrics: [
        { label: '制造精度', value: '90%', improvement: '+90%' },
        { label: '质量稳定性', value: '85%', improvement: '+85%' },
        { label: '生产周期', value: '50%', improvement: '-50%' }
      ],
      location: '广东深圳',
      implementationTime: '2023年8月'
    },
    {
      id: '6',
      brandName: '立讯精密',
      brandLogo: '/lixuj.png',
      sceneImage: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
      caseTitle: '精密制造业数字化工厂建设',
      businessSummary: '立讯精密通过久火ERP构建了数字化工厂管理体系，实现了精密制造全流程的智能化控制和优化。',
      category: 'Manufacturing',
      industry: '精密制造',
      results: [
        '生产自动化率提升80%',
        '产品合格率达到99.8%',
        '设备利用率提升60%',
        '能耗降低30%'
      ],
      metrics: [
        { label: '自动化率', value: '80%', improvement: '+80%' },
        { label: '合格率', value: '99.8%', improvement: '+5%' },
        { label: '设备利用率', value: '60%', improvement: '+60%' }
      ],
      location: '江苏昆山',
      implementationTime: '2023年5月'
    }
  ];

  // Category filter options
  const categories = [
    { value: 'all', label: '全部案例', count: customerCases.length },
    { value: 'Manufacturing', label: '制造业', count: customerCases.filter(c => c.category === 'Manufacturing').length },
    { value: 'Technology', label: '科技行业', count: customerCases.filter(c => c.category === 'Technology').length },
    { value: 'Auto & Motorcycle', label: '汽车制造', count: customerCases.filter(c => c.category === 'Auto & Motorcycle').length }
  ];

  // Filter cases based on selected category
  const filteredCases = selectedCategory === 'all' 
    ? customerCases 
    : customerCases.filter(case_ => case_.category === selectedCategory);

  // Featured cases for carousel
  const featuredCases = customerCases.filter(case_ => case_.featured);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredCases.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredCases.length) % featuredCases.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white pt-16 w-full">
      {/* Hero Section with Cooperation Banner - 与关于我们页面风格一致 */}
      <section className="relative min-h-[500px] flex items-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden py-16 w-full">
        {/* 背景装饰元素 - 与关于我们页面一致 */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-teal-200/20 to-blue-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-gradient-to-br from-indigo-200/15 to-blue-200/15 rounded-full blur-xl animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-lg animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
          
          <div className="absolute top-1/4 right-1/3 w-16 h-16 bg-gradient-to-br from-blue-300/25 to-indigo-300/25 rounded-full blur-sm animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-gradient-to-br from-teal-300/25 to-cyan-300/25 rounded-full blur-sm animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full border border-gray-200/50 shadow-lg">
                <div className="w-2 h-2 bg-[#194fe8] rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">合作客户案例</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                携手行业领军企业
                <br />
                <span className="text-blue-600">共创数字化未来</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                {cooperationBanner.businessDescription}
              </p>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#194fe8] mb-2">{cooperationBanner.partnerCount}</div>
                  <div className="text-gray-600 text-sm">合作伙伴</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#194fe8] mb-2">{cooperationBanner.successRate}</div>
                  <div className="text-gray-600 text-sm">成功率</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#194fe8] mb-2">{cooperationBanner.coverageArea}</div>
                  <div className="text-gray-600 text-sm">服务覆盖</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <FormButton className="bg-[#194fe8] text-white hover:bg-[#1640c7]">
                  <Users className="w-5 h-5 mr-2" />
                  成为合作伙伴
                </FormButton>
                <FormButton variant="outline" className="border-gray-300 text-gray-700 hover:border-[#194fe8] hover:text-[#194fe8]">
                  <Play className="w-5 h-5 mr-2" />
                  观看案例视频
                </FormButton>
              </div>
            </div>

            {/* Right Content - Product Scene */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={cooperationBanner.productImage}
                  alt="久火ERP产品场景"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{cooperationBanner.brandName}</h3>
                  <p className="text-white/90">全球领先的外贸ERP解决方案</p>
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">85%</div>
                    <div className="text-gray-600 text-sm">平均效率提升</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cases Carousel */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gray-50 rounded-full border border-gray-200 mb-6">
              <div className="w-2 h-2 bg-[#194fe8] rounded-full mr-2"></div>
              <span className="text-sm font-medium text-gray-700">精选案例</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">精选成功案例</h2>
            <p className="text-lg text-gray-600">来自不同行业的数字化转型标杆企业</p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredCases.map((case_, index) => (
                  <div key={case_.id} className="w-full flex-shrink-0">
                    <div className="grid lg:grid-cols-2 gap-8 bg-gradient-to-r from-gray-50 to-white p-8">
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                          <img
                            src={case_.brandLogo}
                            alt={case_.brandName}
                            className="w-16 h-16 object-contain rounded-lg bg-white p-2 shadow-sm"
                          />
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">{case_.brandName}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {case_.location}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {case_.implementationTime}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-3">{case_.caseTitle}</h4>
                          <p className="text-gray-600 leading-relaxed">{case_.businessSummary}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          {case_.metrics.map((metric, idx) => (
                            <div key={idx} className="text-center p-4 bg-white rounded-lg shadow-sm">
                              <div className="text-2xl font-bold text-[#194fe8] mb-1">{metric.value}</div>
                              <div className="text-xs text-gray-600">{metric.label}</div>
                              <div className="text-xs text-green-600 font-medium">{metric.improvement}</div>
                            </div>
                          ))}
                        </div>

                        <button className="bg-[#194fe8] hover:bg-[#1640c7] text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center">
                          查看详细案例
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                      </div>

                      <div className="relative">
                        <img
                          src={case_.sceneImage}
                          alt={case_.caseTitle}
                          className="w-full h-80 object-cover rounded-xl shadow-lg"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                          {case_.industry}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>

            {/* Carousel Indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {featuredCases.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-[#194fe8]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-[#194fe8] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } shadow-sm`}
              >
                {category.label}
                <span className="ml-2 text-sm opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Cases Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">客户成功案例</h2>
            <p className="text-lg text-gray-600">
              展示 {filteredCases.length} 个{selectedCategory === 'all' ? '全部' : categories.find(c => c.value === selectedCategory)?.label}案例
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCases.map((case_) => (
              <div
                key={case_.id}
                className="bg-white rounded-xl border border-gray-200 hover:border-[#194fe8] hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* Case Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={case_.sceneImage}
                    alt={case_.caseTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    {case_.industry}
                  </div>
                  <div className="absolute top-4 right-4 bg-[#194fe8] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {case_.category}
                  </div>
                </div>

                {/* Case Content */}
                <div className="p-6">
                  {/* Brand Header */}
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={case_.brandLogo}
                      alt={case_.brandName}
                      className="w-12 h-12 object-contain rounded-lg bg-gray-50 p-2"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{case_.brandName}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{case_.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Case Title */}
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {case_.caseTitle}
                  </h4>

                  {/* Business Summary */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {case_.businessSummary}
                  </p>

                  {/* Key Results */}
                  <div className="space-y-2 mb-6">
                    {case_.results.slice(0, 2).map((result, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{result}</span>
                      </div>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {case_.metrics.slice(0, 2).map((metric, index) => (
                      <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-[#194fe8]">{metric.value}</div>
                        <div className="text-xs text-gray-600">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* View Details Button */}
                  <button className="w-full bg-[#194fe8] hover:bg-[#1640c7] text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center group">
                    <Eye className="w-4 h-4 mr-2" />
                    查看详情
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors">
              加载更多案例
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section - 与关于我们页面风格一致 */}
      <section className="bg-[#194fe8] py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            准备开始您的数字化转型之旅？
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            联系我们的专家团队，获取专属的解决方案建议
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <FormButton className="bg-white text-[#194fe8] hover:bg-gray-100">
              <Users className="w-5 h-5 mr-2" />
              预约专家咨询
            </FormButton>
            <FormButton variant="outline" className="border-white text-white hover:bg-white hover:text-[#194fe8]">
              <Eye className="w-5 h-5 mr-2" />
              查看产品演示
            </FormButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerCasesPage;