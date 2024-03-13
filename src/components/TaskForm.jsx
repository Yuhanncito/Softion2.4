
const TaskForm = ({tarea, method, handleChange}) => {


  return (

        <form onSubmit={method} className="w-full">
          <div className="mb-4">

            <input
              type="text"
              id="taskName"
              name="nameTask"
              value={(!tarea)?"":tarea.nameTask}
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
              name="hours"
              value={(!tarea)?"":tarea.timeHoursTaks}
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
            <input
              type="text"
              id="assignees"
              name="assignees"
              value={''}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            />
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
              name="description"
              value={(!tarea)?"":tarea.descriptionTask}
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
              value={(!tarea)?"":tarea.status}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="pendiente">Pendiente</option>
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
