import { useState, useEffect } from 'react';
import { useUserContext } from '../context/UseContext';
import { CONFIGURACIONES } from '../configs/confing';
import Cookies from 'universal-cookie';
import { GrClose } from "react-icons/gr";
import TaskForm from './TaskForm';
import { MdDelete } from "react-icons/md";



function List() {
  const { projectId, tareas, setTareas } = useUserContext();
  const [Data, setData] = useState([]);
  const [NewTask, setTask] = useState({
    nameTask: ''
  });
  const [selectedTask, setSelectedTask] = useState({
    nameTask:'',
    descriptionTask:'',
    userTasks:[],
    timeHoursTaks:'',
    projectRelation:'',
  }) // Para manejar la tarea seleccionada
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
      setTareas(parse)
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
      await fetch(CONFIGURACIONES.BASEURL + '/task/newTask', {
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
      getTasks();
    } catch (error) {
      console.log(error);
    }
  };

   // Función para eliminar una tarea
   const handleDelete = async taskId => {
    try {
      const res = await fetch(CONFIGURACIONES.BASEURL +`/task/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': cookies.get('x-access-user')
        }
      });
      console.log(res)
      const json = await res.json();
      console.log(json)
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
    setShow(false);
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
      // Después de la actualización, cierra el modal y vuelve a obtener las tareas
      const Formulario = new FormData(e.target)
      const id = Formulario.get('id')
      const res = await fetch(CONFIGURACIONES.BASEURL+`/task/${id}`,{
        method:'PUT',
        headers:{
            "Content-Type": "application/json",
            "x-access-token": cookies.get("x-access-user"),
        },
        body:JSON.stringify(selectedTask)
      })
      handleCloseModal();
      getTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // Función para mostrar los responsables de la tarea
  const mostrarResponsables = (responsables) => {
    if (!responsables || responsables.length === 0) return <p>No hay responsables asignados</p>;
    return (
      <select className="py-1 px-2 rounded-md">
        {responsables.map((responsable, index) => (
          <option key={index} value={responsable}>{responsable}</option>
        ))}
      </select>
    );
  };

  const mostrarHoras = horas =>{
    if(!horas || horas === '0') return <p>No se han asignado horas</p>
    return <p>{horas} horas</p>
  }

  return (
 <div className="flex-col h-full">
      <div className="flex flex-col w-[100%] h-[calc(100%-10%)] p-5">
        {Data &&
          Data.map((task, index) => (
            <div key={index} className="w-full flex flex-row hover:bg-gray-500/50 border-b-2 transition-colors duration-75">
              <div className="w-[35%] py-2 px-5 cursor-pointer flex items-center">
                {/* Botón para eliminar tarea */}
                <MdDelete onClick={() => handleDelete(task._id)} className="hover:text-red-600 mr-2 text-red-500" />
                {/* Botón para abrir modal de edición */}
                <p onClick={()=> handleOpenModal(task)}  className="hover:bg-gray-300 py-1 px-5 rounded-md bg-transparent w-full focus:outline-none focus:bg-gray-200">{task.nameTask}</p>
              </div>
              <div id='estado' className="w-[20%] py-2 px-5 flex items-center">
                {/* Botón para abrir modal de edición */}
                <p>{task.status}</p>
              </div>
              <div id='Responsables' className="w-[20%] py-2 px-5 flex items-center">
                {/* Muestra los responsables de la tarea */}
                {mostrarResponsables(task.userTasks)}
              </div>
              <div id='time' className="w-[20%] py-2 px-5 flex items-center">
                {/* Muestra el tiempo de la tarea */}
                {mostrarHoras(task.timeHoursTaks)}
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

                    <TaskForm handleChange={handleModalChange} tarea = {selectedTask} method={handleUpdate} values ={selectedTask} />

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


