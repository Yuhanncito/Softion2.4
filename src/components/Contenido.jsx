import { useEffect, useState } from "react";
import { useUserContext } from "../context/UseContext";
import Cookies from "universal-cookie";
import Header from "../components/Head";
import MigaPan from "../components/migaPan";
import { GrClose } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa";
import { BiSolidUser } from "react-icons/bi";
import { FaRegFolderOpen } from "react-icons/fa6";
import { CONFIGURACIONES } from "../configs/confing";
CONFIGURACIONES

function Contenido() {
  const {projectId,user} = useUserContext();
  const cookies = new Cookies();
  const [projecData, setProjecData] = useState(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
      const getInfoProject = async () =>{
        try {
          const response = await fetch(CONFIGURACIONES.BASEURL+'/projects/getById',{
            method:"PUT",
            headers:{
              "Content-Type": "application/json",
              "x-access-token":cookies.get("x-access-user")
            },
            body:JSON.stringify({"projectId":projectId})
          })

          console.log(response)

          const parse = await response.json();

          console.log(parse)
          if(parse.message === "ok") setProjecData(parse.data)

        } catch (error) {
          
        }
      }
      if(projectId)getInfoProject();
  }, [projectId])
  

  return (
    <div className="flex pt-10 bg-white shadow-lg justify-around flex-col h-18 w-full justify-items-center items-center flex-wrap md:flex-nowrap">
      <div  className="flex w-full justify-between h-20 pr-30 pl-28">
        <div className="flex flex-row items-center">
        {
          projecData?<FaRegFolderOpen className="w-[20%] text-2xl mx-4" />: <BiSolidUser className="w-[20%] text-2xl" />
        }
        <h1 className="flex items-center text-3xl font-bold md:text-2xl w-[80%]">{projecData?projecData.nameProject:user?user.name?user.name.toUpperCase()+" "+user.lastName.toUpperCase():"":""}</h1>
        </div>
        <div className="flex justify-center justify-items-center flex-col w-[20%]">
          <h1 className="text-3xl font-bold md:text-2xl">{projecData?projecData.status?projecData.status:"------":"------"}</h1>
          <h3 className="">Estado</h3>
        </div>
        <div className="flex justify-center justify-items-center flex-col w-[20%]">
          <h1 className="text-3xl font-bold md:text-2xl">{projecData?projecData.started?projecData.started:"--/--/--":"--/--/--"}</h1>
          <h3>inicio</h3>
        </div>
        <div className="flex justify-center justify-items-center flex-col w-[20%]">
          <h1 className="text-3xl font-bold md:text-2xl">{projecData?projecData.finished?projecData.finished:"--/--/--":"--/--/--"}</h1>
          <h3>Finalizado</h3>
        </div>
      </div>
      
      <div className=" pr-12 flex w-full h-[10%] justify-between items-center">
        <Header />
        <button onClick={()=>setShow(!show)} className="  bg-blue-500 w-40 hover:bg-blue-600 h-10 font-bold text-white rounded-xl">
          Agregar Tarea
        </button>
      </div>

      
      <MigaPan />

      {
        show &&(<div className="fixed p-40 inset-0 backdrop-blur-sm flex transition-all duration-1000 ">
        <div className={(show?" ":" ")+" bg-white h-[60%] m-auto w-[50%] shadow-2xl rounded-2xl p-5 flex flex-col"}>
          <div className="w-full flex justify-end"> 
            <button onClick={()=>setShow(!show)} className="hover:bg-red-500 p-3 hover:text-white rounded-full">
              <GrClose className=" font-bold text-1xl"/>
            </button>
          </div>
          <form action="">

          </form>
        </div>
      </div>)
      }
    </div>
  )
}

export default Contenido
