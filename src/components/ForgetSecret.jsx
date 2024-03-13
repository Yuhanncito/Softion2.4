import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {useUserContext} from '../context/UseContext'
import Swal from 'sweetalert2'
import { CONFIGURACIONES } from '../configs/confing';
import Cookies from 'universal-cookie';

function ForgetSecret() {

  const  {generalData} = useUserContext();
  const cookie = new Cookies();

    const handleChange = e =>{
      setForm({
        ...form,
        [e.target.name]: e.target.value
      })
    }

    const [form, setForm] = useState({
      email:generalData.email,
      secret: '',
      respuestaSecreta: ''
    })


    const navigate = useNavigate();
  
    const { handleSubmit, register, formState: { errors } } = useForm();
  
    const onSubmit = async(e) =>{
      console.log(form)
      try {
        const res = await fetch(CONFIGURACIONES.BASEURL+'/auth/secret',{
          method:'POST',
          headers:{
            'Content-Type': 'application/json',
          },
          body:JSON.stringify(form)
        })
        const json = await res.json()

        if(json.message!=='ok'){
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Informacion incorrecta",
          });

          return
        }

        cookie.set('x-access-user', json.token, { path: '/', expires: new Date(Date.now() + 86400000) } );
        navigate('/App')
        
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error,
        });
      }
    }


    useEffect(() => {
      
      const getData = async() =>{
        try {
          const res = await fetch(CONFIGURACIONES.BASEURL+`/auth/${generalData.email}`,{
            headers:{
              'Content-Type': 'application/json',
            }
          })
          const json = await res.json();
         
          if(json.message!=='ok'){
            navigate('/ForgetPass')
          }
        } catch (error) {
          console.log(error)
        }
      }
      getData()
    }, [])
    

  return (
    <div className="flex justify-center h-screen w-screen items-center">
    <form onSubmit={handleSubmit(onSubmit)} className="flex bg-white flex-col w-[90%] shadow-xl rounded-2xl lg:w-[50%] h-[60%] px-10 items-center justify-center">
        <h1 className="md:text-5xl text-4xl font-semibold text-center">Recuperación de Contraseña</h1>
        <h1 className="md:text-5xl text-4xl font-semibold text-center">Usuario {generalData.email}</h1>
        <div className='w-full flex flex-col'>
            <label htmlFor="secret" className="text-lg font-medium">Pregunta secreta</label>
              <select {...register('secret', { required: true, validate: value => value !== "default" })} name="secret" id="secret" className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent" onChange={handleChange}>
                <option value="default">Selecciona tu pregunta</option>
                <option value="colorFavorito">¿Cuál es tu color favorito?</option>
                <option value="nombreMascota">¿Cómo se llama tu primera mascota?</option>
                <option value="ciudadNacimiento">¿En qué ciudad naciste?</option>
                <option value="comidaFavorita">¿Cuál es tu comida favorita?</option>
              </select>
              {errors.secret && <p className="text-red-500 text-xs italic text-center">Por favor, selecciona una pregunta.</p>}
              <label htmlFor="respuestaSecreta" className="text-lg font-medium">Respuesta</label>
              <input {...register('respuestaSecreta', { required: true })} type="text" name="respuestaSecreta" id="respuestaSecreta" className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent" onChange={handleChange}/>
              {errors.respuestaSecreta && <p className="text-red-500 text-xs italic text-center">Este campo es requerido.</p>}
          </div>

        <div className="mt-8 flex gap-x-4 justify-center w-full">
            <Link to={"/"} className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 pr-5 pl-5 rounded-xl bg-red-600 text-white text-lg font-bold">Cancelar</Link>
            <button type="submit" name='regis' className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 pr-5 pl-5 rounded-xl bg-blue-600 text-white text-lg font-bold" >Recuperar</button>
        </div>
        <div className="mt-8 flex justify-center items-center w-full">
          <Link to={"/"} className=" text-blue-600 text-base font-medium ml-2">Intentar con otro método</Link>
      </div>
        <div className="mt-8 flex justify-center items-center w-full">
          <p className="font-medium text-base">¿Ya tienes una cuenta?</p>
          <Link to={"/"} className=" text-blue-600 text-base font-medium ml-2">Ingresa</Link>
      </div>
    </form>
  </div>
  )
}

export default ForgetSecret
