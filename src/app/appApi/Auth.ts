import axios from "axios";
import { SignupFormData } from "../schemas/signUpSchema";
import { SignInFormData } from "../schemas/signInSchema";


export const Signup = async (data: SignupFormData) => {
    try {
        const response = await axios.post("/api/signup", data);
        return response.data

    } catch (error) {

        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(error.response.data.message);
            } else if (error.request) {
                throw new Error("No response from server");
            }
        }
        throw new Error("Request setup error");

    }
}


export const SignIn = async (data: SignInFormData) => {
    try {
        const response = await axios.post("/api/signup", data);
        return response.data

    } catch (error) {

        if (axios.isAxiosError(error)) {
            if (error.response) {
                throw new Error(error.response.data.message);
            } else if (error.request) {
                throw new Error("No response from server");
            }
        }
        throw new Error("Request setup error");

    }
}