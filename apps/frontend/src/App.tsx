import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { RouterProvider } from "react-router-dom";
import router from "./routes";

const App: React.FC = () => {
  return (
    <>
      <ConfigProvider locale={zhCN}>
        <RouterProvider router={router}></RouterProvider>
      </ConfigProvider>
    </>
  );
};

export default App;
