

import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
// import connect from "@/app/config/dbConfig"
import { badRequest, successResponseWithData } from "@/app/helpers/apiResponses"
import  connect  from '@/app/dbConfig/connect';
import User from "@/app/models/usersModel"
/**
 * This function handles the POST request for user registration.
 * It receives a NextRequest object, validates the request body, checks if the user already exists,
 * hashes the password, and saves the new user to the database.
 *
 * @param request - The NextRequest object containing the request body.
 * @returns - A NextResponse object with appropriate status code and JSON payload.
 *
 * @throws Will throw an error if any exception occurs during the process.
 */
export async function POST(request: NextRequest) {
    try {
        await connect()

        const reqBody = await request.json();
        const { email, password,name } = reqBody;

        // Custom validation
        if (!email) {

            return badRequest(NextResponse, "email is required and must be a string")

        }
        if (!password) {
            return badRequest(NextResponse, "password is required and must be a string")
        }
        console.log(reqBody);

        //check if user already exists
        const user = await User.findOne({email:email});

        if (user) {
            return badRequest(NextResponse, "User already exists")
        }

        //hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = {
            name,
            email,
            password: hashedPassword,
        };

        const savedUser = await User.create(newUser);
        console.log(savedUser);

        return successResponseWithData(
            NextResponse,
            "User  created successfully Res",
            savedUser
        );
    } catch (error: any) {
        console.log("err",error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


