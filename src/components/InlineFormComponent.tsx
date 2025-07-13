import React, { useState } from 'react';
import { Building, User, Phone, Factory, Send, AlertCircle } from 'lucide-react';
import { submitForm } from '../lib/api';

const InlineFormComponent: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    userName: '',
    phone: '',
    companyTypes: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const companyTypeOptions = [
    { value: 'factory', label: '工厂' },
    { value: 'trader', label: '贸易商' },
    { value: 'integrated', label: '工贸一体' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = '请输入公司名称';
    }

    if (!formData.userName.trim()) {
      newErrors.userName = '请输入用户姓名';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '请输入联系电话';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入正确的手机号码';
    }

    if (formData.companyTypes.length === 0) {
      newErrors.companyTypes = '请选择公司类型';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCompanyTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      companyTypes: prev.companyTypes.includes(type)
        ? prev.companyTypes.filter(t => t !== type)
        : [...prev.companyTypes, type]
    }));
    
    if (errors.companyTypes) {
      setErrors(prev => ({
        ...prev,
        companyTypes: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await submitForm({
        company_name: formData.companyName,
        user_name: formData.userName,
        phone: formData.phone,
        company_types: formData.companyTypes,
        source_url: window.location.href,
        status: 'pending'
      });

      setSubmitSuccess(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          companyName: '',
          userName: '',
          phone: '',
          companyTypes: []
        });
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error?.message || '提交失败，请稍后重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-gray-200/50 max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            提交成功！
          </h3>
          <p className="text-gray-600">
            感谢您的咨询，我们会尽快与您联系
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-200/50 max-w-md w-full">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          获取专业咨询
        </h3>
        <p className="text-gray-600 text-xs">
          填写信息，我们将尽快与您联系
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* 公司名称 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            <Building className="w-3 h-3 inline mr-1" />
            公司名称 *
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent transition-all text-sm ${
              errors.companyName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="请输入公司名称"
            disabled={isSubmitting}
          />
          {errors.companyName && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.companyName}
            </p>
          )}
        </div>

        {/* 用户姓名 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            <User className="w-3 h-3 inline mr-1" />
            用户姓名 *
          </label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent transition-all text-sm ${
              errors.userName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="请输入您的姓名"
            disabled={isSubmitting}
          />
          {errors.userName && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.userName}
            </p>
          )}
        </div>

        {/* 联系电话 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            <Phone className="w-3 h-3 inline mr-1" />
            联系电话 *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent transition-all text-sm ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="请输入手机号码"
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.phone}
            </p>
          )}
        </div>

        {/* 公司类型 - 紧凑布局 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            <Factory className="w-3 h-3 inline mr-1" />
            公司类型 * (可多选)
          </label>
          <div className="flex flex-wrap gap-2">
            {companyTypeOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-1 cursor-pointer text-xs"
              >
                <input
                  type="checkbox"
                  checked={formData.companyTypes.includes(option.value)}
                  onChange={() => handleCompanyTypeChange(option.value)}
                  className="w-3 h-3 text-[#194fe8] border-gray-300 rounded focus:ring-[#194fe8]"
                  disabled={isSubmitting}
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.companyTypes && (
            <p className="mt-1 text-xs text-red-600 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.companyTypes}
            </p>
          )}
        </div>

        {/* 提交错误 */}
        {errors.submit && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.submit}
            </p>
          </div>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#194fe8] hover:bg-[#1640c7] text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>提交中...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>立即提交</span>
            </>
          )}
        </button>
      </form>

      {/* 底部信息 - 简化 */}
      <div className="mt-3">
        <p className="text-xs text-gray-500 text-center">
          我们承诺保护您的隐私信息
        </p>
      </div>
    </div>
  );
};

export default InlineFormComponent;