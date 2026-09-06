import api from "./api";

export interface AvailableSlot {
  startTime: string;
  endTime: string;
}

export const getAvailableSlots = async (
  doctorId: string,
  date: string
): Promise<AvailableSlot[]> => {
  const response = await api.get<AvailableSlot[]>(
    "/Schedule/available-slots",
    {
      params: {
        doctorId,
        date,
      },
    }
  );

  return response.data;
};