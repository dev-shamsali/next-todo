import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req, ctx) {
    const { id } = await ctx.params;
    const body = await req.json();

    const todo = await prisma.todo.update({
        where: { id: Number(id) },
        data: {
            ...(body.completed !== undefined && { completed: body.completed }),
            ...(body.title !== undefined && { title: body.title }),
        },
    });

    return Response.json(todo);
}

export async function DELETE(req, ctx) {
    const { id } = await ctx.params;

    await prisma.todo.delete({
        where: { id: Number(id) },
    });

    return Response.json({ success: true });
}
