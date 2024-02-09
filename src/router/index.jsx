import { createBrowserRouter } from "react-router-dom";
import Login from "../Login";
import Sidebar from "../App";
//import List from "../components/List";
import Ctarea from "../components/createTarea"
import Canva from "../components/canva";
import RegisterCom from "../components/RegisterCom";
import ForgetPassword from "../components/ForgetPassword"
import NotFound from "../components/NotFound";
import CodigoVer from "../components/CodigoVer";
import LayoutPrivate from "../layouts/LayoutPrivate";
import LayoutPublic from "../layouts/LayoutPublic";
import ResetPass from "../components/ResetPass";
import List from "../components/List";
import Gantt from "../components/Gantt";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPublic />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "/Register",
        element: <RegisterCom />,
      },
      
      {
        path: "/CodigoVer",
        element: <CodigoVer />,
      },
      {
        path: "/ForgetPass",
        element: <ForgetPassword />
      },
      {
        path: "/ResetPass",
        element: <ResetPass />
      },
      {
        path: "/",
        element: <LayoutPrivate />,
        children: [
              {
                path:"/App",
                index:true,
                element:<Sidebar />
              },
              {
                path: "/List",
                element: <List />
              },
              {
                path: "/Gantt",
                element: <Gantt />
              },
              {
                path: "/Canva",
                element: <Canva />
              },
              {
                path: "/createTarea",
                element: <Ctarea />
              }
          ]
      }
    ],
  },
]);