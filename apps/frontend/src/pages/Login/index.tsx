import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { login } from "@/api/endpoints/authApi";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type LoginForm = {
  username: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginForm) => login(data),
    onSuccess: (res) => {
      const { accessToken, refreshToken } = res.data;
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("accessToken", accessToken);
      navigate("/");
    },
  });
  const onFinish = (values: LoginForm) => {
    mutate(values);
  };
  return (
    <div className="h-[100vh] bg-[url('@/assets/images/login-bg.png')] bg-[length:100%_100%] flex flex-col">
      <div className="mt-[15%] flex justify-center">
        <h1 className="text-3xl font-semibold">系统登录</h1>
      </div>
      <Form
        className="w-[300px] mx-auto mt-10"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item<LoginForm>
          name="username"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input placeholder="请输入用户名" prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item<LoginForm>
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password placeholder="请输入密码" prefix={<LockOutlined />} />
        </Form.Item>
        <Form.Item>
          <a onClick={() => navigate("/register")}>注册</a>
          <a className="float-right">忘记密码</a>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={isPending}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
