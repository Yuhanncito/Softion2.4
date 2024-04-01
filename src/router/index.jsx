import { createBrowserRouter } from "react-router-dom";
import Login from "../Login";
import Sidebar from "../App";
//import List from "../components/List";
import Ctarea from "../components/createTarea"
import Canva2 from "../components/canva";
import RegisterCom from "../components/RegisterCom";
import ForgetPassword from "../components/ForgetPassword"
import NotFound from "../components/NotFound";
import CodigoVer from "../components/CodigoVer";
import LayoutPrivate from "../layouts/LayoutPrivate";
import LayoutPublic from "../layouts/LayoutPublic";
import ResetPass from "../components/ResetPass";
import List from "../components/List";
import Gantt from "../components/Gantt";
import Gantt2 from "../views/Gantt";
import ForgetSecret from "../components/ForgetSecret";
import TaskForm from "../components/TaskForm";
import Mate from "../views/Prototipos/Mate";


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
        path:"/test/gantt",
        element: <Gantt2 />
      },
      {
        path:"/mate",
        element:<Mate />
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
        path: "/ForgetSecret",
        element: <ForgetSecret />
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
                element: <Canva2 />
              },
              {
                path: "/createTarea",
                element: <Ctarea />
              },
              {
                path: "/TaskForm",
                element: <TaskForm />
              }
          ]
      }
    ],
  },
]); 
