import { useState, useRef, useCallback, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PropTypes from 'prop-types'; // Importar PropTypes
import { useUserContext } from '../context/UseContext';
import { CONFIGURACIONES } from "../configs/confing";
import Cookies from "universal-cookie";
import TaskForm from "../components/TaskForm";
import { GrClose } from "react-icons/gr";


function Canva() {
  const cookies = new Cookies();
  const {tareas, setTareas, projectId } = useUserContext();
  const [show, setShow] = useState(false)
  const [tasks, setTasks] = useState([
  ]);
  const [selectedTask, setSelectedTask] = useState({
    nameTask:'',
    descriptionTask:'',
    userTasks:[],
    timeHoursTaks:'',
    projectRelation:'',
  })
  const handleOpenModal = task => {
    setSelectedTask(task);
    setShow(true);
  };
  const handleModalChange = e => {
    setSelectedTask({
      ...selectedTask,
      [e.target.name]: e.target.value
    });
  };
  const handleCloseModal = () => {
    setSelectedTask(null);
    setShow(false);
  };
  const updateStatus = async (id,newState) =>{
    try {
      const res = await fetch(CONFIGURACIONES.BASEURL+`/task/${id}`,{
        method:'PUT',
        headers:{
          "Content-Type": "application/json",
          "x-access-token": cookies.get("x-access-user"),
        },
        body:JSON.stringify({
          status:newState
        })
      })
      const json = await res.json()
      getTasks();
    } catch (error) {
      console.log(error)
    }
  }
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
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    getTasks();
    if(!tareas) return null
    setTasks(tareas);
  }, [projectId,tareas])
  

  const moveTask = useCallback((dragId, hoverIndex, newState) => {
    setTasks(prevTasks => {
      const dragIndex = prevTasks.findIndex(task => task._id === dragId);
      const dragTask = prevTasks[dragIndex];
      if (!dragTask) {
        console.error("Error: La tarea arrastrada no existe.");
        return [...prevTasks];
      }
      updateStatus(dragId,newState)
      const newTasks = tareas;
      return newTasks;
      
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-full">
        <Estado title="Pendiente" modal={handleOpenModal} tasks={tasks.filter(task => task.status === 'Pendiente')} moveTask={moveTask} />
        <Estado title="Iniciado" modal={handleOpenModal} tasks={tasks.filter(task => task.status === 'Iniciado')} moveTask={moveTask} />
        <Estado title="Concluido" modal={handleOpenModal} tasks={tasks.filter(task => task.status === 'Concluido')} moveTask={moveTask} />
      </div>

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
    </DndProvider>
  );
}

function Estado({ title, tasks, moveTask, modal }) {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: 'TASK',
    drop(item) {
      if (!ref.current) {
        return;
      }
      const hoverIndex = tasks.length; // Coloca la tarea al final de la lista del estado actual
      moveTask(item.id, hoverIndex, title);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });

  drop(ref);

  return (
    <div ref={ref} className="flex-1 p-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">{title}</h1>
      {tasks.map((task, index) => (
        <Task onClick={modal} key={task.id} task={task} index={index} moveTask={moveTask} />
      ))}
    </div>
  );
}

Estado.propTypes = {
  title: PropTypes.string.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    nameTask: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  })).isRequired,
  moveTask: PropTypes.func.isRequired,
};

function Task({ task, index, onClick }) {
  const ref = useRef(null);
  const [, drag] = useDrag({
    type: 'TASK',
    item: () => {
      return { id: task._id, index, status: task.status };
    },
  });

  drag(ref);

  return (
    <div onClick={()=>onClick(task)} ref={ref} className={'p-4 shadow-lg border-2 border-black/20 rounded mb-4 cursor-move hover:scale-105 transition-all duration-500'}>
      <p className="text-lg font-bold mb-2">{task.nameTask}</p>
      <p className="text-sm text-gray-500">Fecha: {task.date}</p>
      <p className="text-sm text-gray-500">Estado: {task.status}</p>
    </div>
  );
}

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  moveTask: PropTypes.func.isRequired,
};

export default Canva;
