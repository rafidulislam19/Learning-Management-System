"use client";

import { Category } from "@prisma/client";
import {
    FcEngineering,
    FcFilmReel,
    FcMultipleDevices,
    FcMusic,
    FcOldTimeCamera,
    FcSalesPerformance,
    FcSportsMode,
    FcOnlineSupport,
    FcCurrencyExchange,
    FcSmartphoneTablet,
    FcGoogle
} from "react-icons/fc";

import { IconType  } from "react-icons";
import { CategoryItem } from "./category-item";
import { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    "Music": FcMusic,
    "Photography": FcOldTimeCamera,
    "Fitness": FcSportsMode,
    "Accounting": FcSalesPerformance,
    "Computer Science": FcMultipleDevices,
    "Filming": FcFilmReel,
    "Web Development": FcMultipleDevices,
    "Language": FcOnlineSupport,
    "Economics": FcCurrencyExchange,
    "Microsoft": FcGoogle,
    "Engineering": FcEngineering,
    "App Development": FcSmartphoneTablet ,
};

export const Categories = ({
    items,
} : CategoriesProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    // Function to check scroll position and show/hide arrows
    const updateArrowsVisibility = () => {
    if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        
        setShowLeftArrow(scrollLeft > 0);

        // Ensure right arrow visibility logic is accurate
        setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
    };

    // Function to handle smooth scrolling
    const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
        const scrollAmount = 300; // Adjust scroll distance as needed
        if (direction === "left") {
        scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        } else {
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    }
    };

    useEffect(() => {
    updateArrowsVisibility();
    const container = scrollContainerRef.current;
    if (container) {
        container.addEventListener("scroll", updateArrowsVisibility);
        window.addEventListener("resize", updateArrowsVisibility);
        return () => {
        container.removeEventListener("scroll", updateArrowsVisibility);
        window.removeEventListener("resize", updateArrowsVisibility);
        };
    }
    }, [items]);

    return ( 
        // <div className="flex items-center gap-x-2 overflow-x-auto pb-10">
        //     {items.map((item) => (
        //         <CategoryItem
        //             key={item.id}
        //             label={item.name}
        //             icon={iconMap[item.name]}
        //             value={item.id}  
        //         />
        //     ))}
        // </div>
        <div className="relative w-full">
            {/* Left Arrow - shown conditionally */}
            {showLeftArrow && (
                <button
                aria-label="Scroll Left"
                className="absolute left-0 top-7 -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full shadow-md z-10"
                onClick={() => scroll("left")}
                >
                <FaChevronLeft />
                </button>
            )}

            {/* Category Items */}
            <div
                ref={scrollContainerRef}
                className="flex items-center gap-x-2 overflow-x-auto scrollbar-hide pb-10 scroll-smooth"
            >
                {items.map((item) => (
                <CategoryItem
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}  
                />
            ))}
            </div>

            {/* Right Arrow - shown conditionally */}
            {showRightArrow && (
                <button
                aria-label="Scroll Right"
                className="absolute right-0 top-6 md:top-7 -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full shadow-md z-10"
                onClick={() => scroll("right")}
                >
                <FaChevronRight />
                </button>
            )}

            {/* CSS to hide the scrollbar */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                display: none;
                }
                .scrollbar-hide {
                -ms-overflow-style: none; /* IE and Edge */
                scrollbar-width: none; /* Firefox */
                }
            `}</style>
        </div>
    );
}
