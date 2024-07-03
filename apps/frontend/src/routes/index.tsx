import { createBrowserRouter } from "react-router-dom";
import BasicLayout from "@/layouts/BasicLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import UserList from "@/pages/User";
import MeetingRoom from "@/pages/MeetingRoom";
import BookingList from "@/pages/Booking";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/user",
        element: <UserList />,
      },
      {
        path: "/meeting-room",
        element: <MeetingRoom />,
      },
      {
        path: "/booking",
        element: <BookingList />,
      }
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
