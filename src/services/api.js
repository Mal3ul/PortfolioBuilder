import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const portfolioService = {
  getPortfolio: async () => {
    const response = await api.get("/portfolio");
    return response.data;
  },

  updatePortfolio: async (data) => {
    const response = await api.put("/portfolio", data);
    return response.data;
  },
};

export default api;
