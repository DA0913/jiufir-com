import React, { useState, useEffect } from 'react';
import { Card, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { uploadApi } from '../api/uploadApi';

interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = '请输入内容...',
  height = 300,
  disabled = false,
}) => {
  const [content, setContent] = useState(value);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onChange?.(newContent);
  };

  const handleImageUpload = async (file: File) => {
    try {
      const response = await uploadApi.uploadImage(file);
      const imageUrl = response.url;
      const imageTag = `\n![图片](${imageUrl})\n`;
      
      const newContent = content + imageTag;
      setContent(newContent);
      onChange?.(newContent);
      message.success('图片插入成功');
    } catch (error) {
      message.error('图片上传失败');
    }
    return false;
  };

  return (
    <Card className="rich-text-editor">
      <div className="mb-4 flex gap-2">
        <Upload
          name="file"
          accept="image/*"
          beforeUpload={handleImageUpload}
          showUploadList={false}
          disabled={disabled}
        >
          <button
            type="button"
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
          >
            <PlusOutlined className="mr-1" />
            插入图片
          </button>
        </Upload>
      </div>
      
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{ height }}
        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
      />
      
      <div className="mt-2 text-sm text-gray-500">
        支持 Markdown 格式，可使用 **粗体**、*斜体*、[链接](url)、![图片](url) 等语法
      </div>
    </Card>
  );
};

export default RichTextEditor; 