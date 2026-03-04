import axios from "@/lib/axios";

export const getCapaLogs = async () => {
  const response = await axios.get("/capa/logs");
  return response.data;
};

export const getCapaLogById = async (id) => {
  const response = await axios.get(`/capa/logs/${id}`);
  return response.data;
};

export const createCapaAnalysis = async (data) => {
  const response = await axios.post("/capa/analysis", data);
  return response.data;
};

export const createActionPlan = async (data) => {
  const response = await axios.post("/capa/actions", data);
  return response.data;
};

export const verifyAndCloseCapa = async (data) => {
  const response = await axios.post("/capa/close", data);
  return response.data;
};
