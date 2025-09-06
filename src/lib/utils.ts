import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const uploadFile = async (file: File): Promise<string> => {
  const apiKey = "16fd87809fb1ea1bb1d34f2f8d1dcf03"; // Replace with your ImgBB API key
  const formData = new FormData();
  formData.append("image", file);
  
  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok){
      const errorData = await response.json();
      console.error("Upload failed:", errorData);
throw new Error(`Upload failed: ${errorData?.error?.message || response.statusText}`);
    } 
    
    const data = await response.json();
    return data.data.url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};