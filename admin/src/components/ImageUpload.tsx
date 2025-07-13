import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import { uploadApi } from '../api/uploadApi';

const { Dragger } = Upload;

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  onRemove?: () => void;
  maxSize?: number; // MB
  accept?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  maxSize = 5,
  accept = 'image/*',
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      message.error(`文件大小不能超过 ${maxSize}MB`);
      return false;
    }

    setLoading(true);
    try {
      const response = await uploadApi.uploadImage(file);
      onChange?.(response.url);
      message.success('上传成功');
    } catch (error) {
      message.error('上传失败');
    } finally {
      setLoading(false);
    }
    return false; // 阻止默认上传行为
  };

  const handleRemove = () => {
    onRemove?.();
  };

  if (value) {
    return (
      <div className="relative inline-block">
        <img
          src={value}
          alt="预览"
          className="w-32 h-32 object-cover rounded-lg border border-gray-200"
        />
        {!disabled && (
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <DeleteOutlined size={14} />
          </button>
        )}
      </div>
    );
  }

  return (
    <Dragger
      name="file"
      multiple={false}
      accept={accept}
      beforeUpload={handleUpload}
      disabled={disabled || loading}
      showUploadList={false}
    >
      <div className="p-6">
        <InboxOutlined className="text-4xl text-gray-400 mb-4" />
        <p className="text-gray-600">
          {loading ? '上传中...' : '点击或拖拽图片到此区域上传'}
        </p>
        <p className="text-gray-400 text-sm mt-2">
          支持 JPG、PNG、GIF 格式，文件大小不超过 {maxSize}MB
        </p>
      </div>
    </Dragger>
  );
};

export default ImageUpload; 