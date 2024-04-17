import { RiUser3Fill } from "react-icons/ri";
import { FaSave } from "react-icons/fa";
import { MdDelete } from "react-icons/md";



function ParticiparesForm({data, onChange, onSubmit}) {

  return (
    <form className="w-full py-5 my-5 px-2 shadow-xl border border-gray-300 flex items-center" onSubmit={onSubmit}>
        <input type="hidden" name="id" value={data.user._id} />
        <div className=" w-1/12 flex justify-evenly items-center">
          <MdDelete onClick={()=>alert('usuario eliminado')} className=" text-red-600 text-3xl"/>
        </div>
        <div className="flex w-11/12 border-l-2 justify-evenly items-center">
        <RiUser3Fill className=" w-1/12 text-3xl"/>
          <h1 className="w-2/12 overflow-hidden border-gray-300 border-2 rounded-md px-4 py-2">{data.user.name}</h1>
          <h1 className="w-4/12 overflow-hidden border-gray-300 border-2 rounded-md px-4 py-2">{data.user.email}</h1>
          
          <select  name="privileges" id="privileges" className="w-3/12 border-gray-300 border-2 rounded-md px-4 py-2" onChange={onChange}>
            <option value="">Privilegios</option>
            <option value="lectura" >Lectura</option>
            <option value="lectura y escritura">Lectura y Escritura</option>
          </select>
          <button className="w-1/12 text-3xl">
            <FaSave />
          </button>
        </div>
        
    </form>
  )
}

export default ParticiparesForm