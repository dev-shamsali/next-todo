import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    const todos = await prisma.todo.findMany();
    return Response.json(todos);
}

export async function POST(req) {
    const body = await req.json();

    if (!body.title || !body.title.trim()) {
        return new Response(
            JSON.stringify({ message: "Title is required" }),
            { status: 400 }
        );
    }

    const todo = await prisma.todo.create({
        data: { title: body.title },
    });

    return Response.json(todo);
}
