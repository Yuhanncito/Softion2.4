import { LiaUserPlusSolid } from "react-icons/lia";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineFlagCircle } from "react-icons/md";
import { useUserContext } from "../context/UseContext";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { CONFIGURACIONES } from "../configs/confing";



function List() {
  const {projectId} = useUserContext();
  const [Data, setData] = useState([]);
  const [NewTask, setTask] = useState({
    nameTask:''
  });
 

  const cookies = new Cookies();
  const getTasks = async () =>{
    try {
      const reponse = await fetch(CONFIGURACIONES.BASEURL+'/task',{
        method:'POST',
        headers:{
          "x-access-token": cookies.get("x-access-user"),
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          projectRelation:projectId
        }),
        
      })
      console.log(reponse)
      const parse = await reponse.json();
      console.log("lista de tareas",parse)
      setData(parse);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(projectId)
    getTasks()
  }, [projectId])

  const handleChange = e =>{
    setTask({
      ...NewTask,
      [e.target.name]:e.target.value
    })
  }

  const handleSubmit = async (e) =>{
    e.preventDefault()
    try {
      const response = await fetch(CONFIGURACIONES.BASEURL+'/task/newTask',{
        body:JSON.stringify({
          projectRelation:projectId,
          nameTask:NewTask.nameTask
        }),
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'x-access-token':cookies.get('x-access-user')
        }
      })
      console.log(projectId)

      console.log(response)
      const parse = await response.json()

      console.log(parse);

      setTask({
        nameTask:''
      })

      getTasks();
    } catch (error) {
      
    }
  }
  
  
  return (
    <div className=" flex-col h-full  ">
      <div className="flex flex-col w-[100%] h-[calc(100%-10%)] p-5">

      {
       Data && Data.map((task,index)=>(
          <div className="w-full flex flex-row hover:bg-gray-500/50 border-b-2 transition-colors duration-75">
          <div className=" w-[35%] py-2 px-5 ">
          <p className=" hover:bg-gray-300 py-1 px-5 rounded-md bg-transparent w-full focus:outline-none focus:bg-gray-200" >{task.nameTask} </p>
          </div>
          <div className=" w-[20%] border-6 border-red-500"></div>
          <div className=" w-[20%]"></div>
          <div className=" w-[25%]"></div>
        </div>
        ))
      }

        <div className="w-full flex flex-row hover:bg-gray-500/50 border-b-2 transition-colors duration-75">
          <div className=" w-[35%] py-2 px-5 ">
          <form onSubmit={handleSubmit} className="w-full"><input onChange={handleChange} placeholder="Ingresa una nueva tarea" name="nameTask" className=" hover:bg-gray-300 py-1 px-5 rounded-md bg-transparent w-full focus:outline-none focus:bg-gray-200" type="text" id="" value={NewTask.nameTask} /></form>
          </div>
          <div className=" w-[20%] border-6 border-red-500"></div>
          <div className=" w-[20%]"></div>
          <div className=" w-[25%]"></div>
        </div>
        
      </div>
      
      
    </div>
  )
}

export default List
