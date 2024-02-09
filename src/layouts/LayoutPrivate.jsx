import { Outlet, useNavigate } from "react-router-dom";
import Contenido from "../components/Contenido";
import Sidebar from "../components/Sidebar";

import Ctarea from "../components/createTarea";
import { useEffect } from "react";
import { useUserContext } from "../context/UseContext";
import Cookies from 'universal-cookie';
import { CONFIGURACIONES } from "../configs/confing";


const LayoutPrivate = () => {
  const navegate = useNavigate();
  
  const cookies = new Cookies();

  const {setUser} = useUserContext();

  useEffect(() => {
   
    if(!document.cookie.includes('x-access-user')) navegate('/');
    
    const getUser = async() =>{
      try {
        const response = await fetch(CONFIGURACIONES.BASEURL+"/auth",{
          headers:{
            "Content-Type":"application/json",
            "x-access-token":cookies.get("x-access-user")
          },
          method:"GET"
        });
        console.log(response)

        const parse = await response.json();

        console.log(parse)

        setUser(parse.user);
      } catch (error) {
        console.log(error)
      }
    }
    getUser();
  }, [])

   
    return (
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
      <Sidebar /> 
      <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 flex flex-col ">
        <div className="">
          <Contenido/>
  
        </div>
        <div className="h-[100%] pt-2 pb-9 px-12">
          <Outlet />
        </div>
      </main>
    </div>
    )
x}


export default LayoutPrivate


