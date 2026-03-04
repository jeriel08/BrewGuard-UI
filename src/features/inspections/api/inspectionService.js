import api from "@/lib/axios";

export const getInspections = async () => {
  const response = await api.get("/inspections");
  return response.data;
};

export const getInspectionById = async (id) => {
  const response = await api.get(`/inspections/${id}`);
  return response.data;
};

export const submitInspection = async (inspectionData) => {
  const response = await api.post("/inspections", inspectionData, {
    headers: {
      "Content-Type": "multipart/form-data", // Axios should handle boundary automatically with FormData, but let's be explicit or use standard practice.
      // ACTUALLY: The best practice with Axios + FormData is to let Axios detect it.
      // But our global instance forces application/json.
      // We need to override it.
      // Providing "multipart/form-data" usually works because Axios/Browser updates it with boundary.
    },
  });
  return response.data;
};

export const voidInspection = async (id) => {
  await api.put(`/inspections/${id}/void`);
};
