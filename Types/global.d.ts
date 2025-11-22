interface Tag{
    id:string;
    name:string;
}

interface Author {
    id:string;
    name:string;
    avatarUrl:string;
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