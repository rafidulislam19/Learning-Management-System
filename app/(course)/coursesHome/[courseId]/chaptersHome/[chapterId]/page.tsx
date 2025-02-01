import { Banner } from "@/components/banner";
import { redirect } from "next/navigation";
import { VideoPlayerHome } from "./_components/video-player-home";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";

import { getChapterHome } from "@/actions/get-chapter-home";

const ChapterHomeIdPage = async ({
    params
} : {
    params: Promise<{ courseId: string; chapterId: string }>
}) => {

    const resolvedParams = await params;

    const {
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
    } = await getChapterHome({
        chapterId: resolvedParams.chapterId,
        courseId: resolvedParams.courseId,
    });

    if (!chapter || !course) {
        return redirect("/");
    }

    const isLocked = !chapter.isFree;

    return ( 
        <div>
            {isLocked && (
                <Banner
                    variant="warning"
                    label="You need to purchase this course to watch this chapter."
                />
            )}

            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    {/* <VideoPlayerHome
                        chapterId={resolvedParams.chapterId}
                        title={chapter.title}
                        courseId={resolvedParams.courseId}
                        nextChapterId={nextChapter?.id!}
                        playbackId={muxData?.playbackId!}
                        isLocked={isLocked}                        
                    /> */}

                    <VideoPlayerHome
                        chapterId={resolvedParams.chapterId}
                        title={chapter.title}
                        courseId={resolvedParams.courseId}
                        nextChapterId={nextChapter?.id || ""}
                        playbackId={muxData?.playbackId || ""}
                        isLocked={isLocked}                        
                    />
                </div>
                <div>
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                        <h2 className="text-2xl font-semibold mb-2">
                            {chapter.title}
                        </h2>
                        {/* <CourseEnrollButton
                            courseId={resolvedParams.courseId}
                            price={course.price!}
                        /> */}

                        <CourseEnrollButton
                            courseId={resolvedParams.courseId}
                            price={course.price ?? 0} 
                        />

                    </div>
                    <Separator />
                    <div>
                        <Preview value={chapter.description || "No description available"} />
                    </div>
                    { !!attachments.length && (
                        <>
                            <Separator />
                            <div className="p-4">
                                {attachments.map((attachment) => (
                                    <a
                                    href={attachment.url}
                                    target="_blank"
                                    key={attachment.id}
                                    className="flex items-center p-3 w-full bg-sky-200 borer text-sky-700 rounded-md hover:underline">
                                        <File />
                                        <p className="line-clamp-1">
                                            {attachment.name}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
     );
}
 
export default ChapterHomeIdPage;