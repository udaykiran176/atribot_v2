import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handler = toNextJsHandler(auth);

export async function GET(request: NextRequest) {
    try {
        console.log('Auth GET request:', request.url);
        const response = await handler.GET(request);
        
        // Add CORS headers for production
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        console.log('Auth GET response status:', response.status);
        return response;
    } catch (error) {
        console.error('Auth GET error:', error);
        return NextResponse.json({ 
            error: 'Internal server error', 
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('Auth POST request:', request.url);
        const response = await handler.POST(request);
        
        // Add CORS headers for production
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        console.log('Auth POST response status:', response.status);
        return response;
    } catch (error) {
        console.error('Auth POST error:', error);
        return NextResponse.json({ 
            error: 'Internal server error', 
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}