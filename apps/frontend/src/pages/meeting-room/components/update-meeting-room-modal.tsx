import { Form, Input, InputNumber, message, Modal } from "antd";
import { useMutation } from "@tanstack/react-query";
import {
  getMeetingRoom,
  updateMeetingRoom,
} from "@/api/endpoints/meetingRoomApi";
import { useEffect } from "react";

type MeetingRoomModalProps = {
  id: string;
  title?: string;
  visible?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
};
type UpdateMeetingRoomParams = {
  id: string;
  name: string;
  capacity: number;
  location: string;
  equipment?: string;
  description?: string;
};
const UpdateMeetingRoomModal: React.FC<MeetingRoomModalProps> = (props) => {
  const { id, title = "会议室", visible, onOk, onCancel } = props;

  const [form] = Form.useForm<UpdateMeetingRoomParams>();

  const { mutate: initialMutate, isPending: isLoading } = useMutation({
    mutationFn: () => getMeetingRoom(id),
    onSuccess: (data) => {
      form.setFieldsValue(data);
    },
  });

  useEffect(() => {
    if (id) {
      initialMutate();
    }
  }, [id, initialMutate]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateMeetingRoom,
    onSuccess: () => {
      message.success("更新成功");
      handleCancel();
      onOk?.();
    },
  });

  const handleOk = () => {
    form.validateFields().then((values) => {
      mutate({ ...values, id });
    });
  };
  const handleCancel = () => {
    form.resetFields();
    onCancel?.();
  };
  return (
    <Modal
      title={title}
      open={visible}
      loading={isLoading}
      confirmLoading={isPending}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        autoComplete="off"
      >
        <Form.Item<UpdateMeetingRoomParams>
          label="会议室名称"
          name="name"
          rules={[{ required: true, message: "请输入会议室名称" }]}
        >
          <Input placeholder="会议室名称" />
        </Form.Item>
        <Form.Item<UpdateMeetingRoomParams>
          label="会议室容量"
          name="capacity"
          rules={[{ required: true, message: "请输入会议室容量" }]}
        >
          <InputNumber
            placeholder="会议室容量"
            className="w-full"
            min={1}
            max={1000}
          />
        </Form.Item>
        <Form.Item<UpdateMeetingRoomParams>
          label="会议室位置"
          name="location"
          rules={[{ required: true, message: "请输入会议室位置" }]}
        >
          <Input placeholder="会议室位置" />
        </Form.Item>
        <Form.Item<UpdateMeetingRoomParams> label="设备" name="equipment">
          <Input placeholder="设备" />
        </Form.Item>
        <Form.Item<UpdateMeetingRoomParams> label="描述" name="description">
          <Input.TextArea
            placeholder="描述"
            maxLength={100}
            showCount
            autoSize={{ minRows: 4, maxRows: 4 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default UpdateMeetingRoomModal;
