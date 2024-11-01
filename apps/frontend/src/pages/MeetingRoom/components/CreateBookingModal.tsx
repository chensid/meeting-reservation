import { createBooking, CreateBookingParams } from "@/api/endpoints/bookingApi";
import { MeetingRoom } from "@/api/endpoints/meetingRoomApi";
import { useMutation } from "@tanstack/react-query";
import { DatePicker, Form, Input, message, Modal } from "antd";
import dayjs from "dayjs";

type CreateBookingModalProps = {
  meetingRoom: MeetingRoom;
  visible: boolean;
  onOk?: () => void;
  onCancel?: () => void;
};

const CreateBookingModal: React.FC<CreateBookingModalProps> = (props) => {
  const { meetingRoom, visible, onOk, onCancel } = props;

  const [form] = Form.useForm<CreateBookingParams>();

  const { mutate, isPending } = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      message.success("创建成功");
      handleCancel();
      onOk?.();
    },
  });

  const handleOk = () => {
    form.validateFields().then((values) => {
      mutate({
        ...values,
        roomId: meetingRoom.id,
        startTime: dayjs(values.startTime).valueOf(),
        endTime: dayjs(values.endTime).valueOf(),
      });
    });
  };
  const handleCancel = () => {
    form.resetFields();
    onCancel?.();
  };
  return (
    <Modal
      title="创建预定"
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
        <Form.Item<CreateBookingParams> label="会议室" name="roomId">
          {meetingRoom.name}
        </Form.Item>
        <Form.Item<CreateBookingParams>
          label="会议开始时间"
          name="startTime"
          rules={[{ required: true }]}
        >
          <DatePicker showTime />
        </Form.Item>
        <Form.Item<CreateBookingParams>
          label="会议结束时间"
          name="endTime"
          rules={[{ required: true }]}
        >
          <DatePicker showTime />
        </Form.Item>
        <Form.Item<CreateBookingParams> label="备注" name="note">
          <Input.TextArea
            placeholder="备注"
            maxLength={100}
            showCount
            autoSize={{ minRows: 4, maxRows: 4 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateBookingModal;
