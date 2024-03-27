import { MdDelete } from "react-icons/md";

function ProjectItem({context,workSpaceid, name, id, action}) {    
  return (
    <div className="flex justify-between">
        <div onClick={()=>context(id)} className="cursor-pointer flex justify-around rounded-lg py-2 items-center hover:bg-primary-900/50 w-[100%] overflow-hidden">
            <h1>{name}</h1>
        </div>   
        <form onSubmit={action} className="ml-2">
            <input type="hidden" name="id" value={id}/>
            <input type="hidden" name="idWorkSpace" value={workSpaceid} />
            <button className='flex justify-center items-center text-red-500 py-2 px-4 hover:bg-red-500 rounded-lg hover:text-white pt-3'><MdDelete /></button>
        </form>
    </div>
    
  )
}
export default ProjectItem