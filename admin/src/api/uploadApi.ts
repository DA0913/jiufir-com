import request from './request';

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mime_type: string;
}

export const uploadApi = {
  // 上传图片
  uploadImage: (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');
    
    return request.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 上传文件
  uploadFile: (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return request.post('/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 删除文件
  deleteFile: (filename: string): Promise<void> => {
    return request.delete(`/upload/file/${filename}`);
  },
}; 