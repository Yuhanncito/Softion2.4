import { useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { useUserContext } from "../context/UseContext";
import SearchButton from "./SearchButton";

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
import { MdDelete } from "react-icons/md";
import { CONFIGURACIONES } from "../configs/confing";





const Sidebar = () => {
  const {setProjectId} = useUserContext();
  const navigate = useNavigate();
  const [ShowMenu, setShowMenu] = useState(false);
  const [showItems,setShowItems] = useState(true);
  const Menus = ['cerrar sesion'];
  const [Open,setOpen] = useState(false);
  const clases = document.getElementById('engranaje');
  const [isopen,setIsopen] = useState(false);
  const [project,setProject] = useState([]);
  const [searchProject, setSearchProject] = useState([])
  const [search, setSearch] = useState('');
  const [newProject, setNewProject] =  useState('');
  const [isSelect, setIsSelect] =  useState(false);

  
 

  const girar=()=>{
    setOpen(!Open)
    if (clases.classList.contains('rotate-90')){
      clases.classList.remove('rotate-90');
    }
    else{
      clases.classList.add('rotate-90')
    }
  }

  const cerrarSesion= async ()=>{
     cookies.remove("x-access-user")
     navigate("/")
  }



  
  const ocularCosas=()=>{
    setShowItems(!showItems)
    //ShowMenu?document.body.style.overflow='hidden':document.body.style.
    const lista = document.getElementById('hidden');
    showItems ? lista.style.display="none" : lista.style.display="block"
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

  const handleSubmitProject = async (e) =>{
      
      
      const resp = await fetch(CONFIGURACIONES.BASEURL+"/projects",{
        headers:{
          "Content-Type":"application/json",
          "x-access-token":cookies.get("x-access-user")
        },
        method:"POST",
        body:JSON.stringify({"nameProject":newProject})
      })
      console.log(resp)
      const parse = await resp.json();

      console.log(parse)
      
    }

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
            idProject:formulario.get('id')
          })
        })
        const parse = await response.json();
        if(parse.message !== "ok") e.preventDefault();
         
      } catch (error) {
        console.log(error)
      }
      
    }



    useEffect(() => {
      const getData = async() =>{
        const datos = await fetch(CONFIGURACIONES.BASEURL+'/projects',{
          headers:{
            "Content-Type":"application/json",
            "x-access-token":cookies.get("x-access-user")
          },
          method:"GET"
        })
        const parse = await datos.json();
        setProject(parse)
        setSearchProject(parse)
        console.log(parse)
      }
      getData()
    }, [])
    

  return (
    <>
    <div className={`bg-primary-900 h-full fixed lg:static w-[80%] md:w-[40%] lg:w-full transition-all duration-300 ${ShowMenu ? "left-0" : "-left-full"}`}> 
      {/* Profile */}
        <div className='flex flex-col items-center justify-center p-8 gap-2 h-[30vh]'>
          <img src="/public/imagenes/Imagen1.ico" className='w-20 h-20 object-cover'/>
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

            <div className=' flex items-center w-[100%]  flex-row  gap-4 text-white  p-2  transition-colors hover:bg-primary-900/50 rounded-xl'>
              <div className="hover:bg-primary-900/50 flex items-center  rounded-xl justify-around w-[80%] h-[100%]">
                <button onClick={ocularCosas} className="flex px-4 justify-center items-center">
                  {(showItems)?<IoIosArrowDown />: <IoIosArrowForward />}
                    <FaFolderOpen className=" mx-1" />Proyectos
                </button>
              </div>
              <button onClick={()=>{setIsopen(true)}}  className=" hover:bg-primary-900/50 flex items-center py-2 px-2 rounded-xl justify-around ">
                  <IoMdAdd />
              </button>
              {
                isopen &&(
                      <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center ">
                        <form onSubmit={handleSubmitProject} className="bg-white p-5 rounded flex flex-col justify-center items-center gap-5">
                            <div className="flex flex-col h-[100%] w-[100%] justify-around justify-items-center items-center flex-wrap md:flex-nowrap ml-4">
                              <label className=" text-black">
                               Escribe el nombre del proyecto
                              </label>
                                <input name="nameProject" id="nameProject" onChange={(e)=>{setNewProject(e.target.value)}} type="text" className="w-64 px-4 border-2 border-gray-300 rounded-lg text-black focus:outline-none focus:border-indigo-500 duration-200" placeholder=" " />
                                <div className="flex gap-4 mt-3">
                                    <button className="flex bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={()=>setIsopen(false)}>Cancelar</button>
                                    <button className="flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Crear Proyecto</button>
                                </div>
                            </div>
                        </form>
                    </div>
                )
            }
            </div>
            <div id="hidden">
            {searchProject.map((p, index) => (
              <div className=" w-full flex flex-row justify-between rounded-lg hover:bg-primary-900/50">
                <button key={index} onClick={()=>{setProjectId(p._id)}} className='flex flex-row w-[90%] items-center gap-4 text-white py-2 px-6 rounded-xl hover:bg-primary-900/50 transition-colors'> 
                 <RiCheckboxMultipleBlankLine className=" w-[20%] "/>
                 <span className=" w-[80%]">{p.nameProject}</span>
                </button>
                <form onSubmit={handleDeleteProject} className=" flex  rounded-xl hover:bg-primary-900/50">
                  <input type="hidden" name="id" value={p._id} />
                  <button className=" py-2 px-6 h-full w-full">
                   <MdDelete className="text-red-500" />
                  </button>
                </form>
              </div>
            ))}
            </div>
            <form onSubmit={handleSubmitProject} className="w-56 m-auto flex flex-col">
              <input onChange={(e)=>{setNewProject(e.target.value)}} type="text" name="nameProject" id="nameProject" className="text-center bg-transparent hover:bg-gray-500/10 text-white" placeholder="+" />
            </form>
          </nav>
          <div className="content-end">  
          {Open &&(
              <div className="bg-white w-30 h-7 shadow-lg absolute flex justify-center items-center top-5 left-12">
                <ul className="list-none list-inside">
                  {
                    Menus.map((menu)=>(
                      <li className="p-2 text-lg  cursor-pointer hover:text-blue-500 text-center" onClick={()=>cerrarSesion()} key={menu}>{menu}</li>
                      ))
                  }
                </ul>
              </div>
            )}
            <button id="rot" onClick={()=>setOpen(!Open)} className='text-white p-4 text-xl absolute top-0 left-0'  style={{top: '10px'}}>
              <FaGear id="engranaje" className={(Open?' rotate-45 ':'')+ 'duration-300'}/>
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
