import {createContext,useContext, useState} from "react"

export const UserContext = createContext(false);

const UserProvider = ({children}) =>{
    const [user, setUser] = useState(null);
    const [generalData, setGeneralData] = useState(null);
    const [projectId , setProjectId] = useState();

    return(
        <UserContext.Provider value={{user,setUser,generalData,setGeneralData,projectId, setProjectId}}>
            {children}
        </UserContext.Provider>
    )
}
export default UserProvider;

export const useUserContext = () => useContext(UserContext);