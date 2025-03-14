import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const ingredients = await prisma.ingredient.findMany();

    return NextResponse.json(ingredients)   
}
