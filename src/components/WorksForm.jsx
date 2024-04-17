import { useState } from "react"
import { GrClose } from "react-icons/gr";
import ParticiparesForm from "./ParticiparesForm";
import { FaArrowRight } from "react-icons/fa";
import { CONFIGURACIONES } from "../configs/confing";
import Cookies from "universal-cookie";
import {useQueryClient} from "@tanstack/react-query"

function WorksForm({data}) {
  const queryClient = useQueryClient();
  const cookies = new Cookies();
  const [show, setShow] = useState(false)
  const [updateUser, serUpdateUser] = useState({
    workspaceId : data._id,
    privileges:''
  })

  const handleOnSubmit = async (e)=>{
    e.preventDefault()
    
    const formulario = new FormData(e.target)
    const id = formulario.get('id')
    
    const object = {
      privilegio:updateUser.privileges,
      workspaceid:updateUser.workspaceId,
      userId:id
    } 

    console.log('id del usuario: '+ id)
    try{
      const res = await fetch(CONFIGURACIONES.BASEURL+'/workspace/',{
        headers:{
          'Content-Type':'application/json',
          'x-access-token': cookies.get('x-access-user')
        },
        method:'PUT',
        body:JSON.stringify(object)
      })
      const json = await res.json();

    

      queryClient.invalidateQueries('workspaces')

      console.log(json)

    }catch(err){
      console.log(err)
    }
  }

  const handleChange = (e) =>{
    const {name,value} = e.target

    serUpdateUser({
      ...updateUser,
      [name]:value
    })
  }

  return (
    <div>
<form className="flex flex-col space-y-4" onSubmit={(e) => e.preventDefault()}>
  <div>
    <label htmlFor="workSpaceName" className="text-lg font-semibold">Nombre del Workspace:</label>
    <input
      type="text"
      id="workSpaceName"
      name="workSpaceName"
      className="border mt-1 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
      value={data.workSpaceName}
    />
  </div>
  <div className="flex flex-row items-center">
    <label htmlFor="project" className="text-lg font-semibold mr-4">Proyectos:</label>
    <select
      id="project"
      name="project"
      className="border mt-1 w-[40%] rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
    >
      <option value="" disabled defaultValue>{data.projects.length}</option>
      {data.projects.map((item, index) => (
        <option key={index} value={item.nameProject}>{item.nameProject}</option>
      ))}
    </select>
  </div>
  <div className="flex justify-between items-center cursor-pointer border border-gray-300 rounded-md px-4 py-2" onClick={() => setShow(!show)}>
    <h1 className="text-lg font-semibold">Participantes: {data.participates.length}</h1>
    <FaArrowRight className="ml-2" />
  </div>
</form>

      {
        show &&(    
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm transition-all duration-1000">
          <div id='Contenedor' className={`bg-white h-[65%] m-auto w-[50%] shadow-2xl rounded-2xl p-8 ${show ? '' : 'hidden'}`}>
            <div className="flex justify-end">
              <button onClick={() => setShow(!show)} className="hover:bg-red-500 text-white p-2 rounded-full">
                <GrClose className="font-bold text-2xl text-black" />
              </button>
            </div>
            <div className="flex w-full items-center justify-center">
              <h1 className=" py-2 font-bold text-2xl">
                Participantes
              </h1>
            </div>
            <div className=" flex flex-col h-96 overflow-y-scroll">
            {
              data.participates.map((item)=>{
                return(
                  
                    <ParticiparesForm data={item} onChange={handleChange} onSubmit={handleOnSubmit} />
                
                )
              })
            }
            </div>
          </div>
        </div>)
      }
    </div>
  )
}

export default WorksForm