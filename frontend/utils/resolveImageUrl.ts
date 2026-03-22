export const resolveImageUrl = (url: string | undefined): string => {
  if (!url) return "";
  
  // If it's already an absolute URL (http/https), return it
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  
  // If it's a relative path (starts with /), prefix it with the API base URL
  // Strip '/api' from the base URL to get the server root
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
  const serverRoot = apiBaseUrl.replace(/\/api$/, "");
  
  // Ensure we don't have double slashes
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  return `${serverRoot}${cleanUrl}`;
};
