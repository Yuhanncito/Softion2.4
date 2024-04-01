import { useEffect, useState } from "react";
import { useUserContext } from "../context/UseContext";
import Cookies from "universal-cookie";
import Header from "../components/Head";
import MigaPan from "../components/migaPan";
import { BiSolidUser } from "react-icons/bi";
import { FaRegFolderOpen } from "react-icons/fa6";
import { CONFIGURACIONES } from "../configs/confing";
import TaskForm from "../components/TaskForm";
import { GrClose } from "react-icons/gr";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import Swal from 'sweetalert2'


// Agregar funcion para alerta de notificacaion
import { MdNotificationsActive } from "react-icons/md";
// <MdNotificationsActive />



function Contenido() {
  const { projectId, user } = useUserContext();
  const cookies = new Cookies();
  const [projecData, setProjecData] = useState(null);
  const [show, setShow] = useState(false);
  const [ver, setVer] = useState(false);
  const [notiDefine,setNotiDefine] = useState('')
  const [workSpace,setWorkspace] = useState(null)
  const [invitations, setInvitations] = useState(null)
  const [invitation,setInvitation] = useState({
    email:'',
    workSpace:''
  })
  const [selectedTask, setSelectedTask] = useState({
    nameTask:'',
    descriptionTask:'',
    userTasks:[],
    timeHoursTaks:'',
    projectRelation:'',
  })
  const [showNotifications, setShowNotifications] = useState(false); // Estado para mostrar el modal de notificaciones

  // Metodos HTTP
  /* 
    GET - Retorna sin enviar datos
    POST - Retorna o no Pero envias Datos
    PUT - Retorna o no Pero envias Datos
    DELETE Retorna o no Pero no envias Datos

  */

  const getNotifications = async()=>{
    try{
     
        const respuesta = await fetch(CONFIGURACIONES.BASEURL+`/invitation/${user._id}`,{
          headers:{
            "Content-Type":"application/json",
            "x-access-token":cookies.get("x-access-user")
          }
        })
        
      
      const json = await respuesta.json();
      (json.invitations.length === 0)?setInvitations(null):setInvitations(json.invitations)

      console.log("notificaciones",invitations)
    }catch(err){
      console.log("error de la notificacion",err)
    }
  }
   
  const getWorks = async() =>{
    const datos2 = await fetch(CONFIGURACIONES.BASEURL+'/workspace',{
      headers:{
        "Content-Type":"application/json",
        "x-access-token":cookies.get("x-access-user")
      },
      method:"GET"
    })

    const parseWork = await datos2.json();
    console.log("invitaciones",parseWork)
    setWorkspace(parseWork)
  }

  useEffect(() => {
    getNotifications();
    getWorks();
  }, [])
  

  useEffect(() => {
    const getInfoProject = async () => {
      try {
        const response = await fetch(
          CONFIGURACIONES.BASEURL + `/projects/${projectId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": cookies.get("x-access-user"),
            }
          }
        );

        const parse = await response.json();

        console.log(parse);
        if (parse.message === "ok") setProjecData(parse.data);
      } catch (error) {
        console.log(error)
      }
    };
    if (projectId) getInfoProject();
  }, [projectId]);

  // Función para manejar cambios en el modal
  const handleModalChange = e => {
    setSelectedTask({
      ...selectedTask,
      [e.target.name]: e.target.value
    });
  };

    // Función para cerrar el modal y limpiar la tarea seleccionada
    const handleCloseModal = () => {
      setSelectedTask(null);
      setShow(false);
    };

  // Función para actualizar la tarea
  const handleUpdate = async e => {
    e.preventDefault();
    try {
      
      const res = await fetch(CONFIGURACIONES.BASEURL+`/task/newTask`,{
        method:'POST',
        headers:{
            "Content-Type": "application/json",
            "x-access-token": cookies.get("x-access-user"),
        },
        body:JSON.stringify(selectedTask)
      })
      const json = await res.json()
      console.log(json)
      handleCloseModal();
    } catch (error) {
      console.log(error);
    }
  };

  //Funcion de aceptar o rechasar invitacion
  const handleAccept = (e) => {
    setNotiDefine(e.target.textContent)
  }

  //Funicion invitacion Datos
  const handleChangeInvitation = (e) =>{
    const name = e.target.name;
    const value = e.target.value;
    setInvitation({
      ...invitation,
      [name]:value
    })
  }

  // Funcion invitacion
  // "content-type":"application/json",
  // "x-access-token" : 'x-access-user'
  //  body:invitation
  const enviarIn = async e =>{
    e.preventDefault();
    var message = ''
    try{
      const respuesta = await fetch(CONFIGURACIONES.BASEURL+'/invitation', {
        method: "post",
        headers: {
          'content-type': "application/json",
          'x-access-token': cookies.get('x-access-user')
        },
        body: JSON.stringify(invitation)
      })
      const json = await respuesta.json()
      message = json.message;
      console.log(json)
    }catch(err){
      console.log(err)
    }
    finally{
      Swal.fire({
        icon: (message !== 'ok')?"error":"success",
        title: "Info",
        text:(message !== 'ok')?"Ah Ocurrido un error":"Se envió correctamente la invitacion"
      }); 
    }
  }

    // Función para manejar la visibilidad del modal de notificaciones
    const toggleNotificationsModal = () => {
      setShowNotifications(!showNotifications);
    };


  
  return (
    <div className="flex pt-10 bg-white shadow-lg justify-around flex-col h-18 w-full justify-items-center items-center flex-wrap md:flex-nowrap">
      <div className="flex w-full justify-between h-20 pr-30 pl-28 relative">
        <div className="flex flex-row items-center">
          {projecData ? (
            <FaRegFolderOpen className="w-[20%] text-2xl mx-4" />
          ) : (
            <BiSolidUser className="w-[20%] text-2xl" />
          )}
          <h1 className="flex items-center text-3xl font-bold md:text-2xl w-[80%]">
            {projecData
              ? projecData.nameProject
              : user
              ? user.name
                ? user.name.toUpperCase() + " " + user.lastName.toUpperCase()
                : ""
              : ""}
          </h1>
        </div>
        <div className="flex justify-center justify-items-center flex-col w-[20%]">
          <h1 className="text-3xl font-bold md:text-2xl">
            {projecData
              ? projecData.status
                ? projecData.status
                : "------"
              : "------"}
          </h1>
          <h3 className="">Estado</h3>
        </div>
        <div className="flex justify-center justify-items-center flex-col w-[20%]">
          <h1 className="text-3xl font-bold md:text-2xl">
            {projecData
              ? projecData.started
                ? projecData.started
                : "--/--/--"
              : "--/--/--"}
          </h1>
          <h3>inicio</h3>
        </div>
        <div className="flex justify-center justify-items-center flex-col w-[20%]">
          <h1 className="text-3xl font-bold md:text-2xl">
            {projecData
              ? projecData.finished
                ? projecData.finished
                : "--/--/--"
              : "--/--/--"}
          </h1>
          <h3>Finalizado</h3>
        </div>
        <div id="notificaciones" className="absolute top-0 right-0 mr-8 ">
          {(!invitations)?<IoIosNotificationsOutline className="text-4xl cursor-pointer" onClick={toggleNotificationsModal} />:<MdNotificationsActive  className="text-4xl cursor-pointer font-red-500" onClick={toggleNotificationsModal}/>}
        </div>
      </div>

      {showNotifications && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm transition-all duration-1000">
          <div className="bg-white h-[65%] m-auto w-[50%] max-h-[80%] overflow-y-auto shadow-2xl rounded-2xl p-8">
            <div className="sticky flex justify-end">
              <button className="hover:bg-blue-500 hover:text-white text-white p-2 rounded-full" onClick={getNotifications} >
                <IoReload  className="font-bold text-2xl text-black" />
              </button>
              <button onClick={toggleNotificationsModal} className="hover:bg-red-500 text-white p-2 rounded-full">
                <GrClose className="font-bold text-2xl text-black" />
              </button>
            </div>
            <h2 className="text-3xl font-bold mb-6">Notificaciones</h2>
            <form onSubmit={(e)=>{
              e.preventDefault();
              console.log(notiDefine)
            }}>
              <div className="flex flex-col gap-4">
                {(!invitations)?<p>Sin Notificaciones</p>:invitations.map(invitation => (
                  <div key={invitation.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                    <p className="text-lg font-semibold">{invitation.idPropietary.name} Te ah invitado a unirte a {invitation.idWorkSpace.workSpaceName}</p>
                    <div className="flex gap-2">
                      <button onClick={handleAccept} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Aceptar</button>
                      <button onClick={handleAccept} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Rechazar</button>
                    </div>
                  </div>
                ))}
              </div>
            </form>
          </div>
        </div>
      )}

      

      <div className=" pr-12 flex w-full h-[10%] justify-between items-center">
        <Header />
        <div className="flex w-[30%] justify-around ">
          <button
            onClick={() => setVer(!ver)}
            className="  bg-blue-500 w-40 hover:bg-blue-600 h-10 font-bold text-white rounded-xl">
            Invitar Usuario
          </button>
          <button
            onClick={() => setShow(!show)}
            className="  bg-blue-500 w-40 hover:bg-blue-600 h-10 font-bold text-white rounded-xl">
            Agregar Tarea
          </button>
        </div>
      </div>

      <MigaPan />

      {show && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm transition-all duration-1000">
          <div
            id="Contenedor"
            className={`bg-white h-[65%] m-auto w-[50%] shadow-2xl rounded-2xl p-8 ${
              show ? "" : "hidden"
            }`}
          >
            <div className="flex justify-end">
              <button
                onClick={() => setShow(!show)}
                className="hover:bg-red-500 text-white p-2 rounded-full"
              >
                <GrClose className="font-bold text-2xl text-black" />
              </button>
            </div>
            <h2 className="text-3xl font-bold mb-6">Agregar Tarea</h2>

            <TaskForm
              handleChange={handleModalChange}
              method={handleUpdate}
              values={selectedTask}
            />
          </div>
        </div>
      )}

      {ver && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm transition-all duration-1000">
          <div
            id="ModalInvitarUsuario"
            className={`bg-white h-[40%] m-auto w-[50%] shadow-2xl rounded-2xl p-8 ${
              ver ? "" : "hidden"
            }`}
          >
            <div className="flex justify-end">
              <button
                onClick={() => setVer(!ver)}
                className="hover:bg-red-500 text-white p-2 rounded-full"
              >
                <GrClose className="font-bold text-2xl text-black" />
              </button>
            </div>
            <h2 className="text-3xl font-bold mb-6">Invitar Usuario</h2>
            <form className="flex flex-col space-y-4" onSubmit={enviarIn}>
              <div>
                <label htmlFor="email" className="text-lg font-semibold">Correo Electrónico:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  // value={email}
                  // onChange={handleEmailChange}
                  className="border ml-5 mb-3 w-[70%] border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                  onChange={handleChangeInvitation}
                />
              </div>
              <div className="">
                <select name="workSpace" id="workSpace" onChange={handleChangeInvitation}>
                  <option value="" default>Elija una opcion</option>
                  {
                    workSpace.map((name,key)=>{
                      if(user._id === name.propetaryUser)return(<option value={name._id} key={key}>{name.workSpaceName}</option>)
                    })
                  }
                </select>
              </div>
              <button
                // onClick={handleSendRequest}
                className="bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition duration-300 w-[20%]"
              >
                Enviar invitacion
              </button>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}

export default Contenido;
