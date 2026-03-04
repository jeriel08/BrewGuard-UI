import api from "@/lib/axios";

export const getSuppliers = async () => {
  const response = await api.get("/inventory/suppliers");
  return response.data;
};

export const getArchivedSuppliers = async () => {
  const response = await api.get("/inventory/suppliers/archived");
  return response.data;
};

export const archiveSupplier = async (id) => {
  const response = await api.patch(`/inventory/suppliers/${id}/archive`);
  return response.data;
};

export const unarchiveSupplier = async (id) => {
  const response = await api.patch(`/inventory/suppliers/${id}/restore`);
  return response.data;
};

export const receiveShipment = async (shipmentData) => {
  const response = await api.post("/inventory/shipments", shipmentData);
  return response.data;
};

export const addSupplier = async (supplierData) => {
  const response = await api.post("/inventory/suppliers", supplierData);
  return response.data;
};

export const updateSupplier = async (id, supplierData) => {
  const response = await api.put(`/inventory/suppliers/${id}`, supplierData);
  return response.data;
};
