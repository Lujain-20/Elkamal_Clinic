// src/constants/appointment.ts

/* =========================================================
   STATUS
========================================================= */

export const AppointmentStatus = {
  Pending: "Pending",
  Confirmed: "Confirmed",
  Completed: "Completed",
  Cancelled: "Cancelled",
  Declined: "Declined",
} as const;

export type AppointmentStatusValue =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

const statusTranslationKeys: Record<AppointmentStatusValue, string> = {
  [AppointmentStatus.Pending]: "pending",
  [AppointmentStatus.Confirmed]: "confirmed",
  [AppointmentStatus.Completed]: "completed",
  [AppointmentStatus.Cancelled]: "cancelled",
  [AppointmentStatus.Declined]: "declined",
};

export const getStatusTranslationKey = (status: string): string => {
  return statusTranslationKeys[status as AppointmentStatusValue] ?? "pending";
};

export const isCancellableStatus = (status: string): boolean => {
  return (
    status === AppointmentStatus.Pending ||
    status === AppointmentStatus.Confirmed
  );
};

/* =========================================================
   APPOINTMENT TYPE
========================================================= */

export const AppointmentType = {
  Checkup: "Checkup",
  TreatmentSession: "TreatmentSession",
  OrthodonticFollowUp: "OrthodonticFollowUp",
} as const;

export type AppointmentTypeValue =
  (typeof AppointmentType)[keyof typeof AppointmentType];

const appointmentTypeTranslationKeys: Record<AppointmentTypeValue, string> = {
  [AppointmentType.Checkup]: "generalCheckup",
  [AppointmentType.TreatmentSession]: "treatmentSession",
  [AppointmentType.OrthodonticFollowUp]: "orthodonticFollowUp",
};

export const getAppointmentTypeTranslationKey = (
  type: string
): string | null => {
  return appointmentTypeTranslationKeys[type as AppointmentTypeValue] ?? null;
};