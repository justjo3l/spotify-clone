import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

import { server } from '../config';

export async function middleware(req:any) {

    // Token will exist if user is logged in
    const token = await getToken({ req, secret: process.env.JWT_SECRET as string });

    const { pathname } = req.nextUrl;

    // Redirect to home screen if token already exists
    if (token && pathname.includes('/login')) {
        return NextResponse.redirect(`${server}/`);
    }

    // Allow the requests if any of the following is true
    // 1) Its a request for the next-auth session & provider fetching
    // 2) The token exists

    if (pathname.includes('/api/auth') || token) {
        return NextResponse.next();
    }

    // Redirect to login if they dont have token and are requesting a protected route
    if (!token && pathname != '/login') {
        return NextResponse.redirect(`${server}/login`);
    }
}