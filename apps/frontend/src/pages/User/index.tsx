import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Space,
  Table,
  TableProps,
} from "antd";
import { getUserList, freezeUser } from "@/api/endpoints/userApi";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

type UserParams = {
  username?: string;
  nickname?: string;
  email?: string;
};
const UserList: React.FC = () => {
  const [form] = Form.useForm();
  const [queryParams, setQueryParams] = useState<UserParams>({});
  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    limit: 10,
  });
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["users", queryParams, paginationParams],
    queryFn: () => getUserList({ ...queryParams, ...paginationParams }),
    enabled: false,
  });
  useEffect(() => {
    refetch();
  }, [queryParams, paginationParams, refetch]);

  const columns: TableProps["columns"] = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "昵称",
      dataIndex: "nickname",
      key: "nickname",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "手机号",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "注册时间",
      dataIndex: "createTime",
      key: "createTime",
      render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
      render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleFreeze(record.id)}>冻结</a>
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

  const { mutate: freezeMutation } = useMutation({
    mutationFn: (id: number) => freezeUser(id),
    onSuccess: () => {
      refetch();
      message.success("操作成功");
    },
  });

  const handleFreeze = (id: number) => {
    freezeMutation(id);
  };

  const onFinish = (values: UserParams) => {
    setQueryParams({ ...values });
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
          <Col span={6}>
            <Form.Item<UserParams> label="用户名" name="username">
              <Input placeholder="用户名" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<UserParams> label="昵称" name="nickname">
              <Input placeholder="昵称" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<UserParams> label="邮箱" name="email">
              <Input placeholder="邮箱" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
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
          size: "small",
        }}
        onChange={handleChange}
      />
    </>
  );
};

export default UserList;
