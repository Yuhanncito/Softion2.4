import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useUserContext } from "../context/UseContext";
import SearchButton from "./SearchButton";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2'
import { MdEdit } from "react-icons/md";



const cookies = new Cookies();

//icons
import { FaGear } from "react-icons/fa6";
import { CiMenuBurger } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { CONFIGURACIONES } from "../configs/confing";
import { IoReload } from "react-icons/io5";


// Items
import ProjectItem from "./ProjectItem";





const Sidebar = ({isLoading, workSpace}) => {
  
  const {setProjectId} = useUserContext();
  const navigate = useNavigate();
  const [ShowMenu, setShowMenu] = useState(false);
  const [showWorkspace,setShowWorkspace] = useState(true);
  const Menus = ['cerrar sesion'];
  const [Open,setOpen] = useState(false);
  const [project,setProject] = useState([]);
  const [searchProject, setSearchProject] = useState([])
  const [search, setSearch] = useState('');
  const [newProject, setNewProject] =  useState('');
  const queryClient = useQueryClient();
  

  const [visibleWorkspaces, setVisibleWorkspaces] = useState([]);
  

  const cerrarSesion= async ()=>{
     cookies.remove("x-access-user")
     navigate("/")
  }

  const searchSubmit = (e) =>{
    e.preventDefault();
    console.log(search);
    if(search===''){
      setSearchProject(project)
    }
    else{
      const filtro = project.filter(proyectos => proyectos.nameProject === search)
      console.log(filtro)
      setSearchProject(filtro)
    }
  }


  const handleChange = (e) => {
    setSearch(e.target.value)
  }

  const handleSubmitProject = async (e, workSpaceId) => {
    e.preventDefault();
    let info = ''
    try {
      const formulario = new FormData(e.target);
      const resp = await fetch(CONFIGURACIONES.BASEURL + "/projects", {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": cookies.get("x-access-user"),
        },
        method: "POST",
        body: JSON.stringify({
          nameProject: newProject,
          workspaceid: workSpaceId,  // Usa el workSpaceId recibido
        }),
      });
      const parse = await resp.json();
      info = parse
      queryClient.invalidateQueries('workspaces')
      setNewProject('');
    } catch (error) {
      console.log(error)
    }finally{
      if(info.message !== 'ok')
      Swal.fire({
        icon:"error",
        title: "Info",
        text: info.message
      }); 
    }
  };

  const handleDeleteProject = async (e) => {
    e.preventDefault();
    let info = ''
    const formulario = new FormData(e.target);
    const idProject = formulario.get('id');
    const workSpaceId = formulario.get('idWorkSpace'); // Asegúrate de que este campo exista en tu formulario
    try {
      
      const res = await fetch(`${CONFIGURACIONES.BASEURL}/projects/${idProject}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': cookies.get("x-access-user"),
        },
        body: JSON.stringify({
          workspaceid: workSpaceId,
        }),
      });
      const json = await res.json()
      info = json
      queryClient.invalidateQueries('workspaces')
    } catch (error) {
      console.log(error);
    }finally{
      if(info.message !== 'ok')
      Swal.fire({
        icon:"error",
        title: "Info",
        text: info.message
      }); 
    }
  };



    /*Pruebas Sid */

    const hiddenItems = (e, workspaceId, index) => {
      e.currentTarget.children[0].classList.toggle("rotate-90");
      e.currentTarget.classList.toggle("bg-primary-900/80");
      e.currentTarget.classList.toggle("hover:bg-primary-900/50");
      e.currentTarget.nextElementSibling.classList.toggle("hidden");
  
  
      // Alternar visibilidad para el espacio de trabajo clicado
      const updatedVisibleWorkspaces = [...visibleWorkspaces];
      updatedVisibleWorkspaces[index] = !updatedVisibleWorkspaces[index];
      setVisibleWorkspaces(updatedVisibleWorkspaces);
    };
  

    const handleWorkspaceClick = (workspaceId) => {
      // Ocultar todos los demás espacios de trabajo
      const updatedVisibleWorkspaces = visibleWorkspaces.map((_, index) => index === workspaceId);
      setVisibleWorkspaces(updatedVisibleWorkspaces);
    };
  
  //pruebas con React Query


  return (
    <>
    <div className={`bg-primary-900 h-full fixed lg:static w-[80%] md:w-[40%] lg:w-full transition-all duration-300 ${ShowMenu ? "left-0" : "-left-full"}`}> 
      {/* Profile */}
        <div className='flex flex-col items-center justify-center p-8 gap-2 h-[30vh]'>
          <img src="/imagenes/Imagen1.ico" className='w-20 h-20 object-cover'/>
          <h1 className='text-xl text-white font-bold'>SoftionPro</h1>
        </div>
      {/* Nav */}
      <div  className='bg-primary-100 p-8 rounded-tr-[100px] h-[calc(100%-30vh)]   flex flex-col justify-between gap-8 ' style={{ scrollbarWidth: 'thin', scrollbarColor: 'grey transparent' }}>
          <style>
            {`
              ::-webkit-scrollbar {
                width: 8px;
              }
              ::-webkit-scrollbar:hover {
                width: 25px;
              }
              ::-webkit-scrollbar-track {
                background: transparent;
              }
              ::-webkit-scrollbar-thumb {
                background-color: grey;
                border-radius: 20px;
                transition: width 0.5s;
              }
              ::-webkit-scrollbar-thumb:hover {
                background-color: darkgrey;
              }
              ::-webkit-scrollbar-button {
                display: none;
              }
            `}
          </style>
          <nav className="flex flex-col gap-7">
            <SearchButton  handleSubmit={searchSubmit} onChange={handleChange}  />

            <Link to="/App" className='flex items-center gap-4 text-white py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors'> 
              <FaHome />Inicio
            </Link>

            <div className="flex w-full py-4 ">
              <div className="flex w-full flex-col items-center">
                <div onClick={()=>{setShowWorkspace(!showWorkspace)}} className="flex hover:bg-primary-900/50 w-full cursor-pointer p-7 rounded-lg  text-white py-2 items-center">
                  <IoIosArrowForward className={((showWorkspace)?"":" rotate-90")+" transition-all flex mr-2"}/>
                  <h1 className="">Areas de trabajo</h1>
                </div>


                
                  {(isLoading)?<IoReload  className="font-bold text-2xl text-white animate-spin" />:
                    workSpace.map((w, index) => (
                    <div className={((showWorkspace)?"hidden ":"")+"flex flex-col w-full text-white" }>
                    <div className="mb-4" key={index}>
                      <div
                        onClick={(e) => {
                          hiddenItems(e, w._id, index);
                          handleWorkspaceClick(index);
                        }}
                        className="flex rounded-lg items-center cursor-pointer pl-12 py-2 hover:bg-primary-900/50 "
                      >
                        <IoIosArrowForward
                          id="rotateItem"
                          className={`transition-all flex mr-2 ${visibleWorkspaces[index] ? '' : 'rotate-90'}`}
                        />
                        <h1>{w.workSpaceName} de {w.propetaryUser.name} </h1>
                      </div>
                    <div className={`flex flex-col w-full text-white ${visibleWorkspaces[index] ? '' : 'hidden'}`}>
                      <form onSubmit={(e) => handleSubmitProject(e, w._id)} className="w-full m-auto flex flex-col">
                        <input type="hidden" name="id" value={w._id} />
                        <input
                          value={newProject}
                          onChange={(e) => setNewProject(e.target.value)}
                          type="text"
                          name="nameProject"
                          id="nameProject"
                          className="text-center bg-transparent hover:bg-gray-500/10 text-white py-2 focus:border-white focus:bg-primary-900/40"
                          placeholder="Agregar proyecto"
                        />
                      </form>
                        {w.projects.length > 0 ? (
                          <div className="flex flex-col w-full text-white bg">
                            {w.projects.map((project, projectIndex) => (
                              <div
                                key={projectIndex}
                                className='mb-[10px] w-full px-1 py-2 flex justify-between items-center'>
                                <ProjectItem
                                  context={setProjectId}
                                  workSpaceid={w._id}
                                  action={handleDeleteProject}
                                  name={project.nameProject}
                                  id={project._id}
                                />
                                
                                  <button className='flex justify-center items-center text-white-500 py-2 px-3 hover:bg-primary-900/50 rounded-lg hover:text-white pt-3'><MdEdit /></button>
                               
                              </div>

                            ))}
                          </div>
                        ) : (
                          <div className="text-white text-center">No hay proyectos para mostrar</div>
                        )}
                      </div>
                    </div>
                    </div>
                  ))}
                
              </div>
            </div>
          </nav>

        {/* CerrarSecion */}
        <div className="content-end">
          {Open && (
            <div className="bg-white w-36 h-auto shadow-lg absolute flex justify-center items-center top-5 left-12 rounded-md overflow-hidden">
              <ul className="list-none list-inside">
                {Menus.map((menu) => (
                  <li
                    className="p-2 text-lg cursor-pointer border-b border-gray-200 transition duration-300 hover:bg-gray-100 hover:text-blue-500 text-center" // Added hover:bg-gray-100 and hover:text-blue-500
                    onClick={() => cerrarSesion()}
                    key={menu}
                  >
                    {menu}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            id="rot"
            onClick={() => setOpen(!Open)}
            className="text-white p-4 text-xl absolute top-0 left-0"
            style={{ top: "10px" }}
          >
            <FaGear id="engranaje" className={(Open ? "rotate-45" : "") + " duration-300"} />
          </button>
        </div>

      </div>
    </div>
    {/*Button mobile */}
    <button onClick={() => setShowMenu(!ShowMenu)} className="lg:hidden fixed right-4 text-2xl top-4 text-black">
      {ShowMenu ? <IoCloseSharp /> : <CiMenuBurger />}
    </button>
    </>
  )
}

export default Sidebar