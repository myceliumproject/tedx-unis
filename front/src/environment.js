const devUrlApi = "http://localhost:8080";
const prodUrlApi = import.meta.env.VITE_PROD_API_URL ?? devUrlApi;

export const urlApi =
  import.meta.env.MODE === "production" ? prodUrlApi : devUrlApi;
