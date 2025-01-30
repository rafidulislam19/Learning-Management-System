"use client"

import { Chapter } from "@prisma/client"
import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd"

import { cn } from "@/lib/utils"
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChaptersListProps {
    items: Chapter[];
    onReorder: (updateData: { id: string; position: number}[]) => void;
    onEditChapter: (id: string) => void;
    onEditQuiz: (id: string) => void;
}
export const ChaptersList = ({
    items,
    onReorder,
    onEditChapter,
    onEditQuiz,
} : ChaptersListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [chapters, setChapters] = useState(items);

        useEffect(() => {
            setIsMounted(true);
    }, []);

    useEffect (() => {
        setChapters(items);
    }, [items]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(chapters);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);
        
        const updatedChapters = items.slice(startIndex, endIndex + 1);

        setChapters(items);

        const bulkUpdateData = updatedChapters.map((chapter) => ({
            id: chapter.id,
            position: items.findIndex((item) => item.id === chapter.id)
        }));

        onReorder(bulkUpdateData);
    }

    if (!isMounted) {
        return null;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {chapters.map((chapter,index) =>(
                            <Draggable key={chapter.id}
                            draggableId={chapter.id}
                            index={index}>
                                {(provided) => (
                                    <div className={cn(
                                        "flex items-center gap-x-2 bg-slate-200 dark:bg-slate-300 border-slate-200 dark:border-slate-300 border text-slate-700 rounded-md mb-4 text-sm",
                                        chapter.isPublished && "bg-sky-100 dark:bg-sky-200 border-sky-200 dark:border-sky-300 text-sky-700"
                                    )}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    >
                                        <div className={cn(
                                            "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 dark:hover:bg-slate-200 rounded-l-md transition",
                                            chapter.isPublished && "border-r-sky-200 dark:border-r-sky-300 hover:bg-sky-200 dark:hover:bg-sky-300"
                                        )}
                                        {...provided.dragHandleProps}
                                        >
                                            <Grip 
                                            className="h-5 w-5"
                                            />
                                        </div>
                                        {chapter.title}
                                        <div className="ml-auto pr-2 flex items-center gap-x-2">
                                            {chapter.isFree && (
                                                <Badge>
                                                    Free
                                                </Badge>
                                            )}
                                            <Badge
                                            className={cn(
                                                "bg-slate-500 dark:bg-slate-400", chapter.isPublished && "bg-sky-700 dark:bg-sky-500"
                                            )}>
                                                {chapter.isPublished ? "Published" : "Draft"}
                                            </Badge>
                                            <Pencil 
                                            onClick={() => onEditChapter(chapter.id)}
                                            className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                                            />
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}

// "use client";

// import { Chapter, Quiz } from "@prisma/client";
// import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
// import { cn } from "@/lib/utils";
// import { Grip, Pencil } from "lucide-react";

// interface ChaptersListProps {
//     items: (Chapter | Quiz)[];
//     onReorder: (updateData: { id: string; position: number }[]) => void;
//     onEditChapter: (id: string) => void;
//     onEditQuiz: (id: string) => void;
// }

// export const ChaptersList = ({ items, onReorder, onEditChapter, onEditQuiz }: ChaptersListProps) => {
//     const onDragEnd = (result: DropResult) => {
//         if (!result.destination) return;

//         const reorderedItems = Array.from(items);
//         const [movedItem] = reorderedItems.splice(result.source.index, 1);
//         reorderedItems.splice(result.destination.index, 0, movedItem);

//         onReorder(
//             reorderedItems.map((item, index) => ({ id: item.id, position: index }))
//         );
//     };

//     return (
//         <DragDropContext onDragEnd={onDragEnd}>
//             <Droppable droppableId="content">
//                 {(provided) => (
//                     <div {...provided.droppableProps} ref={provided.innerRef}>
//                         {items.map((item, index) => (
//                             <Draggable key={item.id} draggableId={item.id} index={index}>
//                                 {(provided) => (
//                                     <div ref={provided.innerRef} {...provided.draggableProps} className="flex items-center gap-2">
//                                         <Grip {...provided.dragHandleProps} />
//                                         <span>{item.title}</span>
//                                         <Pencil onClick={() => item.constructor.name === "chapter" ? onEditChapter(item.id) : onEditQuiz(item.id)} />
//                                     </div>
//                                 )}
//                             </Draggable>
//                         ))}
//                         {provided.placeholder}
//                     </div>
//                 )}
//             </Droppable>
//         </DragDropContext>
//     );
// };
