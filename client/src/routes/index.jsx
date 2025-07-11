import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import CheckEmailPage from "../pages/CheckEmailPage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import Home from "../pages/Home";
import AllPosts from "../components/AllPosts";
import OtherProfile from "../components/OtherProfile";
import Ranking from "../components/Ranking";
import AddPost from "../components/AddPost";
import AddThread from "../components/AddThread";
import AllThreads from "../components/AllThreads";
import MessagePage from "../components/MessagePage";
import MeetingRoomPersonal from "../components/MeetingRoomPersonal";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "email",
        element: <CheckEmailPage />,
      },
      {
        path: "password",
        element: <CheckPasswordPage />,
      },
      {
        path: "rankings",
        element: <Ranking />
      },
      {
        path: ":userId",
        element: <OtherProfile />
      },
      {
        path: "add-post",
        element: <AddPost />
      },
      {
        path: "add-thread",
        element: <AddThread />
      },
      {
        path: "",
        element: <Home />,
        children: [
          {
            path: "all-posts",
            element: <AllPosts />,
          },
          {
            path: "all-threads",
            element: <AllThreads />,
          },
          {
            path: "message/:userId",
            element: <MessagePage />
          },
          {
            path: "1o1meetingroom/:roomId",
            element: <MeetingRoomPersonal />
          }
        ]
      }
    ],
  },
]);

export default router;
