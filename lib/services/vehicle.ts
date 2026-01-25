import api from "@/lib/axios";
import { Vehicle } from "@/types/vehicle";

export const getVehicles = async (): Promise<Vehicle[]> => {
  const res = await api.get("/v1/vehicles");
  return res.data.data; 
};

export const getVehicleById = async (id: number): Promise<Vehicle> => {
  const res = await api.get(`/v1/vehicles/${id}`);
  return res.data.data; 
};

export const createVehicle = async (payload: Partial<Vehicle>): Promise<Vehicle> => {
  const res = await api.post("/v1/vehicles", payload);
  return res.data.data;
};

export const updateVehicle = async (id: number, payload: Partial<Vehicle>): Promise<Vehicle> => {
  const res = await api.put(`/v1/vehicles/${id}`, payload);
  return res.data.data;
};

export const deleteVehicle = async (id: number): Promise<void> => {
  await api.delete(`/v1/vehicles/${id}`);
};