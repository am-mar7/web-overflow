import { NextResponse } from "next/server";

interface ActionResponse<T = null>{
    success : boolean;
    data?: T;
    error?:{
        message:string;
        details?: Record<string , string[]>;
    }
    status?: number;
}

type SuccessResponse<T = null> = ActionResponse<T> & {success : true};
type ErrorResponse = ActionResponse<undefined> & {success : false};
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;
type APIErrorResponse = NextResponse<ErrorResponse>;


interface Tag{
    id:string;
    name:string;
}

interface Author {
    id:string;
    name:string;
    avatarUrl?:string;
}

interface Question{
    title : string;
    id: string;
    createdAt: Date;
    updatedAt?: Date;
    upvotes: number;
    answers:number;
    views:number;
    author :Author;
    tags: Tag[];
}