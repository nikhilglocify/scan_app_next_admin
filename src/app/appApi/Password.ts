import axios from "axios";

export const forgotPassword = async (data: any) => {
    try {
        const response = await axios.post("/api/forgot-password", data, {
            // headers:{
            //     "Content-Type":"multipart/form-data"
            // }
            
        });
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

export const resetPassword = async (data: any) => {
    try {
        const response = await axios.post("/api/reset-password", data, {
            // headers:{
            //     "Content-Type":"multipart/form-data"
            // }
            
        });
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