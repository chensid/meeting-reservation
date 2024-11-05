import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Space,
  Table,
  TableProps,
} from "antd";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getMeetingRoomList,
  deleteMeetingRoom,
  MeetingRoom,
} from "@/api/endpoints/meetingRoomApi";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import MeetingRoomModal from "./components/meeting-room-modal";
import UpdateMeetingRoomModal from "./components/update-meeting-room-modal";
import CreateBookingModal from "./components/create-booking-modal";

type MeetingRoomParams = {
  name?: string;
  capacity?: number;
  equipment?: string;
};

const MeetingRoomList: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [queryParams, setQueryParams] = useState<MeetingRoomParams>({});
  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    limit: 10,
  });
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["meeting-rooms", queryParams, paginationParams],
    queryFn: () => getMeetingRoomList({ ...queryParams, ...paginationParams }),
    enabled: false,
  });
  useEffect(() => {
    refetch();
  }, [queryParams, paginationParams, refetch]);

  const columns: TableProps<MeetingRoom>["columns"] = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    {
      title: "会议室名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "会议室容量",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "会议室位置",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "设备",
      dataIndex: "equipment",
      key: "equipment",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "预定状态",
      dataIndex: "isBooked",
      key: "isBooked",
      render: (text) => (text ? "已预定" : "可预定"),
    },
    {
      title: "创建时间",
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
          <a onClick={() => handleModify(record.id)}>修改</a>
          <Popconfirm
            title="删除会议室"
            description="确定删除该会议室吗?"
            onConfirm={() => handleDelete(record.id)}
          >
            <a>删除</a>
          </Popconfirm>
          <a
            onClick={() => {
              setCurrentMeetingRoom(record);
              setIsCreateModalVisible(true);
            }}
          >
            创建预定
          </a>
        </Space>
      ),
    },
  ];
  const handleChange: TableProps<MeetingRoom>["onChange"] = (pagination) => {
    setPaginationParams({
      ...paginationParams,
      page: pagination.current || 1,
      limit: pagination.pageSize || 10,
    });
  };

  const onFinish = (values: MeetingRoomParams) => {
    setQueryParams({ ...values });
    setPaginationParams((prev) => ({ page: 1, limit: prev.limit }));
  };
  const onReset = () => {
    form.resetFields();
    setQueryParams(form.getFieldsValue());
    setPaginationParams((prev) => ({ page: 1, limit: prev.limit }));
  };

  const handleAdd = () => {
    setIsModalVisible(true);
  };

  const [updateId, setUpdateId] = useState("");
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [currentMeetingRoom, setCurrentMeetingRoom] = useState<MeetingRoom>();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const handleModify = (id: string) => {
    setUpdateId(id);
    setIsUpdateModalVisible(true);
  };

  const { mutate: deleteMeetingRoomMutate } = useMutation({
    mutationFn: deleteMeetingRoom,
    onSuccess: () => {
      refetch();
      message.success("删除成功");
    },
  });

  const handleDelete = (id: string) => {
    deleteMeetingRoomMutate(id);
  };

  return (
    <>
      <Form form={form} onFinish={onFinish} autoComplete="off">
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item<MeetingRoomParams> label="会议室名称" name="name">
              <Input placeholder="会议室名称" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<MeetingRoomParams> label="会议室容量" name="capacity">
              <InputNumber placeholder="会议室容量" className="w-full" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item<MeetingRoomParams> label="设备" name="equipment">
              <Input placeholder="设备" />
            </Form.Item>
          </Col>
          <Col span={6}>
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
      <div className="mb-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增
        </Button>
      </div>
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
      <MeetingRoomModal
        title="新增会议室"
        visible={isModalVisible}
        onOk={() => refetch()}
        onCancel={() => setIsModalVisible(false)}
      />
      <UpdateMeetingRoomModal
        id={updateId}
        title="修改会议室"
        visible={isUpdateModalVisible}
        onOk={() => refetch()}
        onCancel={() => {
          setUpdateId("");
          setIsUpdateModalVisible(false);
        }}
      />
      {currentMeetingRoom && (
        <CreateBookingModal
          meetingRoom={currentMeetingRoom}
          visible={isCreateModalVisible}
          onOk={() => refetch()}
          onCancel={() => setIsCreateModalVisible(false)}
        />
      )}
    </>
  );
};

export default MeetingRoomList;
