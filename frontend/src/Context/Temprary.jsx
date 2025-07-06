// this is the src->Context->Temprary.jsx

import { createContext, useContext, useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom'

const chatContext = createContext();

//declaring a common state
const Temprary = ({children})=>{
    const [user, setUser] = useState(null);
    // const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
      const UserInfo = JSON.parse(localStorage.getItem("UserInfo"));
      setUser(UserInfo);
      // setLoading(false); // <- done loading

      if (!UserInfo) {
        navigate('/');
      }
    }, []);

    return <chatContext.Provider value={{ user, setUser }}>{children}</chatContext.Provider>
}

export const ChatState=()=>{
    return useContext(chatContext)
}

export default Temprary;