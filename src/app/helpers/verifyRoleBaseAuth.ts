
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { authOptions } from "../api/auth/[...nextauth]/options";
import {connect} from "@/app/db/config/db.config"

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
        const db=await connect()
        const path = request.nextUrl.pathname;
        const method = request.method.toLowerCase();
        const session = await getServerSession(authOptions);
        console.log("session?.expires",session?.expires)

        // console.log("--request details--", { path, method });
        console.log("-----middleware--session-", session);
        // console.log("-----middleware--user-", Boolean(session?.user));

        if (!session?.user) {
            return {
                success: false,
                message: "Not Authorized S01",
            };
        }

        const { user } = session;
        // console.log("User Data from nextauth", user)
        // if (user.isVerified) {
        //     return { success: true, }

        // }
        if (user) {
            
            const email = user.email;

            // Mock user fetching, replace with actual database fetch
            const userData = await db.user.findOne({where:{email:email}});
            // console.log("User", userData)

            if (!user) {
                return {
                    success: false,
                    message: "Not Authorized A01",
                };
            }

            // Check if the user has the required permissions
            const isAllowed = await authorizeRequest(method, path, user);

            if (isAllowed) {
                return {
                    success: true,
                    message: "Success",
                    user: user,
                };
            } else {
                return {
                    success: false,
                    message: "Access Denied",
                    user: null,
                };
            }
        }

        return {
            success: false,
            message: "Not Authorized U01",
        };

    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
}

const authorizeRequest = async (method: string, path: string, user: User): Promise<boolean> => {
    let action: string;
    const segmentUrl = path.split('/').pop() || '';

    switch (method) {
        case 'get':
            action = 'view';
            break;
        case 'post':
            action = 'add';
            break;
        case 'put':
            action = 'edit';
            break;
        case 'delete':
            action = 'delete';
            break;
        default:
            action = 'view';
    }

    console.log("Authorization check for user", { segmentUrl, action, user });

    // Mock role-based authorization, replace with actual logic
    const userRole = user.role || 'guest'; // Replace with role-fetching logic

    // Example permission rules based on roles
    const permissions: Record<string, string[]> = {
        admin: ['view', 'add', 'edit', 'delete'],
        editor: ['view', 'edit'],
        viewer: ['view'],
        guest:['view'],
    };

    const allowedActions = permissions[userRole] || [];
    return allowedActions.includes(action);
};
