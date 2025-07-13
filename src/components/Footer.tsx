import React from 'react';
import { Zap, Mail, Phone, MapPin, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 主要内容区域 - 参考图片布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* 左侧公司信息 - 占2列 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo和公司名 */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="久火ERP Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold">久火ERP</span>
            </div>
            
            {/* 联系方式 */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#194fe8]" />
                <div>
                  <div className="text-sm text-gray-400">服务热线</div>
                  <div className="font-semibold">400-026-2606</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#194fe8]" />
                <div>
                  <div className="text-sm text-gray-400">邮箱</div>
                  <div>info@jiufire.com</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#194fe8] mt-1" />
                <div>
                  <div className="text-sm text-gray-400">地址</div>
                  <div className="text-sm">西安市高新区丈八一路1号</div>
                  <div className="text-sm">汇鑫中心B座2005室</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-[#194fe8]" />
                <div>
                  <div className="text-sm text-gray-400">官网</div>
                  <div>www.jiufire.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* 核心产品 */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">核心产品</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>PDM产品管理系统</li>
              <li>SRM智能供应链管理</li>
              <li>CRM客户营销管理</li>
              <li>OMS高效订单管理</li>
              <li>TMS物流管理系统</li>
              <li>WMS现代化仓储控制</li>
              <li>FMS精细财务管理</li>
            </ul>
          </div>

          {/* 服务支持 */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">服务支持</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>系统实施部署</li>
              <li>数据迁移服务</li>
              <li>业务分析反馈</li>
              <li>个性化定制</li>
              <li>技术培训服务</li>
              <li>7×24小时支持</li>
            </ul>
          </div>

          {/* 关注我们 - 参考图片的二维码布局 */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-6">关注我们</h3>
            <div className="flex space-x-8">
              {/* 微信公众号 */}
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center mb-3 border-2 border-gray-600 overflow-hidden">
                  <img 
                    src="/gongzhongah.jpg" 
                    alt="微信公众号二维码" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs text-gray-400">微信公众号</div>
                <div className="text-xs text-gray-300 font-medium">久火ERP</div>
              </div>
              
              {/* 抖音号 */}
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center mb-3 border-2 border-gray-600 overflow-hidden">
                  <img 
                    src="/douyin.png" 
                    alt="抖音号二维码" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs text-gray-400">抖音号</div>
                <div className="text-xs text-gray-300 font-medium">久火ERP官方</div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-sm text-center sm:text-left">
              © 2024 久火ERP. 保留所有权利. | 陕ICP备xxxxxxxx号
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                隐私政策
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                服务条款
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                网站地图
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;