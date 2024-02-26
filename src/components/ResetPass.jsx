import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {useUserContext} from '../context/UseContext'
import Swal from 'sweetalert2'
import Cookies from 'universal-cookie';

//Icons
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { CONFIGURACIONES } from '../configs/confing';

function ResetPass() {

  const  {generalData} = useUserContext();

  const cookies = new Cookies();

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { handleSubmit, register , formState: { errors } } = useForm();

  const onSubmit = (data) =>{
    console.log(data);
  }

  const [form, setForm] = useState({
    password: ''
  });
  
  const canceLar = () => {
    navigate("/")
  }
  /*Contraseña */
  const [passwordStrength, setPasswordStrength] = useState(null);

  const measurePasswordStrength = (password) => {
    const strengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
    const score = strengthRegex.test(password) ? (password.length / 8) * 100 : 0;
  
    if (score >= 80) {
      return 'muy seguro';
    } else if (score >= 40) {
      return 'medio seguro';
    } else {
      return 'inseguro';
    }
  };
  
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
      ...(name === 'password' && { passwordStrength: measurePasswordStrength(value) })
    }));

    if (name === 'password') {
      const strength = measurePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const resetPass = async () =>{

    try{
      const response = await fetch(CONFIGURACIONES.BASEURL+"/auth/forgotPassword/update",{
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
    
      <div className="flex w-full h-screen justify-center items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="flex shadow-xl bg-white w-[90%] h-[70%] md:w-[50%] md:h-[60%] flex-col items-center justify-center">
            <h1 className="text-5xl font-semibold text-center">Nueva contraseña</h1>
            <div className='w-[80%] flex flex-col mt-10 mx-auto max-w-md'>
                <label className="text-lg font-medium ml-2">Password</label>
               
                <div className="relative w-full">
              <input
                {...register('password', {
                  required: true,
                  minLength: 8,
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                })}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                name='password'
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                placeholder="Introduce tu contraseña"
              />
              {showPassword ? (
                <FaRegEye onClick={handleShowPassword} className="absolute inset-y-0 right-0 mr-4 my-auto hover:cursor-pointer" />
              ) : (
                <FaRegEyeSlash onClick={handleShowPassword} className="absolute inset-y-0 right-0 mr-4 my-auto hover:cursor-pointer" />
              )}
            </div>
            {passwordStrength !== null && (
              <p className={`text-sm mt-2 ${passwordStrength === 'inseguro' ? 'text-red-500' : passwordStrength === 'medio seguro' ? 'text-yellow-500' : 'text-green-500'} italic text-center`}>
                La contraseña es {passwordStrength}
              </p>
            )}
            {errors.password && (
              <p className="text-red-500 text-xs italic text-center">
                La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un símbolo y un número.
              </p>
            )}
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

