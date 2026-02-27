"use client"

import { createContext , useContext,useState,useEffect, Children } from "react"

const AuthContext = createContext();

export const AuthProvider =({children})=>{
    const [user,setUser]=useState(null)

    useEffect(()=>{
        const storedUser=localStorage.getItem("user")
        if(storedUser){
            setUser(JSON.parse(storedUser))
        }
    },[])

        const login = (email) => {
        const fakeUser = {
        name: "Alaa",
        role: email === "admin@test.com" ? "admin" : "user",
        };

        localStorage.setItem("user", JSON.stringify(fakeUser));
        setUser(fakeUser);
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = ()=>useContext(AuthContext)