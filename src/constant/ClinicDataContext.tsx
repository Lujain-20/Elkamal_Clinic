import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import { getDoctors, getDoctorPhotos } from "../commponents/services/doctorService";
import type { Doctor, DoctorPhoto } from "../commponents/services/doctorService";

/* =========================================================
   TYPES
========================================================= */

export type DoctorWithPhotos = {
  doctor: Doctor;
  photos: DoctorPhoto[];
};

interface ClinicDataContextValue {
  doctors: Doctor[];
  doctorsWithPhotos: DoctorWithPhotos[];
  loading: boolean;
  error: boolean;
  refetch: () => void;
}

/* =========================================================
   CONTEXT
========================================================= */

const ClinicDataContext = createContext<ClinicDataContextValue | undefined>(
  undefined
);

/* =========================================================
   PROVIDER
========================================================= */

export function ClinicDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [doctorsWithPhotos, setDoctorsWithPhotos] = useState<DoctorWithPhotos[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const doctorList = await getDoctors();

      setDoctors(doctorList);

      const withPhotos = await Promise.all(
        doctorList.map(async (doctor) => {
          try {
            const photos = await getDoctorPhotos(doctor.id);

            return { doctor, photos };
          } catch (err) {
            console.error(
              `Failed to load photos for doctor ${doctor.id}:`,
              err
            );

            return { doctor, photos: [] as DoctorPhoto[] };
          }
        })
      );

      setDoctorsWithPhotos(withPhotos);
    } catch (err) {
      console.error("Failed to load clinic data:", err);

      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ClinicDataContext.Provider
      value={{
        doctors,
        doctorsWithPhotos,
        loading,
        error,
        refetch: load,
      }}
    >
      {children}
    </ClinicDataContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useClinicData() {
  const ctx = useContext(ClinicDataContext);

  if (!ctx) {
    throw new Error(
      "useClinicData must be used inside <ClinicDataProvider>"
    );
  }

  return ctx;
}