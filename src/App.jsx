import { useEffect, useState } from "react"
import { useUserContext } from "./context/UseContext"
import {useQueryClient, useQuery} from "@tanstack/react-query"
import WorksCarts from "./components/worksCarts";
import Cookies from "universal-cookie";
import { CONFIGURACIONES } from "./configs/confing";
import { GrClose } from "react-icons/gr";
import WorksForm from "./components/WorksForm";

function App() {
const cookies = new Cookies()
const {workspaces, user} = useUserContext();
const queryClient = useQueryClient();
const [show,setShow]=useState(false)
const [selected, setSelected] = useState({})

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

const getDatos = async () =>{

  const datos2 = await fetch(CONFIGURACIONES.BASEURL+'/workspace',{
    headers:{
      "Content-Type":"application/json",
      "x-access-token":cookies.get("x-access-user")
    },
    method:"GET"
  })

  const parse2 = await datos2.json();

  return parse2;
}



const { isLoading, data:works, isError, error } = useQuery({
  queryFn:getDatos,
  queryKey:'workspaces'
})



  return (
    <>
   
    {
      (isLoading)? 'Cargando Datos' : isError ? 'Ups Fallos técnicos' : 
       <>
      <div className="w-full py-5 px-4 border-b-2 mb-3 ">
               <h1 className="text-3xl font-bold text-gray-800">¡Hola, Bienvenido {User.name}!</h1>
       </div>
       <h1 className="text-3xl font-bold text-gray-800 mb-5 px-4">Áreas de trabajo</h1>
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {works.map((Item) => {
         return(
             <WorksCarts key={Item._id} data={Item} userId={User._id} event={()=>{setShow(!show); setSelected(Item)}}/>
         )
       })
       }
       </div>
      </>
      }
   
   {
                show &&(    
                  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm transition-all duration-1000">
                  <div id='Contenedor' className={`bg-white h-[40%] m-auto w-[50%] shadow-2xl rounded-2xl p-8 ${show ? '' : 'hidden'}`}>
                    <div className="flex justify-end">
                      <button onClick={() => setShow(!show)} className="hover:bg-red-500 text-white p-2 rounded-full">
                        <GrClose className="font-bold text-2xl text-black" />
                      </button>
                    </div>

                    <WorksForm data={selected} />

                  </div>
                </div>)
              }
   </>
  )
}

export default App
