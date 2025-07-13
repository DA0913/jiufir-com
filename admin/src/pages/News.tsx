import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Switch,
  DatePicker,
  message,
  Popconfirm,
  Row,
  Col,
  Typography,
  Image
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  DownloadOutlined, 
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { newsApi } from '../api/newsApi';
import type { News } from '../api/newsApi';
import RichTextEditor from '../components/RichTextEditor';
import ImageUpload from '../components/ImageUpload';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Text } = Typography;

const News: React.FC = () => {
  const [data, setData] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    status: '',
    keyword: '',
  });

  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        status: filters.status,
        keyword: filters.keyword,
      };
      
      const response = await newsApi.getList(params);
      setData(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination: any) => {
    setPagination(prev => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };

  const handleAdd = () => {
    setEditingNews(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: News) => {
    setEditingNews(record);
    form.setFieldsValue({
      ...record,
      published_at: record.published_at ? dayjs(record.published_at) : undefined,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await newsApi.delete(id);
      message.success('删除成功');
      loadData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的项目');
      return;
    }

    try {
      await newsApi.batchDelete(selectedRowKeys as number[]);
      message.success('批量删除成功');
      setSelectedRowKeys([]);
      loadData();
    } catch (error) {
      message.error('批量删除失败');
    }
  };

  const handleBatchUpdateStatus = async (status: string) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要更新的项目');
      return;
    }

    try {
      await newsApi.batchUpdateStatus(selectedRowKeys as number[], status);
      message.success('批量更新成功');
      setSelectedRowKeys([]);
      loadData();
    } catch (error) {
      message.error('批量更新失败');
    }
  };

  const handleExport = async () => {
    try {
      const params = {
        status: filters.status,
        keyword: filters.keyword,
      };
      
      const blob = await newsApi.export(params);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `新闻数据_${dayjs().format('YYYY-MM-DD')}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const submitData = {
        ...values,
        published_at: values.published_at?.format('YYYY-MM-DD HH:mm:ss'),
      };

      if (editingNews) {
        await newsApi.update(editingNews.id, submitData);
        message.success('更新成功');
      } else {
        await newsApi.create(submitData);
        message.success('创建成功');
      }
      
      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error('提交失败:', error);
    }
  };

  const columns = [
    {
      title: '封面图',
      dataIndex: 'cover_image',
      key: 'cover_image',
      width: 80,
      render: (image: string) => 
        image ? (
          <Image
            src={image}
            alt="封面"
            width={60}
            height={40}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="w-15 h-10 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
            无图
          </div>
        ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published' ? '已发布' : '草稿'}
        </Tag>
      ),
    },
    {
      title: '置顶',
      dataIndex: 'is_top',
      key: 'is_top',
      width: 80,
      render: (isTop: boolean) => (
        <Tag color={isTop ? 'red' : 'default'}>
          {isTop ? '置顶' : '普通'}
        </Tag>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'published_at',
      key: 'published_at',
      width: 150,
      render: (text: string) => text ? dayjs(text).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: News) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这条新闻吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">新闻管理</h1>
        <p className="text-gray-600 mt-1">管理网站新闻内容</p>
      </div>

      {/* 筛选区域 */}
      <Card className="mb-6">
        <Form layout="inline" className="flex flex-wrap gap-4">
          <Form.Item label="状态">
            <Select
              placeholder="选择状态"
              style={{ width: 120 }}
              allowClear
              value={filters.status}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <Select.Option value="draft">草稿</Select.Option>
              <Select.Option value="published">已发布</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="关键词">
            <Input
              placeholder="搜索新闻标题"
              prefix={<SearchOutlined />}
              value={filters.keyword}
              onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              style={{ width: 200 }}
            />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" onClick={loadData}>
                搜索
              </Button>
              <Button onClick={() => setFilters({ status: '', keyword: '' })}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 操作按钮 */}
      <Card className="mb-6">
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                新增新闻
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                导出Excel
              </Button>
              {selectedRowKeys.length > 0 && (
                <>
                  <Button
                    icon={<CheckOutlined />}
                    onClick={() => handleBatchUpdateStatus('published')}
                  >
                    批量发布
                  </Button>
                  <Button
                    icon={<CloseOutlined />}
                    onClick={() => handleBatchUpdateStatus('draft')}
                  >
                    批量设为草稿
                  </Button>
                  <Popconfirm
                    title={`确定要删除选中的 ${selectedRowKeys.length} 条记录吗？`}
                    onConfirm={handleBatchDelete}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button danger icon={<DeleteOutlined />}>
                      批量删除
                    </Button>
                  </Popconfirm>
                </>
              )}
            </Space>
          </Col>
          <Col>
            <Text type="secondary">
              共 {pagination.total} 条记录
            </Text>
          </Col>
        </Row>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          onChange={handleTableChange}
          rowSelection={rowSelection}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingNews ? '编辑新闻' : '新增新闻'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={800}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="标题"
                rules={[{ required: true, message: '请输入标题' }]}
              >
                <Input placeholder="请输入新闻标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="author"
                label="作者"
                rules={[{ required: true, message: '请输入作者' }]}
              >
                <Input placeholder="请输入作者" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="summary"
            label="摘要"
            rules={[{ required: true, message: '请输入摘要' }]}
          >
            <TextArea
              rows={3}
              placeholder="请输入新闻摘要"
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cover_image"
                label="封面图片"
              >
                <ImageUpload />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="published_at"
                label="发布时间"
              >
                <DatePicker
                  showTime
                  placeholder="选择发布时间"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                initialValue="draft"
              >
                <Select>
                  <Select.Option value="draft">草稿</Select.Option>
                  <Select.Option value="published">发布</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="is_top"
                label="置顶"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <RichTextEditor />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default News; 