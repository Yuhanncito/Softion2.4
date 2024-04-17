import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useForm} from 'react-hook-form'
import {useUserContext} from '../context/UseContext'
import Swal from 'sweetalert2'
import { CONFIGURACIONES } from '../configs/confing';
import ReCAPTCHA from "react-google-recaptcha";

//Icons
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";


function LoginCom() {

  const navigate = useNavigate();

  const [count, setCount] = useState(5)

  const {setGeneralData} = useUserContext();

  const [OnSubtmit, setOnSubtmit] = useState(false)
  const [countIntent, setCountIntent] = useState(1)
  
  const { handleSubmit, register, formState: { errors } } = useForm();

  const loginFunction = async() => {
    if(captchaValue){
    setOnSubtmit(!OnSubtmit)
    try{
      const res = await fetch(CONFIGURACIONES.BASEURL+"/auth/signin", {
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(form)        
      })
      const json = await res.json();
      if(json.message === 'correcto' || json.message === 'Tienes un Código Activo'){
        (json.message === 'Tienes un Código Activo')?setGeneralData({option:'login',email:form.email,message:"Tienes un Código Activo"}):setGeneralData({option:'login',email:form.email});
        navigate("/CodigoVer")
      }
      else{
        console.log(json.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: json.message + `\n Tienes ${count} intentos`,
        });

        setCount(count-1);
      }
      
    }
    catch(err){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Error interno 500 '+err,
      });  
    }

    finally{
      setOnSubtmit(false);
    }
    
    if(count === 0 && countIntent < 3) {
      setOnSubtmit(true)
      setTimeout(removeBlock, countIntent*0.2*60*1000);
    }
   }
  else{
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Realice primero el capcha para continuar',
      }); 
  }
  }

  const removeBlock=()=>{
        console.log(" cambiao ")
        setCount(5);
        setOnSubtmit(false);
        setCountIntent(countIntent++)
        console.log(count)
        console.log(countIntent)
  }

  const commingSon = () =>{
    Swal.fire({
      icon: "info",
      title: "Próximamente...",
    }); 
  }

  const onSubmit = async () =>{
    loginFunction();
   
  }

  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  
  //const [message, setMessage] = useState('');
  

  const handleChange = async (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  /*Captcha */
  function onChange(value) {
    setCaptchaValue(!captchaValue);
  }

  const [captchaValue, setCaptchaValue] = useState(false);


  return (
    
    <div className="bg-white px-10 py-20 md:w-[600px] rounded-3xl shadow-xl border-2 border-gray-100">
      <h1 className="text-5xl font-semibold max-sm:flex max-sm:flex-col max-sm:border-b-2 max-sm:pb-5">Bienvenido a <span className=' text-4xl font-bold'>SoftionPro</span></h1>
      <div className="mt-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
              <label className="text-lg font-medium" htmlFor='email'>Email</label>
              <input id='email' {...register('email', { required: true, pattern: /^\S+@\S+$/i })} onChange={handleChange} type='email' className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent" 
              placeholder="Introduce tu correo electrónico" /> 
              {errors.email && <p className="text-red-500 text-xs italic">Por favor introduce un correo electrónico válido.</p>}
          </div>
          <div>
              <label className="text-lg font-medium" htmlFor='password'>Contraseña</label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: true,
                    minLength: 8,
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  })}
                  onChange={handleChange}
                  id='password'
                  type={showPassword ? "text" : "password"}
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                  placeholder="Introduce tu contraseña"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs italic">
                    La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un símbolo y un número.
                  </p>
                )}
                {showPassword ? (
                  <FaRegEye onClick={handleShowPassword} className="absolute inset-y-0 right-0 mr-4 my-auto hover:cursor-pointer" />
                ) : (
                  <FaRegEyeSlash
                    onClick={handleShowPassword}
                    className="absolute inset-y-0 right-0 mr-4 my-auto hover:cursor-pointer"
                  />
                )}
              </div>
            </div>
            <ReCAPTCHA
               sitekey="6Lcl4X8pAAAAAKtRJhdkFovBfKMdNE9K7NuuFiPw"
              //sitekey="6LfV2H8pAAAAAG_Zgty-Nx16jZmj8ho-HaA5Gmga"
              onChange={onChange}
              onExpired={onChange}
            />
          <div className="mt-8 flex justify-between items-center">
              <Link className="font-medium text-base text-blue-600" to="/ForgetPass" >¿Olvidaste tu contraseña?</Link>
          </div>
        

          <div className="mt-8 flex justify-center items-center">
              <p className="font-medium text-base">¿No tengo cuenta?</p>
              <Link className=" text-blue-600 text-base font-medium ml-2" to='/Register' >Regístrate ahora</Link>
          </div>
          <button type="submit" disabled={OnSubtmit || !captchaValue} className=" disabled:bg-blue-100 disabled:cursor-not-allowed  active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 rounded-xl bg-blue-600 text-white text-lg font-bold w-[100%] mt-5">iniciar sesión</button>
        </form>
        <div className="mt-8 flex flex-col gap-y-4">
              
              <button onClick={commingSon} className="flex rounded-xl py-3 border-2 border-gray-100 items-center justify-center gap-2 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z" fill="#EA4335"/>
                      <path d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0926 11.9998 19.0926C8.86633 19.0926 6.21896 17.0785 5.27682 14.2695L1.2373 17.3366C3.19263 21.2953 7.26484 24.0017 11.9998 24.0017C14.9327 24.0017 17.7352 22.959 19.834 21.0012L16.0406 18.0142Z" fill="#34A853"/>
                      <path d="M19.8342 20.9978C22.0292 18.9503 23.4545 15.9019 23.4545 11.9982C23.4545 11.2891 23.3455 10.5255 23.1818 9.81641H12V14.4528H18.4364C18.1188 16.0119 17.2663 17.2194 16.0407 18.0108L19.8342 20.9978Z" fill="#4A90E2"/>
                      <path d="M5.27698 14.2663C5.03833 13.5547 4.90909 12.7922 4.90909 11.9984C4.90909 11.2167 5.03444 10.4652 5.2662 9.76294L1.23999 6.64844C0.436587 8.25884 0 10.0738 0 11.9984C0 13.918 0.444781 15.7286 1.23746 17.3334L5.27698 14.2663Z" fill="#FBBC05"/>
                  </svg>
                  Acceder con Google
              </button>
          </div>
      </div>
    </div>
  )
}

export default LoginCom
