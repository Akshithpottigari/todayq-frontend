import { create } from "zustand";

export const useStore = create<any>((set: any) => ({
  authData: localStorage.getItem("authData")
    ? JSON.parse(localStorage.getItem("authData") as any)
    : null,
  setAuthData: (newAuthData: any) =>
    set((state: any) => {
      localStorage.setItem("authData", JSON.stringify({ ...newAuthData }));
      return { authData: newAuthData };
    }),
}));
