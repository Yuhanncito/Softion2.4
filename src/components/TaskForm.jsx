import { useEffect } from "react";
import { useUserContext } from "../context/UseContext";
import { FaArrowRight } from "react-icons/fa";

const TaskForm = ({tarea, method, handleChange, values, userSets}) => {
  const {projectId} = useUserContext();

  if(!projectId) return null

  const idTaks = (tarea) =>{
    if(!tarea) return null
    return <input type="hidden" name="id" value={tarea._id} />
  }

  useEffect(() => {
    console.log(projectId)
  })

  return (



        <form onSubmit={method} className="w-full">
          {idTaks(tarea)}
          <div className="mb-4">
            <input
              type="text"
              id="taskName"
              name="nameTask"
              value={(!tarea)?((!values)?"":values.nameTask):tarea.nameTask}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500 text-3xl font-bold mb-6"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="hours"
              className="block text-sm font-medium text-gray-600"
            >
              Horas para terminar:
            </label>
            <input
              type="number"
              id="hours"
              name="timeHoursTaks"
              value={(!tarea)?((!values)?"":values.timeHoursTaks):tarea.timeHoursTaks}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="assignees"
              className="block text-sm font-medium text-gray-600"
            >
              Encargados:
            </label>
            <div onClick={userSets} className="flex justify-between items-center cursor-pointer mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500">
              <p>Agregar encargados</p>
              <FaArrowRight />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-600"
            >
              Descripción:
            </label>
            <textarea
              id="description"
              name="descriptionTask"
              value={(!tarea)?((!values)?"":values.descriptionTask):tarea.descriptionTask}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-600"
            >
              Estado:
            </label>
            <select
              id="status"
              name="status"
              value={(!tarea)?((!values)?"":values.status):tarea.status}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Iniciado">Iniciado</option>
              <option value="Concluido">Concluido</option>
              {/* Agrega más opciones según tus necesidades */}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Guardar Cambios
          </button>
        </form>
  );
};

export default TaskForm;


