"use client"

import { cn } from "@/lib/utils";
import { IconType } from "react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface CategoryItemProps {
    label: string;
    value?: string;
    icon?: IconType;
}

export const CategoryItem = ({
    label,
    value,
    icon: Icon,

}: CategoryItemProps) => {

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams.get("categoryId");
    const currentTitle =  searchParams.get("title");

    const isSelected = currentCategoryId === value;

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: currentTitle,
                categoryId: isSelected ? null : value,
            }
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);
    };

    return ( 
        <button
        onClick={onClick}
        className={cn(
            "py-3 px-3 text-gray-700 dark:text-gray-300 text-sm md:text-lg border border-slate-300 rounded-full flex items-center gap-x-1 hover:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-200/30 transition",
            isSelected && "border-sky-800 bg-sky-200/20 dark:bg-sky-200/30 text-sky-800 dark:text-sky-100" 
        )}
        type="button"
        >
           { Icon && <Icon size={20} />}
           <div className="truncate">
             { label }
           </div>
        </button>
     );
}
