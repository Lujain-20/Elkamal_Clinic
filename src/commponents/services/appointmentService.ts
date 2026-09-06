import api from "./api";

export interface CreateAppointmentData {
  doctorId: string;
  patientName: string;
  patientPhoneNumber: string;
  appointmentType:
    | "Checkup"
    | "TreatmentSession"
    | "OrthodonticFollowUp";
  scheduledAt: string;
  notes?: string;
}

export interface CreatedAppointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  appointmentType: string;
  scheduledAt: string;
  status: string;
}

export const createAppointment = async (
  data: CreateAppointmentData
): Promise<CreatedAppointment> => {
  const response = await api.post<CreatedAppointment>(
    "/Appointments",
    data
  );


  
  return response.data;
};
// My Appointments

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  appointmentType: string;
  scheduledAt: string;
  status: string;
}

export const getAppointmentsByPhone = async (
  phoneNumber: string
): Promise<Appointment[]> => {
  const response = await api.get<Appointment[]>(
    `/Appointments/by-phone/${phoneNumber}`
  );
  return response.data;
};

export const cancelAppointment = async (
  appointmentId: string
): Promise<void> => {
  await api.patch(`/Appointments/${appointmentId}/cancel`);
};