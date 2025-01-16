import axios from "axios";

export const uplodJsonUrl = async (file: any) => {
    try {

        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post("/api/upload-json", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
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