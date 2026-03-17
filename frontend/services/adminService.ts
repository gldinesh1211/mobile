import api from "./apiClient";

import type { Product, Order, User } from "./types";



export const getAdminUsers = async (token: string): Promise<User[]> => {

  const res = await api.get<User[]>("/admin/users", {

    headers: { Authorization: `Bearer ${token}` }

  });

  return res.data;

};



export const getAdminOrders = async (token: string): Promise<Order[]> => {

  const res = await api.get<Order[]>("/orders", {

    headers: { Authorization: `Bearer ${token}` }

  });

  return res.data;

};



export const getAdminProducts = async () => {

  const res = await api.get<{ items: Product[] }>("/products");

  return res.data;

};



export const createProduct = async (
  payload: { name: string; price: number; description?: string; brand?: string; stock?: number; category?: string },
  token: string
) => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("price", String(payload.price));
  if (payload.description) formData.append("description", payload.description);
  if (payload.brand) formData.append("brand", payload.brand);
  if (payload.stock !== undefined) formData.append("stock", String(payload.stock));
  if (payload.category) formData.append("category", payload.category);



  const res = await api.post<Product>("/products", formData, {

    headers: {

      Authorization: `Bearer ${token}`,

      "Content-Type": "multipart/form-data"

    }

  });

  return res.data;

};



export const deleteProduct = async (id: string, token: string) => {

  await api.delete(`/products/${id}`, {

    headers: { Authorization: `Bearer ${token}` }

  });

};



export const updateProduct = async (
  id: string,
  payload: { name: string; price: number; description?: string; category?: string; stock?: number },
  token: string
) => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("price", String(payload.price));
  if (payload.description) formData.append("description", payload.description);
  if (payload.category) formData.append("category", payload.category);
  if (payload.stock !== undefined) formData.append("stock", String(payload.stock));

  const res = await api.put<Product>(`/products/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data;
};



export const uploadProductImages = async (
  productId: string,
  images: File[],
  token: string
) => {
  const formData = new FormData();
  images.forEach((image, index) => {
    formData.append(`images`, image);
  });

  const res = await api.post(`/products/${productId}/images`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data;
};



