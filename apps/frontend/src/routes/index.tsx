import { createBrowserRouter } from "react-router-dom";
import BasicLayout from "@/layouts/basic-layout";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgot-password";
import UserList from "@/pages/user";
import MeetingRoomList from "@/pages/meeting-room";
import BookingList from "@/pages/booking";
import BookingHistory from "@/pages/booking/booking-history";
import StatisticPage from "@/pages/statistic";

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
        element: <MeetingRoomList />,
      },
      {
        path: "/booking",
        element: <BookingList />,
      },
      {
        path: "/booking-history",
        element: <BookingHistory />,
      },
      {
        path: "/statistic",
        element: <StatisticPage />,
      },
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
