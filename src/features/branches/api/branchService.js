import api from "@/lib/axios";

export const branchService = {
  getAllBranches: async () => {
    const { data } = await api.get("/branches");
    return data;
  },

  getBranchById: async (id) => {
    const { data } = await api.get(`/branches/${id}`);
    return data;
  },

  createBranch: async (branchData) => {
    const { data } = await api.post("/branches", branchData);
    return data;
  },

  updateBranch: async (id, branchData) => {
    const { data } = await api.put(`/branches/${id}`, branchData);
    return data;
  },

  deleteBranch: async (id) => {
    await api.delete(`/branches/${id}`);
  },
};
