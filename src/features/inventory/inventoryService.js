import api from "@/lib/axios";

export const getItems = async () => {
  const response = await api.get("/inventory/items");
  return response.data;
};

export const getArchivedItems = async () => {
  const response = await api.get("/inventory/items/archived");
  return response.data;
};

export const archiveItem = async (id) => {
  const response = await api.patch(`/inventory/items/${id}/archive`);
  return response.data;
};

export const unarchiveItem = async (id) => {
  const response = await api.patch(`/inventory/items/${id}/restore`);
  return response.data;
};

export const getBatches = async () => {
  const response = await api.get("/inventory/batches");
  return response.data;
};

export const getArchivedBatches = async () => {
  const response = await api.get("/inventory/batches/archived");
  return response.data;
};

export const archiveBatch = async (id) => {
  const response = await api.patch(`/inventory/batches/${id}/archive`);
  return response.data;
};

export const unarchiveBatch = async (id) => {
  const response = await api.patch(`/inventory/batches/${id}/restore`);
  return response.data;
};

// Production
export const createProductionBatch = async (data) => {
  const response = await api.post("/inventory/production", data);
  return response.data;
};

export const updateProductionBatch = async (id, data) => {
  const response = await api.put(`/inventory/production/${id}`, data);
  return response.data;
};

export const addItem = async (itemData) => {
  const response = await api.post("/inventory/items", itemData);
  return response.data;
};

export const updateItem = async (id, itemData) => {
  const response = await api.put(`/inventory/items/${id}`, itemData);
  return response.data;
};

export const getItemById = async (id) => {
  const response = await api.get(`/inventory/items/${id}`);
  return response.data;
};

export const getBatchesByItemId = async (itemId) => {
  const response = await api.get(`/inventory/items/${itemId}/batches`);
  return response.data;
};

export const getShipments = async () => {
  const response = await api.get("/inventory/shipments");
  return response.data;
};

export const getShipmentById = async (id) => {
  const response = await api.get(`/inventory/shipments/${id}`);
  return response.data;
};

export const getArchivedShipments = async () => {
  const response = await api.get("/inventory/shipments/archived");
  return response.data;
};

export const archiveShipment = async (id) => {
  const response = await api.patch(`/inventory/shipments/${id}/archive`);
  return response.data;
};

export const unarchiveShipment = async (id) => {
  const response = await api.patch(`/inventory/shipments/${id}/restore`);
  return response.data;
};

export const updateShipment = async (id, data) => {
  const response = await api.put(`/inventory/shipments/${id}`, data);
  return response.data;
};
