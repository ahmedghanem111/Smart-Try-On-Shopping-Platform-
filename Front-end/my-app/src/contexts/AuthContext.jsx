"use client"

import { createContext , useContext,useState,useEffect } from "react"

const AuthContext = createContext();

export const AuthProvider =({children})=>{
    const [user,setUser]=useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const storedUser=localStorage.getItem("user")
        const storedToken=localStorage.getItem("token")
        if(storedUser && storedToken){
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    },[])

    const login = (userData) => {
        const userInfo = {
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            isAdmin: userData.isAdmin,
        };

        localStorage.setItem("user", JSON.stringify(userInfo));
        localStorage.setItem("token", userData.token);
        setUser(userInfo);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user,login,logout,loading}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = ()=>useContext(AuthContext)