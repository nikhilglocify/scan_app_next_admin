import { error } from "console";



export interface ReqBodyValidationresponse {
    isValidated: boolean;
    message: string;
    error: any

}

export const validateBodyData = (schema: Zod.Schema, body: any): ReqBodyValidationresponse => {

    try {

        const result = schema.safeParse(body);
        console.log(result.error?.issues, "result");

        if (result.error && result.error?.issues.length) {
            const reqBodyValidationErrors = Object.fromEntries(

                result.error?.issues?.map((issue) => [issue.path[0], issue.message]) || []
            );

        

            // Respond with a JSON object containing the validation errors
            return {
                isValidated: false,
                error: reqBodyValidationErrors,
                message: "Invalid Form Data",
            }

        } else {

            return {
                isValidated: true,
                error: null,
                message: "Form Data Validated",
            }
        }

    } catch (error: any) {

        throw new Error(error)

    }

}