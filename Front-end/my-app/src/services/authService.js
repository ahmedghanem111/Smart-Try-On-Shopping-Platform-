import {API} from "@/lib/axios"

export const loginRequest = (data) => {
   return API.post("/api/users/login", data);
   
};

export const registerRequest = (data) => {
   return API.post("/api/users", data);
};

export const googleLoginRequest = (idToken) => {
   return API.post("/api/users/google", { idToken });
};