import axios from "axios";

export const addTip = async (data: any) => {
    try {
        const response = await axios.post("/api/tip", data, {
            headers:{
                "Content-Type":"multipart/form-data"
            }
            
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

export const editTip = async (data: any) => {
    try {
        const response = await axios.put("/api/tip", data, {
            headers:{
                "Content-Type":"multipart/form-data"
            }
            
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


export const getTips = async () => {
    try {
        const response = await axios.get("/api/tip");
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