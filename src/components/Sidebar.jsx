import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useUserContext } from "../context/UseContext";
import SearchButton from "./SearchButton";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";


const cookies = new Cookies();

//icons
import { RiCheckboxMultipleBlankLine } from "react-icons/ri";
import { FaGear } from "react-icons/fa6";
import { CiMenuBurger } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { FaFolderOpen } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { CONFIGURACIONES } from "../configs/confing";
import ProjectItem from "./ProjectItem";





const Sidebar = () => {
  const {setProjectId} = useUserContext();
  const navigate = useNavigate();
  const [ShowMenu, setShowMenu] = useState(false);
  const [showWorkspace,setShowWorkspace] = useState(true);
  const Menus = ['cerrar sesion'];
  const [Open,setOpen] = useState(false);
  const [project,setProject] = useState([]);
  const [workspace,setWorkspace] = useState([]);
  const [searchProject, setSearchProject] = useState([])
  const [search, setSearch] = useState('');
  const [newProject, setNewProject] =  useState('');


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
    console.log(resp);
    const parse = await resp.json();
    console.log(parse);
    getData();
    setNewProject('');
  };

    const  handleDeleteProject = async (e) => {
      try {
        const formulario = new FormData(e.target)
        const response = await fetch(CONFIGURACIONES.BASEURL+"/projects/delete",{
          headers:{
            'Content-Type':'application/json',
            'x-access-token':cookies.get("x-access-user")
          },
          method:'DELETE',
          body:JSON.stringify({
            idProject:formulario.get('id'),
            workSpaceid:formulario.get('idWorkSpace')
          })
        })
        const parse = await response.json();
        if(parse.message !== "ok") e.preventDefault();
         
      } catch (error) {
        console.log(error)
      }
      
    }

    const getData = async() =>{
      const datos = await fetch(CONFIGURACIONES.BASEURL+'/projects',{
        headers:{
          "Content-Type":"application/json",
          "x-access-token":cookies.get("x-access-user")
        },
        method:"GET"
      })

      const datos2 = await fetch(CONFIGURACIONES.BASEURL+'/workspace',{
        headers:{
          "Content-Type":"application/json",
          "x-access-token":cookies.get("x-access-user")
        },
        method:"GET"
      })

      const parse = await datos.json();
      const parse2 = await datos2.json();

      setProject(parse)
      setSearchProject(parse)
      setWorkspace(parse2)
      console.log("proyectos",parse)
      console.log("trabajos",parse2)
    }

    useEffect(() => {
      
      getData()
    }, [])


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
  
    

  return (
    <>
    <div className={`bg-primary-900 h-full fixed lg:static w-[80%] md:w-[40%] lg:w-full transition-all duration-300 ${ShowMenu ? "left-0" : "-left-full"}`}> 
      {/* Profile */}
        <div className='flex flex-col items-center justify-center p-8 gap-2 h-[30vh]'>
          <img src="/imagenes/Imagen1.ico" className='w-20 h-20 object-cover'/>
          <h1 className='text-xl text-white font-bold'>SoftionPro</h1>
        </div>
      {/* Nav */}
      <div className='bg-primary-100 p-8 rounded-tr-[100px] h-[70vh] overflow-y-scroll flex flex-col justify-between gap-8' style={{ scrollbarWidth: 'thin', scrollbarColor: 'grey transparent' }}>
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

            <a href="/App" className='flex items-center gap-4 text-white py-2 px-4 rounded-xl hover:bg-primary-900/50 transition-colors'> 
              <FaHome />Inicio
            </a>

            <div className="flex w-full py-4 ">
              <div className="flex w-full flex-col items-center">
                <div onClick={()=>{setShowWorkspace(!showWorkspace)}} className="flex hover:bg-primary-900/50 w-full cursor-pointer p-7 rounded-lg  text-white py-2 items-center">
                  <IoIosArrowForward className={((showWorkspace)?"":" rotate-90")+" transition-all flex mr-2"}/>
                  <h1 className="">Areas de trabajo</h1>
                </div>


                <div className={((showWorkspace)?"hidden ":"")+"flex flex-col w-full text-white" }>
                  {workspace.map((w, index) => (
                    <div className="mb-4" key={index}>
                      <div
                        onClick={(e) => {
                          hiddenItems(e, w._id, index);
                          handleWorkspaceClick(index);
                        }}
                        className="flex rounded-lg items-center cursor-pointer pl-12 py-2 hover:bg-primary-900/50"
                      >
                        <IoIosArrowForward
                          id="rotateItem"
                          className={`transition-all flex mr-2 ${visibleWorkspaces[index] ? '' : 'rotate-90'}`}
                        />
                        <h1>{w.workSpaceName}</h1>
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
                          <div className="flex flex-col w-full text-white">
                            {w.projects.map((project, projectIndex) => (
                              <div
                                key={projectIndex}
                                style={{ marginBottom: '10px' }}>
                                <ProjectItem
                                  context={setProjectId}
                                  workSpaceid={w._id}
                                  action={handleDeleteProject}
                                  name={project.nameProject}
                                  id={project._id}
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-white text-center">No hay proyectos para mostrar</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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