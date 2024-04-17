import { Outlet } from "react-router-dom";
import Cookies from "universal-cookie";
import {useNavigate} from "react-router-dom"
import { useEffect} from "react"

const LayoutPublic = () => { 
    
    const cookies = new Cookies();
    const navigate = useNavigate();

    useEffect(()=>{
        const userToken = cookies.get('x-access-user')
        if(userToken) navigate('/App')
    },[])
  

    return (<Outlet />);
 }

 export default LayoutPublic;