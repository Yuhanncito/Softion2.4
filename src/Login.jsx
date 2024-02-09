import LoginCom from "./components/LoginCom";

const Login = () => {
  return (
    <div className="flex w-full h-screen">
      <div className="w-full flex items-center justify-center lg:w-1/2">
        <LoginCom /> 
      </div>
      <div className="hidden relative lg:flex h-full w-1/2 items-center justify-center bg-gray-200">
        <div className="w-60 h-60 bg-gradient-to-tr from-blue-900 to-blue-600 rounded-full animate-bounce"/>
        <div className="w-full h-1/2 absolute bottom-0 bg-white/5 backdrop-blur-lg" />
      </div>
    </div>
  )
}

export default Login

