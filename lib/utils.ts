import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFaviconUrl(url: string) {
  try {
    const urlObj = url.startsWith("http") ? new URL(url) : new URL(`https://${url}`);
    return `https://s2.googleusercontent.com/s2/favicons?domain=${urlObj.hostname}`;
  } catch (e) {
    return "";
  }
}
