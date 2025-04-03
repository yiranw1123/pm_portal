import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const siteConfig = {
  name: "PM Portal",
  description: "Project Management Portal",
  mainNav: [
    {
      title: "Projects",
      href: "/projects",
    },
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Tasks",
      href: "/tasks",
    },
  ],
} 