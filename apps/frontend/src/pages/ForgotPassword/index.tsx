import { Button, Col, Form, Input, message, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { getCaptcha, forgotPassword } from "@/api/endpoints/authApi";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

type ForgotPasswordForm = {
  email: string;
  captcha: string;
  password: string;
  confirmPassword: string;
};
const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [isSend, setIsSend] = useState(false);

  const { mutate: submit, isPending } = useMutation({
    mutationFn: (data: ForgotPasswordForm) => {
      const { email, captcha, password } = data;
      return forgotPassword({ email, captcha, password });
    },
    onSuccess: () => {
      message.success("找回密码成功");
      navigate("/login");
    },
  });
  const { mutate: sendCaptcha, isPending: isCaptchaPending } = useMutation({
    mutationFn: (params: { address: string }) => getCaptcha(params),
    onSuccess: () => {
      setIsSend(true);
      message.success("验证码发送成功");
    },
    onError: () => {
      setIsSend(false);
    },
  });

  const handleSendCaptcha = () => {
    form.validateFields(["email"]).then((values) => {
      const params = { address: values.email };
      sendCaptcha(params);
    });
  };

  const onFinish = (values: ForgotPasswordForm) => {
    submit(values);
  };

  return (
    <div className="h-[100vh] bg-[url('@/assets/images/login-bg.png')] bg-[length:100%_100%] flex flex-col">
      <div className="mt-[15%] flex justify-center">
        <h1 className="text-3xl font-semibold">找回密码</h1>
      </div>
      <Form
        form={form}
        className="w-[350px] mx-auto mt-10"
        autoComplete="off"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={onFinish}
      >
        <Form.Item<ForgotPasswordForm>
          label="邮箱"
          name="email"
          hasFeedback
          rules={[
            { required: true, message: "请输入邮箱" },
            { type: "email", message: "请输入正确的邮箱格式" },
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item
          label="验证码"
          name="captcha"
          hasFeedback
          rules={[{ required: true, message: "请输入验证码" }]}
        >
          <Row gutter={8}>
            <Col span={14}>
              <Input placeholder="请输入验证码" />
            </Col>
            <Col span={10}>
              <Button
                type="primary"
                onClick={handleSendCaptcha}
                loading={isCaptchaPending}
                disabled={isSend}
              >
                {isCaptchaPending ? "发送中" : "发送验证码"}
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item<ForgotPasswordForm>
          label="密码"
          name="password"
          hasFeedback
          rules={[
            { required: true, message: "请输入密码" },
            { min: 6, message: "密码不能少于6位" },
            { max: 16, message: "密码不能超过100位" },
          ]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        <Form.Item<ForgotPasswordForm>
          label="确认密码"
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "请再次输入密码" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("两次密码输入不一致"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }}>
          <a className="float-right" onClick={() => navigate("/login")}>
            返回登录
          </a>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }}>
          <Button type="primary" htmlType="submit" block loading={isPending}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgotPassword;
