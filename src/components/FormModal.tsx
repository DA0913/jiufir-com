import React, { useState } from 'react';
import { X, Send, Building, User, Phone, Factory, AlertCircle } from 'lucide-react';
import { submitForm } from '../lib/api';

interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface FormConfig {
  id: string;
  name: string;
  description?: string;
  form_url: string;
  form_config: {
    fields: FormField[];
    styling: {
      theme: string;
      primaryColor: string;
      borderRadius?: string;
    };
    behavior: {
      showProgress: boolean;
      autoSave: boolean;
      redirectAfterSubmit?: string;
    };
  };
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceUrl?: string;
  formConfig?: FormConfig;
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose, sourceUrl, formConfig }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    userName: '',
    phone: '',
    companyTypes: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // 默认的公司类型选项，如果没有提供formConfig
  const defaultCompanyTypeOptions = [
    { value: 'factory', label: '工厂' },
    { value: 'trader', label: '贸易商' },
    { value: 'integrated', label: '工贸一体' }
  ];

  // 根据formConfig动态生成表单字段
  const getFormFields = () => {
    if (!formConfig) {
      // 使用默认表单
      return (
        <>
          {/* 公司名称 */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <Building className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              公司名称 *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent transition-all text-sm sm:text-base ${
                errors.companyName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="请输入公司名称"
              disabled={isSubmitting}
            />
            {errors.companyName && (
              <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {errors.companyName}
              </p>
            )}
          </div>

          {/* 用户姓名 */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <User className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              用户姓名 *
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent transition-all text-sm sm:text-base ${
                errors.userName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="请输入您的姓名"
              disabled={isSubmitting}
            />
            {errors.userName && (
              <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {errors.userName}
              </p>
            )}
          </div>

          {/* 联系电话 */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              联系电话 *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent transition-all text-sm sm:text-base ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="请输入手机号码"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* 公司类型 */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <Factory className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              公司类型 * (可多选)
            </label>
            <div className="space-y-1.5 sm:space-y-2">
              {defaultCompanyTypeOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.companyTypes.includes(option.value)}
                    onChange={() => handleCompanyTypeChange(option.value)}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#194fe8] border-gray-300 rounded focus:ring-[#194fe8]"
                    disabled={isSubmitting}
                  />
                  <span className="text-xs sm:text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            {errors.companyTypes && (
              <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {errors.companyTypes}
              </p>
            )}
          </div>
        </>
      );
    }
    
    // 使用动态配置的表单
    return (
      <>
        {formConfig.form_config.fields.map((field, index) => (
          <div key={index}>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              {field.label} {field.required && '*'}
            </label>
            
            {field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'number' ? (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof typeof formData] || ''}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent transition-all text-sm sm:text-base ${
                  errors[field.name] ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={field.placeholder || `请输入${field.label}`}
                required={field.required}
                disabled={isSubmitting}
              />
            ) : field.type === 'textarea' ? (
              <textarea
                name={field.name}
                value={formData[field.name as keyof typeof formData] || ''}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent transition-all text-sm sm:text-base ${
                  errors[field.name] ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={field.placeholder || `请输入${field.label}`}
                required={field.required}
                disabled={isSubmitting}
                rows={4}
              />
            ) : field.type === 'select' ? (
              <select
                name={field.name}
                value={formData[field.name as keyof typeof formData] || ''}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[#194fe8] focus:border-transparent transition-all text-sm sm:text-base ${
                  errors[field.name] ? 'border-red-300' : 'border-gray-300'
                }`}
                required={field.required}
                disabled={isSubmitting}
              >
                <option value="">请选择{field.label}</option>
                {field.options?.map((option, i) => (
                  <option key={i} value={option}>{option}</option>
                ))}
              </select>
            ) : field.type === 'checkbox' || field.type === 'radio' ? (
              <div className="space-y-1.5 sm:space-y-2">
                {field.options?.map((option, i) => (
                  <label
                    key={i}
                    className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
                  >
                    <input
                      type={field.type}
                      name={field.name}
                      value={option}
                      checked={
                        field.type === 'checkbox'
                          ? (formData[field.name as keyof typeof formData] as string[])?.includes(option)
                          : formData[field.name as keyof typeof formData] === option
                      }
                      onChange={handleInputChange}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#194fe8] border-gray-300 ${
                        field.type === 'checkbox' ? 'rounded' : 'rounded-full'
                      } focus:ring-[#194fe8]`}
                      disabled={isSubmitting}
                    />
                    <span className="text-xs sm:text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            ) : null}
            
            {errors[field.name] && (
              <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}
      </>
    );
  };

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
    
    // 清除对应字段的错误
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
    setErrors({}); // 清除之前的错误

    try {
      await submitForm({
        company_name: formData.companyName,
        user_name: formData.userName,
        phone: formData.phone,
        company_types: formData.companyTypes,
        source_url: sourceUrl || window.location.href,
        status: 'pending'
      });

      console.log('Form submitted successfully');
      
      setSubmitSuccess(true);
      
      // 3秒后关闭模态框
      setTimeout(() => {
        onClose();
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

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // 延迟重置状态，避免闪烁
      setTimeout(() => {
        setFormData({
          companyName: '',
          userName: '',
          phone: '',
          companyTypes: []
        });
        setErrors({});
        setSubmitSuccess(false);
      }, 300);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* 背景遮罩 */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        />
        
        {/* 模态框内容 */}
        <div className="relative bg-white rounded-xl lg:rounded-2xl shadow-xl max-w-md w-full mx-4 transform transition-all">
          {/* 头部 */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#194fe8] rounded-lg flex items-center justify-center">
                <Building className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">
                  {formConfig?.name || '获取专业咨询'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">
                  {formConfig?.description || '填写信息，我们将尽快与您联系'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 p-1"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* 表单内容 */}
          <div className="p-4 sm:p-6">
            {submitSuccess ? (
              <div className="text-center py-6 sm:py-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Send className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  提交成功！
                </h4>
                <p className="text-sm sm:text-base text-gray-600">
                  感谢您的咨询，我们会尽快与您联系
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* 动态表单字段 */}
                {getFormFields()}

                {/* 提交错误 */}
                {errors.submit && (
                  <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs sm:text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {errors.submit}
                    </p>
                  </div>
                )}

                {/* 提交按钮 */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base ${
                    formConfig?.form_config?.styling?.primaryColor 
                      ? `bg-[${formConfig.form_config.styling.primaryColor}] hover:bg-[${formConfig.form_config.styling.primaryColor}] text-white`
                      : 'bg-[#194fe8] hover:bg-[#1640c7] text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>提交中...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>立即提交</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* 底部信息 */}
          {!submitSuccess && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <p className="text-xs text-gray-500 text-center">
                  {formConfig?.description || '我们承诺保护您的隐私信息，仅用于业务咨询联系'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormModal;