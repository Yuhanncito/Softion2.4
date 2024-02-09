import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {useUserContext} from '../context/UseContext'
import Swal from 'sweetalert2'
import Cookies from 'universal-cookie';



function CodigoVer() {

  const cookies = new Cookies();
  

  const navigate = useNavigate();

  const { handleSubmit, register, formState: { errors } } = useForm();

  const [secretCode, setSecretCode] = useState('');
  const [messageError, setMessageError] = useState('');

  const {generalData,setAllData} = useUserContext();

  const onSubmit = async(data) =>{
    try{
      const res = await fetch(`https://proto-api2-0.vercel.app/api/auth/${(generalData.option === "register")?'signup':(generalData.option==="login")?'signin':'forgotPassword'}/confirm`,{
        method:"POST",
        headers:{
          'Content-Type': 'application/json'
        },
        body:JSON.stringify((generalData.option==='login' || generalData.option ==='forgot')?{
          'email':generalData.email ,
          'secretCode': secretCode
        }:{ 
          'email':generalData.form.email ,
          'secretCode': secretCode,
          'name':generalData.form.name,
          'lastName':generalData.form.lastName,
          'password':generalData.form.password
        })
      })
      const json = await res.json();
      
      console.log(json)

      if(json.message === 'ok'){
        cookies.set('x-access-user', json.token);
        if(generalData.option ==='forgot'){
          navigate("/ResetPass");  
        }
        else{
          navigate("/App");
        }
        
      }
        else{
          
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: json.message,
        });
      }
    }
    catch(err){
      console.log(generalData,err )
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: 'Error interno 500:',
      });  
    }
  }

  
  const canceLar = () => {
    navigate("/")
  }
  
  const handleChange = e =>{
        setSecretCode(e.target.value);
        if(e.target.value.length < 8 || e.target.value.length > 8){
            setMessageError( 'FORMATO NO ACEPTADO' )
        }
        else if(e.target.value.length === 8){
          setMessageError( '' )
        }
  }



  return (
    
<div className="flex w-screen h-screen justify-center items-center">
  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col rounded-2xl shadow-xl items-center md:h-[70%] lg:w-[50%] w-[80%] h-[50%] px-6 justify-center bg-white">
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-4">Verificación de Cuenta</h1>
    <h3 className='text-sm md:text-base text-center mb-4'>
      {
        (!generalData.message)?'Se envió un correo electrónico a tu bandeja de entrada con el código de verificación.':generalData.message + " en tu bandeja de entrada de tu correo"
      }
      
    </h3>
    <div className='w-full lx:px-36 flex flex-col mt-4  lg:mt-6'>
      <label className="text-base md:text-lg font-medium ml-2.5 mb-1 items-center justify-center">Código</label>
      <input
        onChange={handleChange}
        type='text'
        name='email'
        className="w-full border-2 border-gray-100 rounded-xl p-2 md:p-4 mt-1 bg-transparent"
        placeholder="Introduce tu código"/>
      <h3 id="messageError" className='text-red-600 text-xs md:text-sm mt-1'>{messageError}</h3>
    </div>
    <div className="mt-8 flex gap-x-4 justify-center w-full">
        <button className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 pr-5 pl-5 rounded-xl bg-red-600 text-white text-lg font-bold" onClick={()=>canceLar()}>Cancelar</button>
        <button type="submit" name='regis' className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 pr-5 pl-5 rounded-xl bg-blue-600 text-white text-lg font-bold" >Confirmar</button>
    </div>
  </form>
</div>



  )
}

export default CodigoVer

