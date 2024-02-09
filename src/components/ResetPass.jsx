import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {useUserContext} from '../context/UseContext'
import Swal from 'sweetalert2'
import Cookies from 'universal-cookie';

//Icons
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";

function ResetPass() {

  const  {generalData} = useUserContext();

  const cookies = new Cookies();

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) =>{
    console.log(data);
  }

  const [form, setForm] = useState({
    password: ''
  });
  
  const canceLar = () => {
    navigate("/")
  }
  
  const handleChange = e =>{
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const resetPass = async () =>{

    try{
      const response = await fetch("https://proto-api2-0.vercel.app/api/auth/forgotPassword/update",{
        method:"PUT",
        headers:{
          'Content-Type': 'application/json',
          'x-access-token': cookies.get('x-access-user')
        },
        body:JSON.stringify({
          email: generalData.email,
          password: form.password
        })
      });
      const json = await response.json();

      cookies.set('x-access-user', json.token);
    
      navigate('/App')

    }
    catch (err){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Error interno 500',
      });
    }
  }

  const Login = () => {
    navigate("/")
  }

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  }
  
  return (
    
      <div className="flex justify-center bg-white py-6 mx-auto w-96 rounded-2xl border-2 m-40">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center">
            <h1 className="text-5xl font-semibold text-center">Nueva constraseña</h1>
            <div className='w-[80%] flex flex-col mt-10 mx-auto max-w-md'>
                <label className="text-lg font-medium ml-2">Password</label>
                {showPassword ? (
                  <FaRegEye onClick={handleShowPassword} className="absolute inset-y-0 right-0 mr-4 my-auto hover:cursor-pointer" />
                ) : (
                  <FaRegEyeSlash onClick={handleShowPassword} className="absolute inset-y-0 right-0 mr-4 my-auto hover:cursor-pointer" />
                )}
                <input onChange={handleChange} type='password' name='password' className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent" 
                placeholder="Introduce tu correo electrónico" /> 
                {errors.email && <p className="text-red-500 text-xs italic text-center">Introduce un correo electrónico válido.</p>}
            </div>
            <div className="mt-8 flex gap-x-4 justify-center w-full">
                <button className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 pr-5 pl-5 rounded-xl bg-red-600 text-white text-lg font-bold" onClick={()=>canceLar()}>Cancelar</button>
                <button type="submit" name='regis' className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 pr-5 pl-5 rounded-xl bg-blue-600 text-white text-lg font-bold" onClick={resetPass} >Ingresar</button>
            </div>
            <div className="mt-8 flex justify-center items-center w-full">
              <p className="font-medium text-base">Ya tienes una cuenta?</p>
              <button className=" text-blue-600 text-base font-medium ml-2" onClick={()=>Login()} >Ingresa</button>
          </div>
        </form>
      </div>
  )

}
export default ResetPass

