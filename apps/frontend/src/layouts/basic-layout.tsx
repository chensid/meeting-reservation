import { Layout, Menu, MenuProps } from "antd";
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
    }
  ];
  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-sm">header</Header>
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
