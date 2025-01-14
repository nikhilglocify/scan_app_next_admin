
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import connect from "@/app/dbConfig/connect"
import { headers } from 'next/headers'

import User from "@/app/models/usersModel"
// Define interfaces for the user, response, and permission checks
interface User {
    id: string;
    email?: string;
    role?: string;
}

interface AuthResponse {
    success: boolean;
    message?: string;
    user?: User | null;
}

interface Permission {
    action: string;
    module: string;
}

export async function authMiddleware(request: NextRequest): Promise<AuthResponse> {
    try {
        await connect()
        const path = request.nextUrl.pathname;
        const method = request.method.toLowerCase();
        const session = await getServerSession(authOptions);
        const headersList = await headers()
        const appToken = headersList.get('appToken')
        if(appToken==process.env.APP_TOKEN_SECRET){
            return {
                success:true,
                message:"verified"
            }
        }

        if (!session?.user) {
            return {
                success: false,
                message: "Not Authorized",
            };
        }

        const { user } = session
        if (user) {
            // const userData = await User.findById(user._id);        
            if (!user) {
                return {
                    success: false,
                    message: "You are not authorized",
                };
            } else {

                return {

                    success: true,
                    user,
                    message:"verified"
                }
            }
        }
        return {
            success: false,
            message: "Not Authorized",
        };

    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
}


