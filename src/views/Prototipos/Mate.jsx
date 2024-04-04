import Swal from 'sweetalert2';
import { useState } from 'react';
import { useUserContext } from "../../context/UseContext";

function Mate() {
  const { user } = useUserContext();
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

    // const sem2 = new Date(datoTiempoInicial);
    // const sem1 = new Date(tiempoCompletado);
    // const prueba = sem2.getTime()-sem1.getTime();
    // const dias = prueba / (1000*60*60*24);
    // const semanas = dias/7;

    // console.log(`dias ${dias} y semanas ${semanas}`)
    let c, k, p;
    c = Math.exp(0)*formData.datoTareaInicial
    k = Math.log(formData.tareasCompletadas/((c!=0)?c:1))/diferencial1;
    p = ((c!=0)?c:1)*Math.exp(k*diferencial2);
    const sinDecimal = Math.trunc(p);
    Swal.fire({
      icon: "success",
      title: "Objetivo del mes",
      text:`Completar Máximo ${sinDecimal} Tareas`
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

  return (
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
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="number" name="datoTareaInicial" onChange={handleChange} />
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
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" type="number" name="tareasCompletadas" value={formData.tareasCompletadas} onChange={handleChange} />
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
  );
}

export default Mate;
