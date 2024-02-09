import { CiSearch } from "react-icons/ci";
import { useState } from "react";


export default function SearchButton(element) {

  const [select, setSelect] = useState(0);
  const [select2, setSelect2] = useState(0);
 

  return (
    <form onSubmit={element.handleSubmit} className="  w-56 m-auto flex flex-col">
      <div className="flex bg-white py-2 px-4  rounded-lg">
        <input type="text" name="search" id="search" onChange={element.onChange} className=" focus:outline-none" placeholder="Buscar Proyecto"/>
        <button className="mx-1">
          <CiSearch />
        </button>
      </div>
      <div className="flex justify-between py-2">
        <select name="dateFiltrate" id="dateFiltrate" onChange={(e)=>{
          setSelect2(e.target.value);
        }} className={((select2>0)?'':'bg-gray-400')+" rounded-sm px-5"}>
          <option value="0">Todos</option>
          <option value="1">Recientes</option>
        </select>
        <select name="dateFiltrate" id="dateFiltrate" onChange={(e)=>{
          setSelect(e.target.value);
        }} className={((select>0)?'':'bg-gray-400')+" rounded-sm ml-1"}>
          <option value="0">Todos</option>
          <option value="1">Recientes</option>
        </select>
      </div>
    </form>
  )
}
