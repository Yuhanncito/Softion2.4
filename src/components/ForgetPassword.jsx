import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {useUserContext} from '../context/UseContext'
import Swal from 'sweetalert2'
import { CONFIGURACIONES } from '../configs/confing';


function ForgetPassword() {

  const [metodoRecuperacion, setMetodoRecuperacion] = useState("");


  
  const  {setGeneralData} = useUserContext();

  const navigate = useNavigate();

  const { handleSubmit, register, formState: { errors } } = useForm();

  const onSubmit = async() =>{
    if(metodoRecuperacion === "token"){
      try{
        const response = await fetch(CONFIGURACIONES.BASEURL+"/auth/forgotPassword",{
          method:"POST",
          headers:{
            'Content-Type': 'application/json'
          },
          body:JSON.stringify(form)
        });
        const json = await response.json();
        setGeneralData({option:'forgot',email:form.email})
        console.log(json)
        navigate("/CodigoVer")
      }
      catch (err){
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Error interno 500'+err,
        });
      }
    }
    else if(metodoRecuperacion === "preguntaSecreta"){
      try{
        const res = await fetch(CONFIGURACIONES.BASEURL+`/auth/${form.email}`,{
          headers:{
            'Content-Type': 'application/json',
          }
        })
        const json = await res.json();

        if(json.message !== 'ok'){
          console.log(json);
        }
        else{
          console.log(json.data[0])
          setGeneralData(json.data[0])
          navigate("/ForgetSecret")
        }
      }catch(err){
        console.log(err)
      }
    }
  }

  const [form, setForm] = useState({
    email: '',
    password: '',
    lastName:'',
    name:''
  });
  
  
  const handleChange = e =>{
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  

  return (
    
      <div className="flex justify-center h-screen w-screen items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="flex bg-white flex-col w-[90%] shadow-xl rounded-2xl lg:w-[50%] h-[60%] px-10 items-center justify-center">
            <h1 className="md:text-5xl text-4xl font-semibold text-center">Recuperación de Contraseña</h1>
            <div className='w-full flex flex-col mt-10'>
                <label className="text-lg font-medium" htmlFor='email'>Email</label>
                <input id='email' {...register('email', { required: true, pattern: /^\S+@\S+$/i })} onChange={handleChange} type='email' name='email' className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent" 
                placeholder="Introduce tu correo electrónico" /> 
                {errors.email && <p className="text-red-500 text-xs italic text-center">Introduce un correo electrónico válido.</p>}
            </div>

            <div className="flex flex-row justify-around w-[50%] items-center mt-4">
                <div className="flex items-center">
                    <input type="radio" id="token" name="recuperacion" value="token" {...register('recuperacion', { required: true })} onChange={e => setMetodoRecuperacion(e.target.value)} checked={metodoRecuperacion === 'token'} />
                    <label htmlFor="token" className="ml-2">Token</label>
                </div>
                <div className="flex items-center mt-2">
                    <input type="radio" id="preguntaSecreta" name="recuperacion" value="preguntaSecreta" {...register('recuperacion', { required: true })} onChange={e => setMetodoRecuperacion(e.target.value)} checked={metodoRecuperacion === 'preguntaSecreta'} />
                    <label htmlFor="preguntaSecreta" className="ml-2">Pregunta Secreta</label>
                </div>
            </div>
            {errors.recuperacion && <p className="text-red-500 text-xs italic text-center">Selecciona un método de recuperación.</p>}


            <div className="mt-8 flex gap-x-4 justify-center w-full">
                <Link to={"/"} className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 pr-5 pl-5 rounded-xl bg-red-600 text-white text-lg font-bold">Cancelar</Link>
                <button type="submit" name='regis' className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 pr-5 pl-5 rounded-xl bg-blue-600 text-white text-lg font-bold" >Recuperar</button>
            </div>
            <div className="mt-8 flex justify-center items-center w-full">
              <p className="font-medium text-base">¿Ya tienes una cuenta?</p>
              <Link to={"/"} className=" text-blue-600 text-base font-medium ml-2">Ingresa</Link>
          </div>
        </form>
      </div>
  )

}
export default ForgetPassword

