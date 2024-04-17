import { Outlet, useNavigate } from "react-router-dom";
import Contenido from "../components/Contenido";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
import { useUserContext } from "../context/UseContext";
import Cookies from 'universal-cookie';
import { CONFIGURACIONES } from "../configs/confing";
import { useQuery } from '@tanstack/react-query';


const LayoutPrivate = () => {
  const navegate = useNavigate();
  const cookies = new Cookies();
  const {setUser, setWorkSpaces} = useUserContext();

  const getWorkSpace = async () =>{

    const datos2 = await fetch(CONFIGURACIONES.BASEURL+'/workspace',{
      headers:{
        "Content-Type":"application/json",
        "x-access-token":cookies.get("x-access-user")
      },
      method:"GET"
    })

    const parse2 = await datos2.json();
    setWorkSpaces(parse2);

    return parse2;
  }

 
  if(!document.cookie.includes('x-access-user')) navegate('/');

  const {isLoading,error,isError,data:workSpace} = useQuery({
    queryKey:'workspaces',
    queryFn:getWorkSpace
  })




  // metodos de carga de datos de usuario Con ReactQuery

  const getUserData = async() =>{
    try {
      const response = await fetch(CONFIGURACIONES.BASEURL+"/auth",{
        headers:{
          "Content-Type":"application/json",
          "x-access-token":cookies.get("x-access-user")
        },
        method:"GET"
      });
      const parse = await response.json();
      return parse.user
    } catch (error) {
      return error
    }
}

  const {data:User,isLoading:isLoadingUser, isError: isErrorUser} = useQuery({
    queryKey:'UserData',
    queryFn:getUserData
  })


  useEffect(() => {
    if(!isLoadingUser)setUser(User)
    if(!isLoading)setWorkSpaces(workSpace)
    

  }, [isLoadingUser,isLoading])

   
    return (
    (isLoading && isLoadingUser)?
    
<div role="status" className="w-screen h-screen flex justify-center items-center flex-col">
    <svg aria-hidden="true" class="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className=" font-bold text-2xl mt-4">Cargando</span>
</div>
:
    <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen">
      <Sidebar isLoading={isLoading} workSpace={workSpace} /> 
      <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 flex flex-col ">
        <div className="">
          <Contenido workSpace={workSpace} isLoading={isLoading}/>
        </div>
        <div className="h-[100%] pt-2 pb-9 px-12 overflow-y-scroll">
          <Outlet context={isLoading}/>
        </div>
      </main>
    </div>
    )
}


export default LayoutPrivate


