import api from "@/lib/axios";
import { Vehicle } from "@/types/vehicle";

export const getVehicles = async () => {
  const res = await api.get<Vehicle[]>("/vehicles");
  return res.data;
};

export const getVehicleById = async (id: number) => {
  const res = await api.get<Vehicle>(`/vehicles/${id}`);
  return res.data;
};

export const createVehicle = async (payload: Partial<Vehicle>) => {
  const res = await api.post("/vehicles", payload);
  return res.data;
};

export const updateVehicle = async (id: number, payload: Partial<Vehicle>) => {
  const res = await api.put(`/vehicles/${id}`, payload);
  return res.data;
};

export const deleteVehicle = async (id: number) => {
  const res = await api.delete(`/vehicles/${id}`);
  return res.data;
};
