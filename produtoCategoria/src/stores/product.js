import { defineStore } from "pinia";
import axios from "axios";

export const useProductStore = defineStore({
  id: "product",
  state: () => ({
    products: [],
  }),
  actions: {
    async getAllProducts() {
      try {
        const { data } = await axios.get("http://localhost:4000/products?expand=category");
        this.products = data;
        return Promise.resolve();
      } catch (e) {
        console.error(e);
        if (e.response.status === 404)
          return Promise.reject(
            "Conexão com o banco falhou: Banco não encontrado"
          );
        return Promise.reject("Erro desconhecido ao acessar o banco");
      }
    },
    async saveProduct(product) {
      if (product.id) {
        return await this.updateProduct(product);
      } else {
        return await this.addProduct(product);
      }
    },
    async addProduct(product) {
      try {
        const { data } = await axios.post(
          "http://localhost:4000/products",
          product
        );
        this.products.push(data);
        return Promise.resolve("Produto adicionado com sucesso!");
      } catch (e) {
        console.error(e);
        return Promise.reject(e);
      }
    },
    async updateProduct(product) {
      try {
        const { data } = await axios.put(
          `http://localhost:4000/products/${product.id}`,
          product
        );
        const index = this.products.findIndex((p) => p.id === product.id);
        this.products.splice(index, 1, product);
        return Promise.resolve("Produto alterado com sucesso!");
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async deleteProduct(product_id) {
      try {
        await axios.delete(`http://localhost:4000/products/${product_id}`);
        const index = this.products.findIndex(
          (product) => product.id === product_id
        );
        this.products.splice(index, 1);
        return Promise.resolve();
      } catch (e) {
        return Promise.reject("Erro ao excluir");
      }
    },
  },
});
