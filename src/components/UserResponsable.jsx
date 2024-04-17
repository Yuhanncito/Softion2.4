import { useEffect, useState } from "react";
import { useUserContext } from "../context/UseContext";
import { FaLongArrowAltLeft } from "react-icons/fa";

function UserResponsable({ userSets, works, task }) {
    const { projectId } = useUserContext();
    const [idWork, setWork] = useState(null);
    const [participantes, setParticipantes] = useState([]);

    useEffect(() => {
        let foundProject = false;
        for (const work of works) {
            for (const project of work.projects) {
                if (project._id === projectId) {
                    setWork(work._id);
                    setParticipantes(work.participates);
                    foundProject = true;
                    break;
                }
            }
            if (foundProject) {
                break;
            }
        }
        if (!foundProject) {
            console.log("Proyecto no encontrado");
            return;
        }
    }, []);

    const handleChange = (e) =>{
      const {checked,value} = e.target
      if(checked){
        task.userTasks.push(value)
      }
      else{
        const index = task.userTasks.indexOf(value);
        if(index !== -1){
          task.userTasks.splice(index, 1);
        }
      }

      console.log(task)
    }

    return (
        <div className=" rounded p-4">
            <button
                onClick={userSets}
                className="flex items-center px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-4"
            >
                <FaLongArrowAltLeft className="mr-2 transform transition duration-300 hover:scale-110" />
                <span className="text-sm font-medium">Volver</span>
            </button>

            <ul className="divide-y divide-gray-200">
              {participantes.map((p, index) => (
              index % 3 === 0 && (
              <div key={index / 3} className="flex flex-wrap">
                  {participantes.slice(index, index + 3).map((participant, innerIndex) => (
                      <li key={innerIndex} className="w-full">
                      <label className="w-full justify-evenly sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 flex items-center space-x-2 text-base font-medium text-blue-700 border border-gray-200 rounded px-3 py-2">
                          <input value={participant.user._id} onChange={handleChange} id={innerIndex} type="checkbox" className="form-checkbox rounded" />
                          {
                            participant.user.name.length > 8 ?
                              participant.user.name.substring(0, 5) + ' ...' : participant.user.name.includes(" ") && participant.user.name.indexOf(" ") < 8 ? participant.user.name.substring(0, participant.user.name.indexOf(" ")) : participant.user.name
                          }
                      </label>
                      </li>                  
                  ))}
              </div>
                      )
                  ))}
            </ul>

        </div>
    );
}

export default UserResponsable;
