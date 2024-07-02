import { Form, Input, InputNumber, message, Modal } from "antd";
import { useMutation } from "@tanstack/react-query";
import { createMeetingRoom } from "@/api/endpoints/meetingRoomApi";

type MeetingRoomModalProps = {
  title?: string;
  visible?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
};
type MeetingRoomParams = {
  name: string;
  capacity: number;
  location: string;
  equipment?: string;
  description?: string;
};
const MeetingRoomModal: React.FC<MeetingRoomModalProps> = (props) => {
  const { title = "会议室", visible, onOk, onCancel } = props;
  const [form] = Form.useForm<MeetingRoomParams>();

  const { mutate, isPending } = useMutation({
    mutationFn: createMeetingRoom,
    onSuccess: () => {
      message.success("创建成功");
      handleCancel();
      onOk?.();
    },
  });

  const handleOk = () => {
    form.validateFields().then((values) => {
      mutate(values);
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
        <Form.Item<MeetingRoomParams>
          label="会议室名称"
          name="name"
          rules={[{ required: true, message: "请输入会议室名称" }]}
        >
          <Input placeholder="会议室名称" />
        </Form.Item>
        <Form.Item<MeetingRoomParams>
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
        <Form.Item<MeetingRoomParams>
          label="会议室位置"
          name="location"
          rules={[{ required: true, message: "请输入会议室位置" }]}
        >
          <Input placeholder="会议室位置" />
        </Form.Item>
        <Form.Item<MeetingRoomParams> label="设备" name="equipment">
          <Input placeholder="设备" />
        </Form.Item>
        <Form.Item<MeetingRoomParams> label="描述" name="description">
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
export default MeetingRoomModal;
