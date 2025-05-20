import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getPriorityClass(priority: string) {
    switch (priority) {
        case "High":
            return "text-red-600 font-bold";
        case "Medium":
            return "text-yellow-600 font-bold";
        case "Low":
            return "text-green-600 font-bold";
    }
}
