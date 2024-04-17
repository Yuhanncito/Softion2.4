import { useState, useRef, useCallback, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PropTypes from 'prop-types'; // Importar PropTypes
import { useUserContext } from '../context/UseContext';
import { CONFIGURACIONES } from "../configs/confing";
import Cookies from "universal-cookie";
import TaskForm from "../components/TaskForm";
import { GrClose } from "react-icons/gr";
import {useQuery, useQueryClient} from "@tanstack/react-query"
import Swal from 'sweetalert2'



function Canva() {
  const cookies = new Cookies();
  const {tareas, setTareas, projectId } = useUserContext();
  const [show, setShow] = useState(false)
  const queryClient = useQueryClient();
  const [works, setWorks] = useState()
  
  const [workspaceId, setWorspaceId] = useState();
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
    let foundProject = false;
    let idWork = ''
    let info = ''
    for (const work of works) {
      for (const project of work.projects) {
        if (project._id === projectId) {
          idWork = work._id;
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
    try {
      const res = await fetch(CONFIGURACIONES.BASEURL+`/task/${id}`,{
        method:'PUT',
        headers:{
          "Content-Type": "application/json",
          "x-access-token": cookies.get("x-access-user"),
        },
        body:JSON.stringify({
          status:newState,
          workspaceid:idWork
        })
      })
      const json = await res.json()
      info = json
      getTasks();
    } catch (error) {
      info = error
    }
    finally{
      if(info.message === 'ok') return 
      Swal.fire({
        icon: "error",
        title: "Info",
        text: info.message
      }); 
    }
  }
  const handleUpdate = async e => {
    
    e.preventDefault();

    let info = ''
    
    try {
      // Después de la actualización, cierra el modal y vuelve a obtener las tareas
      const Formulario = new FormData(e.target)
      const id = Formulario.get('id')

      let foundProject = false;
      let idWork = ''
      for (const work of works) {
        for (const project of work.projects) {
          if (project._id === projectId) {
            idWork = work._id;
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


      const res = await fetch(CONFIGURACIONES.BASEURL+`/task/${id}`,{
        method:'PUT',
        headers:{
            "Content-Type": "application/json",
            "x-access-token": cookies.get("x-access-user"),
        },
        body:JSON.stringify({...selectedTask,workspaceid:idWork})
      })

      const json = await res.json();
      console.log(json)
      info = json
      handleCloseModal();
      getTasks();

    
    } catch (error) {
      console.log(error);
    }
    finally{
      if(info.message !== 'ok')
      Swal.fire({
        icon:"error",
        title: "Info",
        text: info.message
      }); 
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
      setTasks(parse);
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {

    

    getTasks();
    if(tareas) {
      setTasks(tareas);
      setWorks(queryClient.getQueryData('workspaces'))
    } 
    // aqui el if retornava un "NULL" creo que eso lo petaba
    /* 
      if(!tarea) return null
    */  
      
  
  }, [projectId])
  

  const moveTask = useCallback(async (dragId, hoverIndex, newState) => {
    const dragIndex = tasks.findIndex(task => task._id === dragId);
    const dragTask = tasks[dragIndex];
    if (!dragTask) {
      console.error("Error: La tarea arrastrada no existe.");
      return;
    }
    await updateStatus(dragId, newState);
    await getTasks();
  }, [tasks, updateStatus, getTasks]);

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

                    <TaskForm handleChange={handleModalChange} tarea = {selectedTask} method={handleUpdate} values ={selectedTask} projectId={projectId} />

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
        <Task onClick={modal} key={task._id} task={task} index={index} moveTask={moveTask} />
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
      <p className="text-sm text-gray-500">Horas: {task.timeHoursTaks}</p>
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
