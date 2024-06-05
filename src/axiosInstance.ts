import axios from "axios";
import { BASE_URL } from "./constants";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem("authData"); // Assuming you store the token in localStorage
    if (authData) {
      let { token } = JSON.parse(authData);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export type GET_OFFERS_API_PARAMS = {
  name?: string;
  priceMin?: number;
  priceMax?: number;
  price?: number;
  date?: number;
};

export const GET_OFFERS_API = (params?: GET_OFFERS_API_PARAMS) => {
  return api.get("/offers", {
    params,
  });
};

export const CREATE_OFFER_API = ({
  name,
  description,
  price,
}: {
  name: string;
  description: string;
  price: number;
}) => {
  return api.post("/offers", { name, description, price });
};

export const GET_CART_API = (userId: string) => {
  return api.get("/cartItems", {
    params: {
      userId,
    },
  });
};

export const UPSERT_CART_API = (data: any) => {
  return api.put("/cartItems", data);
};

export const CREATE_CHECKOUT = (data: any) => {
  return api.post("/checkout", data);
};

export const UPLOAD_DOCUMENT = (checkoutId: string, body: any) => {
  return api.post("/checkout/upload", body, { params: { checkoutId } });
};
