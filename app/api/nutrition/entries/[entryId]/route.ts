import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ entryId: string }>;
}

// DELETE /api/nutrition/entries/[entryId]
export async function DELETE(
  _req: Request,
  { params }: RouteParams
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { entryId } = await params;

    const entry = await prisma.nutritionEntry.findFirst({
      where: {
        id: entryId,
        userId: user.id,
      },
    });

    if (!entry) {
      return NextResponse.json(
        { error: "Entry not found" },
        { status: 404 }
      );
    }

    await prisma.nutritionEntry.delete({
      where: {
        id: entry.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 }
    );
  }
}