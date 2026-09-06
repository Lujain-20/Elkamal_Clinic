import api from "./api";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
}

export const getDoctors = async (): Promise<Doctor[]> => {
  const response = await api.get<Doctor[]>("/Doctors");
  return response.data;
};

/* =========================================================
   ADD TO: src/services/doctorService.ts
   (keep the existing Doctor interface / getDoctors export as
   they are — just append this)
========================================================= */

export interface DoctorPhoto {
  id: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  description: string;
  displayOrder: number;
}

export const getDoctorPhotos = async (
  doctorId: string
): Promise<DoctorPhoto[]> => {
  const response = await api.get<DoctorPhoto[]>(
    `/Doctors/${doctorId}/photos`
  );

  return response.data;
};