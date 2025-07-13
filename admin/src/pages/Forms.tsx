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
  DatePicker, 
  Select, 
  message,
  Popconfirm,
  Row,
  Col,
  Typography
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  DownloadOutlined, 
  DeleteOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { formApi } from '../api/formApi';
import type { FormSubmission } from '../api/formApi';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Text } = Typography;

const Forms: React.FC = () => {
  const [data, setData] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentForm, setCurrentForm] = useState<FormSubmission | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    keyword: '',
    dateRange: [] as any,
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
        startDate: filters.dateRange[0]?.format('YYYY-MM-DD'),
        endDate: filters.dateRange[1]?.format('YYYY-MM-DD'),
      };
      
      const response = await formApi.getList(params);
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

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await formApi.updateStatus(id, status);
      message.success('状态更新成功');
      loadData();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await formApi.delete(id);
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
      await formApi.batchDelete(selectedRowKeys as number[]);
      message.success('批量删除成功');
      setSelectedRowKeys([]);
      loadData();
    } catch (error) {
      message.error('批量删除失败');
    }
  };

  const handleExport = async () => {
    try {
      const params = {
        status: filters.status,
        keyword: filters.keyword,
        startDate: filters.dateRange[0]?.format('YYYY-MM-DD'),
        endDate: filters.dateRange[1]?.format('YYYY-MM-DD'),
      };
      
      const blob = await formApi.export(params);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `表单数据_${dayjs().format('YYYY-MM-DD')}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
    }
  };

  const showDetail = (record: FormSubmission) => {
    setCurrentForm(record);
    setDetailVisible(true);
  };

  const columns = [
    {
      title: '提交时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
      sorter: true,
    },
    {
      title: '表单名称',
      dataIndex: 'form_name',
      key: 'form_name',
    },
    {
      title: '提交人',
      dataIndex: 'submitter_name',
      key: 'submitter_name',
    },
    {
      title: '公司名称',
      dataIndex: 'company_name',
      key: 'company_name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: FormSubmission) => (
        <Space>
          <Tag color={status === 'replied' ? 'green' : 'orange'}>
            {status === 'replied' ? '已回复' : '未处理'}
          </Tag>
          {status === 'pending' && (
            <Button
              type="link"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleStatusChange(record.id, 'replied')}
            >
              标记已回复
            </Button>
          )}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: FormSubmission) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showDetail(record)}
          >
            查看详情
          </Button>
          <Popconfirm
            title="确定要删除这条记录吗？"
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
        <h1 className="text-2xl font-bold text-gray-800">表单管理</h1>
        <p className="text-gray-600 mt-1">管理用户提交的表单信息</p>
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
              <Select.Option value="pending">未处理</Select.Option>
              <Select.Option value="replied">已回复</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="提交时间">
            <RangePicker
              value={filters.dateRange}
              onChange={(dates) => setFilters(prev => ({ ...prev, dateRange: dates || [] }))}
            />
          </Form.Item>
          
          <Form.Item label="关键词">
            <Input
              placeholder="搜索表单内容"
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
              <Button onClick={() => setFilters({ status: '', keyword: '', dateRange: [] })}>
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
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                导出Excel
              </Button>
              {selectedRowKeys.length > 0 && (
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
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title="表单详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {currentForm && (
          <div className="space-y-4">
            <Row>
              <Col span={8}><Text strong>表单名称：</Text></Col>
              <Col span={16}>{currentForm.form_name}</Col>
            </Row>
            <Row>
              <Col span={8}><Text strong>提交人：</Text></Col>
              <Col span={16}>{currentForm.submitter_name}</Col>
            </Row>
            <Row>
              <Col span={8}><Text strong>邮箱：</Text></Col>
              <Col span={16}>{currentForm.submitter_email}</Col>
            </Row>
            <Row>
              <Col span={8}><Text strong>电话：</Text></Col>
              <Col span={16}>{currentForm.submitter_phone}</Col>
            </Row>
            <Row>
              <Col span={8}><Text strong>公司名称：</Text></Col>
              <Col span={16}>{currentForm.company_name}</Col>
            </Row>
            <Row>
              <Col span={8}><Text strong>状态：</Text></Col>
              <Col span={16}>
                <Tag color={currentForm.status === 'replied' ? 'green' : 'orange'}>
                  {currentForm.status === 'replied' ? '已回复' : '未处理'}
                </Tag>
              </Col>
            </Row>
            <Row>
              <Col span={8}><Text strong>提交时间：</Text></Col>
              <Col span={16}>{dayjs(currentForm.created_at).format('YYYY-MM-DD HH:mm:ss')}</Col>
            </Row>
            <Row>
              <Col span={24}>
                <Text strong>留言内容：</Text>
                <div className="mt-2 p-3 bg-gray-50 rounded">
                  {currentForm.message}
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Forms; 