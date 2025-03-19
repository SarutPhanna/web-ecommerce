import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { listCategory } from "../api/category";
import { listProduct } from "../api/product";

const ecomStore = (set) => ({
  user: null,
  token: null,
  categoris: [],
  products: [],

  actionLogin: async (form) => {
    const res = await axios.post("http://localhost:1010/api/login/", form);
    set({
      user: res.data.payload,
      token: res.data.token,
    });
    return res;
  },

  getCategory: async (token) => {
    try {
      const res = await listCategory(token);
      const sortedCategories = res.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      set({ categoris: sortedCategories });
    } catch (error) {
      console.log(error);
    }
  },

  getProduct: async (token, count) => {
    try {
      const res = await listProduct(token, count);
      // const sortedProducts = await res.data.sort((a, b) =>
      //   a.name.localeCompare(b.name)
      // );
      set({ products: res.data });
    } catch (error) {
      console.log(error);
    }
  },
});

const usePersist = {
  name: "ecom-store", // set key in local storage
  storage: createJSONStorage(() => localStorage),
};

const useEcomStore = create(persist(ecomStore, usePersist));

export default useEcomStore;
