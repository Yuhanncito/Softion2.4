//import Cookies from 'universal-cookie';
//const cookies = new Cookies();
//const usuario = cookies.get('usuario');

//icons
import { TbMenuDeep } from "react-icons/tb";


import { NavLink } from "react-router-dom"


const header = () => {

/*
  const checar = () =>{
    console.log(usuario);
  }

  checar();*/

  return (
   /* <div>
      <h1 className="text-3xl font-bold">Bienvenido <span className="text-primary-100">{usuario.nombre}</span> </h1>
    </div>
  */
 
    <div className="flex w-[60%] p-5">
      <NavLink to={"/List"}  className="text-white text-lg font-bold bg-blue-500 p-1 rounded-md hover:bg-blue-700 w-36 justify-center justify-items-center flex mx-4 "><TbMenuDeep className="skew-y-[180deg]  mx-1 m-auto"/>List</NavLink>
      <NavLink to={"/Gantt"} className="text-white text-lg font-bold bg-blue-500 p-1 rounded-md hover:bg-blue-700 w-36 justify-center justify-items-center flex mx-4"><TbMenuDeep className="scale-x-[-1] mx-1 m-auto" />Gantt</NavLink>
      <NavLink to={"/Canva"} className="text-white text-lg font-bold bg-blue-500 p-1 rounded-md hover:bg-blue-700 w-36 justify-center justify-items-center flex mx-4"><TbMenuDeep className="scale-x-[-1] mx-1 m-auto" />Canva</NavLink>
    </div>
  )
}

export default header
