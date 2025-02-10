"use client";

import { Chapter, Quiz } from "@prisma/client";
import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";

import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChaptersListProps {
    items: (Chapter | Quiz)[];
    onReorder: (updateData: { id: string; position: number; type: string }[]) => void;
    onEditChapter: (id: string) => void;
    onEditQuiz: (id: string) => void;
}

export const ChaptersList = ({
    items,
    onReorder,
    onEditChapter,
    onEditQuiz,
}: ChaptersListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [chaptersAndQuizzes, setChaptersAndQuizzes] = useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setChaptersAndQuizzes(items);
    }, [items]);

    // const onDragEnd = (result: DropResult) => {
    //     if (!result.destination) return;
    
    //     const items = Array.from(chaptersAndQuizzes);
    //     const [reorderedItem] = items.splice(result.source.index, 1);
    //     items.splice(result.destination.index, 0, reorderedItem);
    
    //     // Update the positions of all items
    //     const updatedItems = items.map((item, index) => ({
    //         ...item,
    //         position: index,
    //     }));

    //     console.log(updatedItems);
    
    //     setChaptersAndQuizzes(updatedItems);
    
    //     // Prepare the data to send to the API
    //     const bulkUpdateData = updatedItems.map((item) => ({
    //         id: item.id,
    //         position: item.position,
    //         type: item.type,
    //     }));
    
    //     onReorder(bulkUpdateData);
    // };
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
    
        const updatedItems = Array.from(chaptersAndQuizzes);
        const [movedItem] = updatedItems.splice(result.source.index, 1);
        updatedItems.splice(result.destination.index, 0, movedItem);
    
        // Reassign position based on the new index
        const reorderedData = updatedItems.map((item, index) => ({
            ...item,
            position: index,  // Important: update position field
        }));
    
        setChaptersAndQuizzes(reorderedData);
    
        const bulkUpdateData = reorderedData.map((item) => ({
            id: item.id,
            position: item.position,
            type: item.type,  // Make sure 'type' is correctly set as 'chapter' or 'quiz'
        }));
    
        onReorder(bulkUpdateData);
    };
    

    if (!isMounted) {
        return null;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters-and-quizzes">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {chaptersAndQuizzes.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided) => (
                                    <div
                                        className={cn(
                                            "flex items-center gap-x-2 bg-slate-200 dark:bg-slate-300 border-slate-200 dark:border-slate-300 border text-slate-700 rounded-md mb-4 text-sm",
                                            'isPublished' in item && item.isPublished && "bg-sky-100 dark:bg-sky-200 border-sky-200 dark:border-sky-300 text-sky-700"
                                        )}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                    >
                                        <div
                                            className={cn(
                                                "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 dark:hover:bg-slate-200 rounded-l-md transition",
                                                'isPublished' in item && item.isPublished && "border-r-sky-200 dark:border-r-sky-300 hover:bg-sky-200 dark:hover:bg-sky-300"
                                            )}
                                            {...provided.dragHandleProps}
                                        >
                                            <Grip className="h-5 w-5" />
                                        </div>
                                        {item.title}
                                        <div className="ml-auto pr-2 flex items-center gap-x-2">
                                            {'isFree' in item && item.isFree && (
                                                <Badge>Free</Badge>
                                            )}
                                            <Badge
                                                className={cn(
                                                    "bg-slate-500 dark:bg-slate-400",
                                                    'isPublished' in item && item.isPublished && "bg-sky-700 dark:bg-sky-500"
                                                )}
                                            >
                                                {item.isPublished ? "Published" : "Draft"}
                                            </Badge>
                                            <Pencil
                                                onClick={() =>
                                                    item.type === "chapter"
                                                        ? onEditChapter(item.id)
                                                        : onEditQuiz(item.id)
                                                }
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
    );
};