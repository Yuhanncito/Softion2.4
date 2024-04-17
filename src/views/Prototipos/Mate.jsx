import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { useUserContext } from "../../context/UseContext";
import {useQuery} from "@tanstack/react-query"

function Mate() {
  const { user } = useUserContext();

  const generateProjects = () => {
    const proyectos = [];
    const estados = ['pendiente', 'iniciado', 'concluido'];
    const fechaActual = new Date();
    const cuatroMesesAntes = new Date(fechaActual.setMonth(fechaActual.getMonth() - 4));
    const cuatroMesesDespues = new Date(fechaActual.setMonth(fechaActual.getMonth() + 8)); // Se suma 8 porque ya se restaron 4 meses antes

    for (let i = 0; i < 100; i++) {
      const fechaInicio = new Date(cuatroMesesAntes.getTime() + Math.random() * (cuatroMesesDespues.getTime() - cuatroMesesAntes.getTime()));
      const fechaConcluido = new Date(fechaInicio.getTime() + Math.random() * (cuatroMesesDespues.getTime() - fechaInicio.getTime()));
      const proyecto = {
        nombreProyecto: `Proyecto ${i + 1}`,
        tareas: [],
        fechaInicio: fechaInicio,
        fechaConcluido: fechaConcluido,
      };

      for (let j = 0; j < 5; j++) {
        const participantes = [
          { nombre: 'Usuario 1', id: 'id_usuario_1' },
          { nombre: 'Usuario 2', id: 'id_usuario_2' },
        ];

        const nombresTareas = ['Requerimientos del Usuario', 'Creación del Backlog', 'Diseño de la Interfaz', 'Implementación de Funcionalidades', 'Pruebas de Calidad'];

        const tarea = {
          nombreTarea: nombresTareas[Math.floor(Math.random() * nombresTareas.length)],
          participantes: participantes,
          horasDedicadas: Math.floor(Math.random() * 10) + 1,
          estado: estados[Math.floor(Math.random() * estados.length)],
          fechaInicio: new Date(fechaInicio.getTime() + Math.random() * (fechaConcluido.getTime() - fechaInicio.getTime())),
        };

        // Asegurarse de que la fecha de inicio de la tarea no sea posterior a la fecha de conclusión del proyecto
        if (tarea.fechaInicio <= fechaConcluido) {
          proyecto.tareas.push(tarea);
        }
      }

      proyectos.push(proyecto);
    }
    return proyectos
  };

  const {data,isLoading,isError,error} = useQuery({
    queryKey:'Proyectos',
    queryFn: generateProjects
  })

  const [formData, setFormData] = useState({
    nombreUsuario: '',
    datoTareaInicial:0,
    datoTiempoInicial:'',
    tiempoCompletado:'',
    tareasCompletadas:0,
    tiempoDiferencial:''
  });

  const getSemanas = (semana1, semana2) =>{
    const sem2 = new Date(semana1);
    const sem1 = new Date(semana2);
    const prueba = sem2.getTime()-sem1.getTime();
    const dias = prueba / (1000*60*60*24);
    const semanas = dias/7;

    return semanas;

  }
 
  const calcularPronostico = (e) => {
    e.preventDefault();
    const {datoTiempoInicial, tiempoCompletado, tiempoDiferencial} = formData;
    console.log(datoTiempoInicial, tiempoCompletado, tiempoDiferencial)

    const diferencial1 = getSemanas(tiempoCompletado, datoTiempoInicial);
    const diferencial2 = getSemanas(tiempoDiferencial, datoTiempoInicial);

    console.log(`Primera Diferencia ${diferencial1} y Segunda Diferencia ${diferencial2}`)
    
    let c, k, p;
    c = Math.exp(0)*formData.datoTareaInicial
    k = Math.log(formData.tareasCompletadas/((c!=0)?c:1))/diferencial1;
    p = ((c!=0)?c:1)*Math.exp(k*diferencial2);
    const sinDecimal = Math.trunc(p);
    Swal.fire({
      icon: (sinDecimal)?"success":"error",
      title: "Objetivo del mes",
      text:(sinDecimal)?`Completar Máximo ${sinDecimal} Tareas adicionales`:'Error al Pronosticar'
    }); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    console.log(name,value)
  };

  const filtrarProyectosPorFecha = () => {
    const fechaSeleccionada = new Date(formData.tiempoCompletado);
    return data.filter(proyecto => new Date(proyecto.fechaConcluido) <= fechaSeleccionada);
  };

  const filtrarTareasIniciales = () => {
    const tareasConcluidas = [];
    data.forEach(proyecto => {
      proyecto.tareas.forEach(tarea => {
        if (tarea.estado === 'concluido' && new Date(tarea.fechaInicio) <= new Date(formData.datoTiempoInicial)) {
          tareasConcluidas.push(tarea);
        }
      });
    });
    return tareasConcluidas;
  };

  const filtrarTareasConcluidas = () => {
    const tareasConcluidas = [];
    data.forEach(proyecto => {
      proyecto.tareas.forEach(tarea => {
        if (tarea.estado === 'concluido' && new Date(tarea.fechaInicio) <= new Date(formData.tiempoCompletado)) {
          tareasConcluidas.push(tarea);
        }
      });
    });
    return tareasConcluidas;
  };

  return (isLoading?'Cargando':
    <div className="flex">
      <div className="flex flex-col h-full w-[40%]">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-center my-5">Filtros Proyectos {filtrarProyectosPorFecha().length}</h1>
          <div className="flex flex-wrap gap-3 h-60 overflow-y-auto">
          {filtrarProyectosPorFecha().map((proyecto, index) => (
            <h1 className='py-3 px-4 w-28 m-1 bg-white shadow-lg' key={index} onClick={() => setFormData({...formData, tiempoCompletado: proyecto.fechaConcluido})}>{proyecto.nombreProyecto}</h1>
          ))}
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center my-5">Tareas Concluidas {filtrarTareasConcluidas().length} </h2>
        <div className='h-60 overflow-y-auto'>
          <ul className='flex flex-wrap gap-3' >
            {filtrarTareasConcluidas().map((tarea, index) => (
              <li className='py-3 px-4 w-38 m-1 bg-white shadow-lg' key={index}>{tarea.nombreTarea}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center my-5">Formulario de Pronóstico de Tareas</h1>
        <form className="w-full max-w-lg mx-auto" onSubmit={calcularPronostico}>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="nombreUsuario">
                Nombre del Usuario:
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" name="nombreUsuario" onChange={handleChange} value={(!user)?"":user.name} />
            </div>
          </div>
          <div className='flex w-full justify-center font-bold text-xl p-2 mb-5 bg-gray-200 border-2 border-black rounded-lg'>
              <h1>Condicion inical</h1>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="tareasCompletadas">
                Número de Tareas Completadas:
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="number" name="datoTareaInicial" value={filtrarTareasIniciales().length} onChange={handleChange} />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="tiempoCompletado">
                Tiempo en que se Completaron las Tareas (semanas):
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="date" name="datoTiempoInicial" onChange={handleChange} />
            </div>
          </div>

          <div className='flex w-full justify-center font-bold text-xl p-2 mb-5 bg-gray-200 border-2 border-black rounded-lg'>
              <h1>Desempeño Conocido</h1>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="tareasCompletadas">
                Número de Tareas Completadas:
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="number" name="tareasCompletadas" value={filtrarTareasConcluidas().length} onChange={handleChange} />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="tiempoCompletado">
                Tiempo en que se Completaron las Tareas (semanas):
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="date" name="tiempoCompletado" value={formData.tiempoCompletado} onChange={handleChange} />
            </div>
          </div>

          <div className='flex w-full justify-center font-bold text-xl p-2 mb-5 bg-gray-200 border-2 border-black rounded-lg'>
              <h1>Datos de Pronostico</h1>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="tareasCompletadas">
                Semanas de diferencia:
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="date" name="tiempoDiferencial" onChange={handleChange} />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <input type="submit" value="Pronosticar" className=' px-20 py-3 bg-green-500 mt-6 rounded-md hover:bg-green-900 hover:scale-105 transition-all font-bold' />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Mate;


