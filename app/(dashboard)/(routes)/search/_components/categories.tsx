// "use client";

// import { Category } from "@prisma/client";
// import {
//     FcEngineering,
//     FcFilmReel,
//     FcMultipleDevices,
//     FcMusic,
//     FcOldTimeCamera,
//     FcSalesPerformance,
//     FcSportsMode,
//     FcCurrencyExchange,
// } from "react-icons/fc";

// import { IconType  } from "react-icons";
// import { CategoryItem } from "./category-item";
// import { useRef, useState, useEffect } from "react";
// import { FaChevronLeft, FaChevronRight, FaMicrosoft, FaLanguage } from "react-icons/fa";
// import { CgWebsite } from "react-icons/cg";
// import { MdAppSettingsAlt } from "react-icons/md";

// interface CategoriesProps {
//     items: Category[];
// }

// const iconMap: Record<Category["name"], IconType> = {
//     "Music": FcMusic,
//     "Photography": FcOldTimeCamera,
//     "Fitness": FcSportsMode,
//     "Accounting": FcSalesPerformance,
//     "Computer Science": FcMultipleDevices,
//     "Filming": FcFilmReel,
//     "Web Development": CgWebsite,
//     "Language": FaLanguage,
//     "Economics": FcCurrencyExchange,
//     "Microsoft": FaMicrosoft,
//     "Engineering": FcEngineering,
//     "App Development": MdAppSettingsAlt ,
// };

// export const Categories = ({
//     items,
// } : CategoriesProps) => {
//     const scrollContainerRef = useRef<HTMLDivElement>(null);
//     const [showLeftArrow, setShowLeftArrow] = useState(false);
//     const [showRightArrow, setShowRightArrow] = useState(false);

//     // Function to check scroll position and show/hide arrows
//     const updateArrowsVisibility = () => {
//     if (scrollContainerRef.current) {
//         const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        
//         setShowLeftArrow(scrollLeft > 0);

//         // Ensure right arrow visibility logic is accurate
//         setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
//     }
//     };

//     // Function to handle smooth scrolling
//     const scroll = (direction: "left" | "right") => {
//     if (scrollContainerRef.current) {
//         const scrollAmount = 300; // Adjust scroll distance as needed
//         if (direction === "left") {
//         scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
//         } else {
//         scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
//         }
//     }
//     };

//     useEffect(() => {
//     updateArrowsVisibility();
//     const container = scrollContainerRef.current;
//     if (container) {
//         container.addEventListener("scroll", updateArrowsVisibility);
//         window.addEventListener("resize", updateArrowsVisibility);
//         return () => {
//         container.removeEventListener("scroll", updateArrowsVisibility);
//         window.removeEventListener("resize", updateArrowsVisibility);
//         };
//     }
//     }, [items]);

//     return ( 
    
//         <div className="relative w-full">
//             {/* Left Arrow - shown conditionally */}
//             {showLeftArrow && (
//                 <button
//                 aria-label="Scroll Left"
//                 className="absolute left-0 top-7 -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full shadow-md z-10"
//                 onClick={() => scroll("left")}
//                 >
//                 <FaChevronLeft />
//                 </button>
//             )}

//             {/* Category Items */}
//             <div
//                 ref={scrollContainerRef}
//                 className="flex items-center gap-x-2 overflow-x-auto scrollbar-hide pb-10 scroll-smooth"
//             >
//                 {items.map((item) => (
//                 <CategoryItem
//                     key={item.id}
//                     label={item.name}
//                     icon={iconMap[item.name]}
//                     value={item.id}  
//                 />
//             ))}
//             </div>

//             {/* Right Arrow - shown conditionally */}
//             {showRightArrow && (
//                 <button
//                 aria-label="Scroll Right"
//                 className="absolute right-0 top-6 md:top-7 -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full shadow-md z-10"
//                 onClick={() => scroll("right")}
//                 >
//                 <FaChevronRight />
//                 </button>
//             )}

//             {/* CSS to hide the scrollbar */}
//             <style jsx>{`
//                 .scrollbar-hide::-webkit-scrollbar {
//                 display: none;
//                 }
//                 .scrollbar-hide {
//                 -ms-overflow-style: none; /* IE and Edge */
//                 scrollbar-width: none; /* Firefox */
//                 }
//             `}</style>
//         </div>
//     );
// }

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
  FcCurrencyExchange,
} from "react-icons/fc";

import { IconType } from "react-icons";
import { CategoryItem } from "./category-item";
import { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaMicrosoft, FaLanguage } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { MdAppSettingsAlt } from "react-icons/md";

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
  "Web Development": CgWebsite,
  "Language": FaLanguage,
  "Economics": FcCurrencyExchange,
  "Microsoft": FaMicrosoft,
  "Engineering": FcEngineering,
  "App Development": MdAppSettingsAlt,
};

export const Categories = ({ items }: CategoriesProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"right" | "left">("right");

  // Function to check scroll position and show/hide arrows
  const updateArrowsVisibility = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
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

  // Auto-scrolling effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollContainerRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

      if (scrollDirection === "right") {
        if (scrollLeft + clientWidth >= scrollWidth) {
          setScrollDirection("left");
        } else {
          scroll("right");
        }
      } else {
        if (scrollLeft <= 0) {
          setScrollDirection("right");
        } else {
          scroll("left");
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [scrollDirection]);

  return (
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
          <CategoryItem key={item.id} label={item.name} icon={iconMap[item.name]} value={item.id} />
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
};
