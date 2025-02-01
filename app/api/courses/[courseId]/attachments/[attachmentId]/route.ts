import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string, attachmentId: string }> }
) {
    try {
       const { userId } = await auth();

       if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
       }

       const resolvedParams = await params;

       const courseOwner = await db.course.findUnique({
        where: {
            id: resolvedParams.courseId,
            userId: userId
        }
       });

       if (!courseOwner) {
        return new NextResponse("Unauthorized", { status: 401 });
       }
       const attachment = await db.attachment.delete({
        where: {
            courseId: resolvedParams.courseId,
            id: resolvedParams.attachmentId,
        }
       });

       return NextResponse.json(attachment);

    } catch (error) {
        console.log("ATTACHMENT_ID", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}