import { useState, useEffect } from 'react';
import { useUserContext } from '../context/UseContext';
import { CONFIGURACIONES } from '../configs/confing';
import Cookies from 'universal-cookie';
import { GrClose } from "react-icons/gr";
import TaskForm from './TaskForm';


function List() {
  const { projectId } = useUserContext();
  const [Data, setData] = useState([]);
  const [NewTask, setTask] = useState({
    nameTask: ''
  });
  const [selectedTask, setSelectedTask] = useState(null); // Para manejar la tarea seleccionada
  const [modalOpen, setModalOpen] = useState(false); // Para controlar la apertura/cierre del modal
  const [show, setShow] = useState(false)


  const cookies = new Cookies();

  const getTasks = async () => {
    try {
      const response = await fetch(CONFIGURACIONES.BASEURL + '/task', {
        method: 'POST',
        headers: {
          'x-access-token': cookies.get('x-access-user'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectRelation: projectId
        }),
      });
      const parse = await response.json();
      setData(parse);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (projectId) getTasks();
  }, [projectId]);

  const handleChange = e => {
    setTask({
      ...NewTask,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await fetch(CONFIGURACIONES.BASEURL + '/task/newTask', {
        body: JSON.stringify({
          projectRelation: projectId,
          nameTask: NewTask.nameTask
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': cookies.get('x-access-user')
        }
      });
      const parse = await response.json();
      setTask({
        nameTask: ''
      });
      getTasks();
    } catch (error) {
      console.log(error);
    }
  };

   // Función para eliminar una tarea
   const handleDelete = async taskId => {
    try {
      await fetch(CONFIGURACIONES.BASEURL + `/task/${taskId}`, {
        method: 'DELETE',
        headers: {
          'x-access-token': cookies.get('x-access-user')
        }
      });
      getTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // Función para abrir el modal y establecer la tarea seleccionada
  const handleOpenModal = task => {
    setSelectedTask(task);
    setShow(true);
  };

  // Función para cerrar el modal y limpiar la tarea seleccionada
  const handleCloseModal = () => {
    setSelectedTask(null);
    setModalOpen(false);
  };

  // Función para manejar cambios en el modal
  const handleModalChange = e => {
    setSelectedTask({
      ...selectedTask,
      [e.target.name]: e.target.value
    });
  };

  // Función para actualizar la tarea
  const handleUpdate = async e => {
    e.preventDefault();
    try {
      // Agrega aquí la lógica para enviar la actualización al servidor
      // por ejemplo, un fetch con el método PUT
      // ...

      // Después de la actualización, cierra el modal y vuelve a obtener las tareas
      handleCloseModal();
      getTasks();
    } catch (error) {
      console.log(error);
    }
  };


  return (
 <div className="flex-col h-full">
      <div className="flex flex-col w-[100%] h-[calc(100%-10%)] p-5">
        {Data &&
          Data.map((task, index) => (
            <div key={index} className="w-full flex flex-row hover:bg-gray-500/50 border-b-2 transition-colors duration-75">
              <div className="w-[35%] py-2 px-5 cursor-pointer" onClick={()=>handleOpenModal(task)}>
                <p className="hover:bg-gray-300 py-1 px-5 rounded-md bg-transparent w-full focus:outline-none focus:bg-gray-200">{task.nameTask}</p>
              </div>
              <div className="w-[20%] border-6 border-red-500">
                {/* Botón para eliminar tarea */}
                <button onClick={() => handleDelete(task.id)} className="text-red-500 hover:text-red-700">Eliminar</button>
              </div>
              <div className="w-[20%]">
                {/* Botón para abrir modal de edición */}
                <button onClick={()=>handleOpenModal(task)}>Editar</button>
              </div>
              <div className="w-[25%]"></div>

              {
                show &&(    
                  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm transition-all duration-1000">
                  <div id='Contenedor' className={`bg-white h-[65%] m-auto w-[50%] shadow-2xl rounded-2xl p-8 ${show ? '' : 'hidden'}`}>
                    <div className="flex justify-end">
                      <button onClick={() => setShow(!show)} className="hover:bg-red-500 text-white p-2 rounded-full">
                        <GrClose className="font-bold text-2xl text-black" />
                      </button>
                    </div>

                    <TaskForm handleChange={handleModalChange} tarea = {selectedTask} method={handleUpdate} />

                  </div>
                </div>)
              }

            </div>
          ))}

        <div className="w-full flex flex-row hover:bg-gray-500/50 border-b-2 transition-colors duration-75">
          <div className="w-[35%] py-2 px-5 ">
            <form onSubmit={handleSubmit} className="w-full">
              <input
                onChange={handleChange}
                placeholder="Ingresa una nueva tarea"
                name="nameTask"
                className="hover:bg-gray-300 py-1 px-5 rounded-md bg-transparent w-full focus:outline-none focus:bg-gray-200"
                type="text"
                id=""
                value={NewTask.nameTask}
              />
            </form>
          </div>
          <div className="w-[20%] border-6 border-red-500"></div>
          <div className="w-[20%]"></div>
          <div className="w-[25%]"></div>
        </div>
      </div>

    </div>
  );
}
export default List;
