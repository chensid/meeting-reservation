import { BookingQuery, getBookingList } from "@/api/endpoints/bookingApi";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  TableProps,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const BookingList: React.FC = () => {
  const [form] = Form.useForm();
  const [queryParams, setQueryParams] = useState<BookingQuery>();

  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    limit: 10,
  });

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["meeting-rooms", queryParams, paginationParams],
    queryFn: () => getBookingList({ ...queryParams, ...paginationParams }),
    enabled: false,
  });
  useEffect(() => {
    refetch();
  }, [queryParams, paginationParams, refetch]);

  const columns: TableProps["columns"] = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "预定人",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "会议室名称",
      dataIndex: "room",
      key: "room",
    },
    {
      title: "开始时间",
      dataIndex: "startTime",
      key: "startTime",
      render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "结束时间",
      dataIndex: "endTime",
      key: "endTime",
      render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "审批状态",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "备注",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "操作",
      dataIndex: "action",
      render: () => (
        <Space>
          <a>审批</a>
          <a>拒绝</a>
          <a>取消</a>
        </Space>
      ),
    },
  ];

  const handleChange: TableProps["onChange"] = (pagination) => {
    setPaginationParams({
      ...paginationParams,
      page: pagination.current || 1,
      limit: pagination.pageSize || 10,
    });
  };

  const onFinish = (values: BookingQuery) => {
    setQueryParams({
      ...values,
      startTime: values.startTime
        ? dayjs(values.startTime).valueOf()
        : undefined,
      endTime: values.endTime ? dayjs(values.endTime).valueOf() : undefined,
    });
    setPaginationParams((prev) => ({ page: 1, limit: prev.limit }));
  };
  const onReset = () => {
    form.resetFields();
    setQueryParams(form.getFieldsValue());
    setPaginationParams((prev) => ({ page: 1, limit: prev.limit }));
  };

  return (
    <>
      <Form form={form} onFinish={onFinish} autoComplete="off">
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item<BookingQuery> label="用户名" name="username">
              <Input placeholder="用户名" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item<BookingQuery> label="会议室名称" name="roomName">
              <Input placeholder="会议室名称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item<BookingQuery> label="状态" name="status">
              <Select placeholder="状态">
                <Select.Option value="0">待审批</Select.Option>
                <Select.Option value="1">已通过</Select.Option>
                <Select.Option value="2">已拒绝</Select.Option>
                <Select.Option value="3">已取消</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item<BookingQuery>
              label="预定时间"
              style={{ marginBottom: 0 }}
            >
              <Space.Compact>
                <Form.Item name="startTime" noStyle>
                  <DatePicker
                    showTime
                    placeholder="开始时间"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item name="endTime" noStyle>
                  <DatePicker
                    showTime
                    placeholder="结束时间"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={isFetching}>
                  查询
                </Button>
                <Button type="default" onClick={onReset}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data?.list || []}
        loading={isFetching}
        pagination={{
          showSizeChanger: true,
          pageSize: paginationParams.limit,
          total: data?.total || 0,
        }}
        onChange={handleChange}
      />
    </>
  );
};

export default BookingList;
