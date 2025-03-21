import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "@/components/icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface CourseCardHomeProps {
    id: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    price: number;
    category: string;
}
export const CourseCardHome = async ({
    id,
    title,
    imageUrl,
    chaptersLength,
    price,
    category
}: CourseCardHomeProps) => {
    
    return ( 
        <Link href={`/coursesHome/${id}`}>
            <div className="group hover:shadow-sm transition overflow-hidden border dark:border-2 rounded-lg p-3 h-full">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image
                        fill
                        className="object-cover"
                        alt={title}
                        src={imageUrl}
                    />
                </div>
                <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-xl font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {title}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {category}
                    </p>
                    <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500 dark:text-slate-400">
                            <IconBadge size="sm" icon={BookOpen} />
                            <span>
                                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
                            </span>
                        </div>
                    </div>
                    <p className="text-md md:text-sm font-medium text-slate-700 dark:text-slate-300">
                            {formatPrice(price)}
                    </p>
                </div>
            </div>
        </Link>
     );
}