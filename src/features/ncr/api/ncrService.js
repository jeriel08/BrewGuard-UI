import axios from "@/lib/axios";

export const getNcrs = async () => {
  const response = await axios.get("/capa/ncrs");
  return response.data;
};

export const getPendingCapaNcrs = async () => {
  const response = await axios.get("/capa/ncrs/pending-capa");
  return response.data;
};

export const getNcrHistory = async () => {
  const response = await axios.get("/capa/ncrs/history");
  return response.data;
};
