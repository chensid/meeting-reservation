import { LogoutOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu, MenuProps } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Sider, Content, Footer } = Layout;

const BasicLayout: React.FC = () => {
  const navigate = useNavigate();

  const menuItems: MenuProps["items"] = [
    {
      key: "1",
      label: "Home",
      onClick: () => navigate("/"),
    },
    {
      key: "2",
      label: "User",
      onClick: () => navigate("/user"),
    },
    {
      key: "3",
      label: "Meeting Room",
      onClick: () => navigate("/meeting-room"),
    },
    {
      key: "4",
      label: "Booking",
      onClick: () => navigate("/booking"),
    },
    {
      key: "5",
      label: "Booking History",
      onClick: () => navigate("/booking-history"),
    },
    {
      key: "6",
      label: "Statistic",
      onClick: () => navigate("/statistic"),
    },
  ];

  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: "退出登录",
      icon: <LogoutOutlined />,
      onClick: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
      },
    },
  ];
  return (
    <Layout className="min-h-screen">
      <Header className="border-b shadow-sm">
        <div className="flex items-center justify-between">
          <div>header</div>
          <div>
            <Dropdown menu={{ items }}>
              <div className="flex items-center gap-2 cursor-pointer h-[44px] text-[#00000073] rounded-[6px] px-2 hover:bg-[#00000008]">
                <Avatar size={26} gap={8} />
                <span>Username</span>
              </div>
            </Dropdown>
          </div>
        </div>
      </Header>
      <Layout>
        <Sider collapsible theme="light">
          <Menu
            theme="light"
            mode="inline"
            items={menuItems}
            className="flex-1 min-w-0"
          />
        </Sider>
        <Layout>
          <Content className="p-6 m-5 bg-white rounded-lg">
            <Outlet />
          </Content>
          <Footer className="text-center">©{new Date().getFullYear()}</Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
