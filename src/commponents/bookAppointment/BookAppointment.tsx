import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  Stethoscope,
} from "lucide-react";

import { getDoctors } from "../services/doctorService";
import type { Doctor } from "../services/doctorService";

import { getAvailableSlots } from "../services/scheduleService";
import type { AvailableSlot } from "../services/scheduleService";

import { createAppointment } from "../services/appointmentService";
import type {
  CreateAppointmentData,
  CreatedAppointment,
} from "../services/appointmentService";

import { useLanguage } from "../../i18n/LanguageContext";

import "./BookAppointment.css";

/* =========================================================
   SERVICES
========================================================= */

const services = [
  { id: "general" },
  { id: "cosmetic" },
  { id: "orthodontics" },
  { id: "restorative" },
];

/* =========================================================
   APPOINTMENT TYPE
========================================================= */

const getAppointmentType = (
  serviceId: string
): CreateAppointmentData["appointmentType"] => {
  switch (serviceId) {
    case "orthodontics":
      return "OrthodonticFollowUp";

    case "cosmetic":
    case "restorative":
      return "TreatmentSession";

    case "general":
    default:
      return "Checkup";
  }
};

/* =========================================================
   HELPERS
========================================================= */

const formatTime = (
  time: string,
  lang: "en" | "ar"
) => {
  const [hours, minutes] = time.split(":");

  const date = new Date();

  date.setHours(
    Number(hours),
    Number(minutes),
    0,
    0
  );

  return date.toLocaleTimeString(
    lang === "ar" ? "ar-EG" : "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
};

const formatDateForApi = (date: Date) => {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/* =========================================================
   COMPONENT
========================================================= */

function Booking() {
  const { lang, t } = useLanguage();

  const isArabic = lang === "ar";

  /* =========================================================
     DOCTORS
  ========================================================= */

  const [doctors, setDoctors] =
    useState<Doctor[]>([]);

  const [loadingDoctors, setLoadingDoctors] =
    useState(false);

  const [doctorsError, setDoctorsError] =
    useState("");

  /* =========================================================
     AVAILABLE SLOTS
  ========================================================= */

  const [availableSlots, setAvailableSlots] =
    useState<AvailableSlot[]>([]);

  const [loadingSlots, setLoadingSlots] =
    useState(false);

  /* =========================================================
     MONTH AVAILABILITY
  ========================================================= */

  const [dayAvailability, setDayAvailability] =
    useState<Record<string, boolean>>({});

  const [
    loadingMonthAvailability,
    setLoadingMonthAvailability,
  ] = useState(false);

  const monthAvailabilityCache = useRef<
    Record<string, Record<string, boolean>>
  >({});

  /* =========================================================
     CURRENT STEP
  ========================================================= */

  const [currentStep, setCurrentStep] =
    useState<number>(1);

  /* =========================================================
     SELECTED DATA
  ========================================================= */

  const [selectedService, setSelectedService] =
    useState<string>("");

  const [selectedDoctorId, setSelectedDoctorId] =
    useState<string>("");

  const [selectedDate, setSelectedDate] =
    useState<Date | null>(null);

  const [selectedTime, setSelectedTime] =
    useState<string>("");

  const [selectedSlot, setSelectedSlot] =
    useState<AvailableSlot | null>(null);

  /* =========================================================
     PATIENT INFORMATION
  ========================================================= */

  const [patientName, setPatientName] =
    useState("");

  const [patientPhone, setPatientPhone] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [
    submittingAppointment,
    setSubmittingAppointment,
  ] = useState(false);

  const [appointmentError, setAppointmentError] =
    useState("");

  const [createdAppointment, setCreatedAppointment] =
    useState<CreatedAppointment | null>(null);

  /* =========================================================
     CALENDAR MONTH
  ========================================================= */

  const [currentMonth, setCurrentMonth] =
    useState<Date>(new Date());

  /* =========================================================
     GET DOCTORS
  ========================================================= */

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoadingDoctors(true);
        setDoctorsError("");

        const data = await getDoctors();

        setDoctors(data);
      } catch (error) {
        console.error(
          "Failed to load doctors:",
          error
        );

        setDoctorsError(
          t("home.booking.doctor.error")
        );
      } finally {
        setLoadingDoctors(false);
      }
    };

    loadDoctors();
  }, [t]);

  /* =========================================================
     SELECTED SERVICE
  ========================================================= */

  const selectedServiceData =
    services.find(
      (service) =>
        service.id === selectedService
    );

  /* =========================================================
     SELECTED DOCTOR
  ========================================================= */

  const selectedDoctorData =
    doctors.find(
      (doctor) =>
        doctor.id === selectedDoctorId
    );

  /* =========================================================
     SERVICE TRANSLATIONS
  ========================================================= */

  const getServiceTitle = (
    serviceId: string
  ) => {
    switch (serviceId) {
      case "general":
        return t(
          "home.booking.service.general.title"
        );

      case "cosmetic":
        return t(
          "home.booking.service.cosmetic.title"
        );

      case "orthodontics":
        return t(
          "home.booking.service.orthodontics.title"
        );

      case "restorative":
        return t(
          "home.booking.service.restorative.title"
        );

      default:
        return "";
    }
  };

  const getServiceDescription = (
    serviceId: string
  ) => {
    switch (serviceId) {
      case "general":
        return t(
          "home.booking.service.general.description"
        );

      case "cosmetic":
        return t(
          "home.booking.service.cosmetic.description"
        );

      case "orthodontics":
        return t(
          "home.booking.service.orthodontics.description"
        );

      case "restorative":
        return t(
          "home.booking.service.restorative.description"
        );

      default:
        return "";
    }
  };

  /* =========================================================
     LOAD AVAILABLE SLOTS
  ========================================================= */

  const loadAvailableSlots = async (
    doctorId: string,
    date: Date
  ) => {
    try {
      setLoadingSlots(true);

      setAvailableSlots([]);
      setSelectedTime("");
      setSelectedSlot(null);

      const apiDate =
        formatDateForApi(date);

      const slots =
        await getAvailableSlots(
          doctorId,
          apiDate
        );

      setAvailableSlots(slots);

      setDayAvailability((prev) => ({
        ...prev,
        [apiDate]: slots.length > 0,
      }));
    } catch (error) {
      console.error(
        "Failed to load available slots:",
        error
      );

      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  /* =========================================================
     LOAD MONTH AVAILABILITY
  ========================================================= */

  useEffect(() => {
    if (!selectedDoctorId) {
      setDayAvailability({});
      return;
    }

    const year =
      currentMonth.getFullYear();

    const month =
      currentMonth.getMonth();

    const monthKey =
      `${selectedDoctorId}-${year}-${month}`;

    const cached =
      monthAvailabilityCache.current[
        monthKey
      ];

    if (cached) {
      setDayAvailability(cached);
      return;
    }

    let cancelled = false;

    const loadMonthAvailability =
      async () => {
        try {
          setLoadingMonthAvailability(true);

          setDayAvailability({});

          const daysInMonth =
            new Date(
              year,
              month + 1,
              0
            ).getDate();

          const today = new Date();

          today.setHours(
            0,
            0,
            0,
            0
          );

          const daysToCheck: Date[] = [];

          for (
            let day = 1;
            day <= daysInMonth;
            day++
          ) {
            const date = new Date(
              year,
              month,
              day
            );

            if (date >= today) {
              daysToCheck.push(date);
            }
          }

          const results =
            await Promise.all(
              daysToCheck.map(
                async (date) => {
                  const key =
                    formatDateForApi(date);

                  try {
                    const slots =
                      await getAvailableSlots(
                        selectedDoctorId,
                        key
                      );

                    return {
                      key,
                      available:
                        slots.length > 0,
                    };
                  } catch (error) {
                    console.error(
                      `Failed to check availability for ${key}:`,
                      error
                    );

                    return {
                      key,
                      available: false,
                    };
                  }
                }
              )
            );

          if (cancelled) return;

          const map: Record<
            string,
            boolean
          > = {};

          results.forEach(
            ({
              key,
              available,
            }) => {
              map[key] = available;
            }
          );

          monthAvailabilityCache.current[
            monthKey
          ] = map;

          setDayAvailability(map);
        } finally {
          if (!cancelled) {
            setLoadingMonthAvailability(
              false
            );
          }
        }
      };

    loadMonthAvailability();

    return () => {
      cancelled = true;
    };
  }, [
    selectedDoctorId,
    currentMonth,
  ]);

  /* =========================================================
     CALENDAR HELPERS
  ========================================================= */

  const year =
    currentMonth.getFullYear();

  const month =
    currentMonth.getMonth();

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const firstDayOfMonth =
    new Date(
      year,
      month,
      1
    ).getDay();

  const monthName =
    currentMonth.toLocaleDateString(
      isArabic
        ? "ar-EG"
        : "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );

  const isSameDate = (
    date1: Date | null,
    date2: Date
  ) => {
    if (!date1) return false;

    return (
      date1.getFullYear() ===
        date2.getFullYear() &&
      date1.getMonth() ===
        date2.getMonth() &&
      date1.getDate() ===
        date2.getDate()
    );
  };

  /* =========================================================
     DATE AVAILABILITY
  ========================================================= */

  const isDateInPast = (
    date: Date
  ) => {
    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    return date < today;
  };

  /* =========================================================
     CHANGE MONTH
  ========================================================= */

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(
        year,
        month - 1,
        1
      )
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(
        year,
        month + 1,
        1
      )
    );
  };

  /* =========================================================
     SELECT DATE
  ========================================================= */

  const handleDateSelect = async (
    date: Date
  ) => {
    setSelectedDate(date);

    setSelectedTime("");

    setSelectedSlot(null);

    if (!selectedDoctorId) {
      return;
    }

    await loadAvailableSlots(
      selectedDoctorId,
      date
    );
  };

  /* =========================================================
     SELECT DOCTOR
  ========================================================= */

  const handleDoctorSelect = (
    doctorId: string
  ) => {
    setSelectedDoctorId(
      doctorId
    );

    setSelectedDate(null);

    setSelectedTime("");

    setSelectedSlot(null);

    setAvailableSlots([]);

    setDayAvailability({});
  };

  /* =========================================================
     SUBMIT APPOINTMENT
  ========================================================= */

  const handleSubmitAppointment =
    async () => {
      if (!selectedDoctorId) {
        setAppointmentError(
          t(
            "home.booking.errors.selectDoctor"
          )
        );
        return;
      }

      if (!selectedDate) {
        setAppointmentError(
          t(
            "home.booking.errors.selectDate"
          )
        );
        return;
      }

      if (!selectedSlot) {
        setAppointmentError(
          t(
            "home.booking.errors.selectTime"
          )
        );
        return;
      }

      if (!patientName.trim()) {
        setAppointmentError(
          t(
            "home.booking.errors.enterName"
          )
        );
        return;
      }

      if (!patientPhone.trim()) {
        setAppointmentError(
          t(
            "home.booking.errors.enterPhone"
          )
        );
        return;
      }

      try {
        setSubmittingAppointment(true);

        setAppointmentError("");

        const date =
          formatDateForApi(
            selectedDate
          );

        const scheduledAt =
          `${date}T${selectedSlot.startTime}`;

        const appointmentData:
          CreateAppointmentData = {
          doctorId:
            selectedDoctorId,

          patientName:
            patientName.trim(),

          patientPhoneNumber:
            patientPhone.trim(),

          appointmentType:
            getAppointmentType(
              selectedService
            ),

          scheduledAt,

          notes: notes.trim(),
        };

        const result =
          await createAppointment(
            appointmentData
          );

        setCreatedAppointment(
          result
        );

        setCurrentStep(5);
      } catch (error: any) {
        console.error(
          "Failed to create appointment:",
          error
        );

        if (
          error?.response?.status ===
          409
        ) {
          setAppointmentError(
            t(
              "home.booking.errors.slotUnavailable"
            )
          );

          if (
            selectedDate &&
            selectedDoctorId
          ) {
            await loadAvailableSlots(
              selectedDoctorId,
              selectedDate
            );
          }

          setCurrentStep(3);
        } else {
          setAppointmentError(
            t(
              "home.booking.errors.appointmentFailed"
            )
          );
        }
      } finally {
        setSubmittingAppointment(
          false
        );
      }
    };

  /* =========================================================
     CONTINUE
  ========================================================= */

  const handleContinue = () => {
    if (currentStep === 1) {
      if (!selectedService) {
        alert(
          t(
            "home.booking.errors.selectService"
          )
        );
        return;
      }

      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!selectedDoctorId) {
        alert(
          t(
            "home.booking.errors.selectDoctor"
          )
        );
        return;
      }

      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (!selectedDate) {
        alert(
          t(
            "home.booking.errors.selectDate"
          )
        );
        return;
      }

      if (!selectedSlot) {
        alert(
          t(
            "home.booking.errors.selectTime"
          )
        );
        return;
      }

      setAppointmentError("");

      setCurrentStep(4);

      return;
    }
  };

  /* =========================================================
     BACK
  ========================================================= */

  const handleBack = () => {
    if (currentStep === 1) {
      window.history.back();
      return;
    }

    setCurrentStep(
      (prev) => prev - 1
    );
  };

  /* =========================================================
     WEEK DAYS
  ========================================================= */

  const weekdays = isArabic
    ? [
        "أح",
        "إث",
        "ث",
        "أر",
        "خ",
        "ج",
        "س",
      ]
    : [
        "Su",
        "Mo",
        "Tu",
        "We",
        "Th",
        "Fr",
        "Sa",
      ];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className="booking-page min-h-screen flex flex-col"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <main className="flex-grow pb-24">

        {/* =====================================================
            BACK BUTTON
        ===================================================== */}

        <div className="booking-back-wrapper">
          <button
            type="button"
            className="booking-back-button"
            onClick={handleBack}
            aria-label={t(
              "home.booking.back"
            )}
          >
            {isArabic ? (
              <ArrowRight size={22} />
            ) : (
              <ArrowLeft size={22} />
            )}
          </button>
        </div>

        {/* =====================================================
            STEP INDICATOR
        ===================================================== */}

        <section className="px-5 py-8 bg-white">

          <div className="flex items-center justify-between relative">

            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#e4e2e1] z-0 rounded-full" />

            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#1d324e] z-0 rounded-full transition-all duration-300"
              style={{
                width:
                  currentStep === 1
                    ? "0%"
                    : currentStep === 2
                    ? "33%"
                    : currentStep === 3
                    ? "66%"
                    : "100%",
              }}
            />

            {/* STEP 1 */}

            <div className="relative z-10 flex flex-col items-center gap-2">

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1
                    ? "bg-[#1d324e] text-white"
                    : "bg-[#e4e2e1]"
                }`}
              >
                {currentStep > 1 ? (
                  <Check size={16} />
                ) : (
                  "1"
                )}
              </div>

              <span className="text-[12px]">
                {t(
                  "home.booking.steps.service"
                )}
              </span>
            </div>

            {/* STEP 2 */}

            <div className="relative z-10 flex flex-col items-center gap-2">

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2
                    ? "bg-[#1d324e] text-white"
                    : "bg-[#e4e2e1]"
                }`}
              >
                {currentStep > 2 ? (
                  <Check size={16} />
                ) : (
                  "2"
                )}
              </div>

              <span className="text-[12px]">
                {t(
                  "home.booking.steps.doctor"
                )}
              </span>
            </div>

            {/* STEP 3 */}

            <div className="relative z-10 flex flex-col items-center gap-2">

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 3
                    ? "bg-[#1d324e] text-white"
                    : "bg-[#e4e2e1]"
                }`}
              >
                {currentStep > 3 ? (
                  <Check size={16} />
                ) : (
                  "3"
                )}
              </div>

              <span className="text-[12px]">
                {t(
                  "home.booking.steps.dateTime"
                )}
              </span>
            </div>

            {/* STEP 4 */}

            <div className="relative z-10 flex flex-col items-center gap-2">

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 4
                    ? "bg-[#fed488] text-[#785a1a]"
                    : "bg-[#e4e2e1]"
                }`}
              >
                {currentStep === 4 ? (
                  <Check size={16} />
                ) : (
                  "4"
                )}
              </div>

              <span className="text-[12px]">
                {t(
                  "home.booking.steps.confirm"
                )}
              </span>
            </div>

            {/* STEP 5 */}

            <div className="relative z-10 flex flex-col items-center gap-2">

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 5
                    ? "bg-[#fed488] text-[#785a1a]"
                    : "bg-[#e4e2e1]"
                }`}
              >
                {currentStep === 5 ? (
                  <Check size={16} />
                ) : (
                  "5"
                )}
              </div>

              <span className="text-[12px]">
                {t(
                  "home.booking.steps.done"
                )}
              </span>
            </div>

          </div>

        </section>

        {/* =====================================================
            STEP 1 - SERVICE
        ===================================================== */}

        {currentStep === 1 && (
          <section className="px-5 py-4">

            <div className="mb-6">

              <h2 className="text-[24px] font-semibold text-[#1d324e]">
                {t(
                  "home.booking.service.title"
                )}
              </h2>

              <p className="text-[14px] text-[#74777e] mt-2">
                {t(
                  "home.booking.service.description"
                )}
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {services.map(
                (service, index) => {

                  const isSelected =
                    selectedService ===
                    service.id;

                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => {

                        setSelectedService(
                          service.id
                        );

                        setSelectedDoctorId(
                          ""
                        );

                        setSelectedDate(
                          null
                        );

                        setSelectedTime(
                          ""
                        );

                        setSelectedSlot(
                          null
                        );

                        setAvailableSlots(
                          []
                        );

                        setDayAvailability(
                          {}
                        );

                      }}
                      className={`
                        relative
                        text-left
                        rounded-2xl
                        p-6
                        min-h-[220px]
                        transition-all
                        duration-300
                        overflow-hidden
                        border
                        ${
                          isSelected
                            ? "border-[#1d324e] bg-[#eef3f7] shadow-md scale-[1.01]"
                            : "border-transparent bg-white shadow-sm hover:shadow-md hover:-translate-y-1"
                        }
                      `}
                    >

                      <div
                        className={`
                          absolute
                          -right-10
                          -top-10
                          w-32
                          h-32
                          rounded-full
                          opacity-10
                          ${
                            index === 0
                              ? "bg-[#fed488]"
                              : index === 1
                              ? "bg-[#344966]"
                              : index === 2
                              ? "bg-[#78909c]"
                              : "bg-[#1d324e]"
                          }
                        `}
                      />

                      {isSelected && (
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1d324e] flex items-center justify-center">
                          <Check
                            size={17}
                            color="white"
                            strokeWidth={3}
                          />
                        </div>
                      )}

                      <div
                        className={`
                          w-14
                          h-14
                          rounded-xl
                          flex
                          items-center
                          justify-center
                          mb-6
                          ${
                            index === 0
                              ? "bg-[#fed488] text-[#785a1a]"
                              : index === 1
                              ? "bg-[#344966] text-white"
                              : index === 2
                              ? "bg-[#dce7ed] text-[#1d324e]"
                              : "bg-[#1d324e] text-white"
                          }
                        `}
                      >
                        <Stethoscope
                          size={28}
                          strokeWidth={1.8}
                        />
                      </div>

                      <div className="relative z-10">

                        <h3 className="text-[19px] font-semibold text-[#1d324e]">
                          {getServiceTitle(
                            service.id
                          )}
                        </h3>

                        <p className="text-[13px] text-[#74777e] mt-2 leading-6">
                          {getServiceDescription(
                            service.id
                          )}
                        </p>

                      </div>

                      <div
                        className={`
                          absolute
                          bottom-5
                          ${
                            isArabic
                              ? "left-6"
                              : "right-6"
                          }
                          text-[12px]
                          font-semibold
                          uppercase
                          tracking-wider
                          ${
                            isSelected
                              ? "text-[#1d324e]"
                              : "text-[#74777e]"
                          }
                        `}
                      >
                        {isSelected
                          ? t(
                              "home.booking.service.selected"
                            )
                          : t(
                              "home.booking.service.select"
                            )}
                      </div>

                    </button>
                  );
                }
              )}

            </div>

          </section>
        )}

        {/* =====================================================
            STEP 2 - DOCTOR
        ===================================================== */}

        {currentStep === 2 && (
          <section className="px-5 py-4">

            <div className="mb-6">

              <h2 className="text-[24px] font-semibold text-[#1d324e]">
                {t(
                  "home.booking.doctor.title"
                )}
              </h2>

              <p className="text-[14px] text-[#74777e] mt-2">
                {t(
                  "home.booking.doctor.description"
                )}
              </p>

            </div>

            {/* SELECTED SERVICE */}

            <div className="mb-5 bg-[#fed488]/20 rounded-lg p-3 border border-[#fed488]/50">

              <p className="text-[12px] text-[#775a19] font-semibold uppercase tracking-wider">
                {t(
                  "home.booking.doctor.selectedService"
                )}
              </p>

              <p className="text-[15px] text-[#1d324e] font-semibold mt-1">
                {selectedServiceData
                  ? getServiceTitle(
                      selectedServiceData.id
                    )
                  : ""}
              </p>

            </div>

            {/* LOADING */}

            {loadingDoctors && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#c4c6ce]/30 text-center">

                <p className="text-[14px] text-[#74777e]">
                  {t(
                    "home.booking.doctor.loading"
                  )}
                </p>

              </div>
            )}

            {/* ERROR */}

            {!loadingDoctors &&
              doctorsError && (
                <div className="bg-[#fed488]/20 border border-[#fed488]/50 rounded-lg p-4 text-[13px] text-[#775a19]">
                  {doctorsError}
                </div>
              )}

            {/* EMPTY */}

            {!loadingDoctors &&
              !doctorsError &&
              doctors.length === 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#c4c6ce]/30 text-center">

                  <p className="text-[14px] text-[#74777e]">
                    {t(
                      "home.booking.doctor.empty"
                    )}
                  </p>

                </div>
              )}

            {/* DOCTORS */}

            <div className="space-y-4">

              {doctors.map(
                (doctor) => {

                  const isSelected =
                    selectedDoctorId ===
                    doctor.id;

                  return (
                    <button
                      key={doctor.id}
                      type="button"
                      onClick={() =>
                        handleDoctorSelect(
                          doctor.id
                        )
                      }
                      className={`w-full ${
                        isArabic
                          ? "text-right"
                          : "text-left"
                      } bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 border transition-all ${
                        isSelected
                          ? "border-2 border-[#1d324e] bg-[#eef3f7]"
                          : "border-[#c4c6ce]/30 hover:border-[#1d324e]"
                      }`}
                    >

                      <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 bg-[#e4e2e1] flex items-center justify-center">

                        <Stethoscope
                          size={30}
                          className="text-[#1d324e]"
                        />

                      </div>

                      <div className="flex-grow">

                        <h2 className="text-[18px] font-semibold text-[#1d324e]">
                          {doctor.name}
                        </h2>

                        <p className="flex items-center gap-2 text-[13px] text-[#74777e] mt-2">

                          <Stethoscope size={18} />

                          {doctor.specialty}

                        </p>

                        {doctor.bio && (
                          <p className="text-[12px] text-[#74777e] mt-2 line-clamp-2">
                            {doctor.bio}
                          </p>
                        )}

                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "border-[#1d324e] bg-[#1d324e]"
                            : "border-[#c4c6ce]"
                        }`}
                      >

                        {isSelected && (
                          <Check
                            size={13}
                            color="white"
                          />
                        )}

                      </div>

                    </button>
                  );
                }
              )}

            </div>

            {/* AVAILABILITY INFO */}

            {selectedDoctorData && (
              <div className="mt-4 bg-[#fed488]/20 rounded-lg p-3 flex items-start gap-3 border border-[#fed488]/50">

                <Info
                  size={18}
                  className="text-[#775a19]"
                />

                <p className="text-[12px] text-[#1b1c1c]">

                  <strong>
                    {t(
                      "home.booking.doctor.doctorLabel"
                    )}
                  </strong>{" "}

                  {selectedDoctorData.name}

                  {" — "}

                  {selectedDoctorData.specialty}

                </p>

              </div>
            )}

          </section>
        )}

        {/* =====================================================
            STEP 3 - DATE & TIME
        ===================================================== */}

        {currentStep === 3 && (
          <>

            {/* DOCTOR */}

            <section className="px-5 py-4">

              <div className="bg-white rounded-xl p-4 shadow-sm border border-[#c4c6ce]/30 flex items-center gap-4">

                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-[#e4e2e1] flex items-center justify-center">

                  <Stethoscope
                    size={27}
                    className="text-[#1d324e]"
                  />

                </div>

                <div>

                  <h2 className="text-[18px] font-semibold text-[#1d324e]">
                    {selectedDoctorData?.name}
                  </h2>

                  <p className="flex items-center gap-2 text-[13px] text-[#74777e] mt-1">

                    <Stethoscope size={18} />

                    {selectedDoctorData?.specialty}

                  </p>

                </div>

              </div>

            </section>

            {/* CALENDAR */}

            <section className="px-5 py-4">

              <div className="bg-white rounded-xl p-4 shadow-sm border border-[#c4c6ce]/30">

                <div className="flex justify-between items-center mb-4">

                  <h3 className="text-[24px] font-semibold text-[#1d324e]">
                    {monthName}
                  </h3>

                  <div className="flex items-center gap-2">

                    {loadingMonthAvailability && (
                      <span className="booking-calendar-loading-hint">
                        {t(
                          "home.booking.dateTime.checkingAvailability"
                        )}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={
                        handlePreviousMonth
                      }
                      className="p-2 rounded-full text-[#44474d] hover:bg-[#f0eded]"
                      aria-label="Previous month"
                    >
                      {isArabic ? (
                        <ChevronRight size={20} />
                      ) : (
                        <ChevronLeft size={20} />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={
                        handleNextMonth
                      }
                      className="p-2 rounded-full text-[#1d324e] hover:bg-[#f0eded]"
                      aria-label="Next month"
                    >
                      {isArabic ? (
                        <ChevronLeft size={20} />
                      ) : (
                        <ChevronRight size={20} />
                      )}
                    </button>

                  </div>

                </div>

                {/* LEGEND */}

                <div className="booking-calendar-legend">

                  <span className="booking-calendar-legend-item">

                    <span className="booking-calendar-dot booking-calendar-dot-available" />

                    {t(
                      "home.booking.dateTime.available"
                    )}

                  </span>

                  <span className="booking-calendar-legend-item">

                    <span className="booking-calendar-dot booking-calendar-dot-unavailable" />

                    {t(
                      "home.booking.dateTime.fullyBooked"
                    )}

                  </span>

                </div>

                {/* WEEK DAYS */}

                <div className="grid grid-cols-7 gap-1 mb-2 text-center">

                  {weekdays.map(
                    (day) => (
                      <div
                        key={day}
                        className="text-[14px] py-2 text-[#74777e]"
                      >
                        {day}
                      </div>
                    )
                  )}

                </div>

                {/* CALENDAR */}

                <div className="grid grid-cols-7 gap-1 text-center">

                  {Array.from({
                    length:
                      firstDayOfMonth,
                  }).map(
                    (_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="py-2"
                      />
                    )
                  )}

                  {Array.from(
                    {
                      length:
                        daysInMonth,
                    },
                    (_, index) => {

                      const day =
                        index + 1;

                      const date =
                        new Date(
                          year,
                          month,
                          day
                        );

                      const dateKey =
                        formatDateForApi(
                          date
                        );

                      const isPast =
                        isDateInPast(
                          date
                        );

                      const hasOpenSlots =
                        dayAvailability[
                          dateKey
                        ];

                      const isUnavailable =
                        isPast ||
                        hasOpenSlots ===
                          false;

                      const isPending =
                        !isPast &&
                        loadingMonthAvailability &&
                        hasOpenSlots ===
                          undefined;

                      const isSelected =
                        isSameDate(
                          selectedDate,
                          date
                        );

                      if (
                        isUnavailable
                      ) {
                        return (
                          <div
                            key={day}
                            className="booking-day booking-day-unavailable"
                            aria-disabled="true"
                            title={t(
                              "home.booking.dateTime.fullyBooked"
                            )}
                          >
                            {day}
                          </div>
                        );
                      }

                      return (
                        <div key={day}>

                          <button
                            type="button"
                            disabled={
                              isPending
                            }
                            onClick={() =>
                              handleDateSelect(
                                date
                              )
                            }
                            className={`booking-day relative w-full py-2 rounded-full transition-colors ${
                              isSelected
                                ? "bg-[#fed488] text-[#785a1a] font-semibold shadow-sm"
                                : "text-[#1d324e] hover:bg-[#f0eded]"
                            } ${
                              isPending
                                ? "booking-day-pending"
                                : ""
                            }`}
                          >

                            {day}

                            {!isSelected &&
                              !isPending && (
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#e9c176] rounded-full" />
                              )}

                          </button>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>

            </section>

            {/* TIME */}

            <section className="px-5 py-4">

              <h3 className="text-[14px] text-[#44474d] mb-4 uppercase tracking-wider font-semibold">

                {selectedDate
                  ? `${t(
                      "home.booking.dateTime.availableTimesFor"
                    )} ${selectedDate.toLocaleDateString(
                      isArabic
                        ? "ar-EG"
                        : "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}`
                  : t(
                      "home.booking.dateTime.selectDateFirst"
                    )}

              </h3>

              {!selectedDate ? (

                <div className="bg-[#fed488]/20 border border-[#fed488]/50 rounded-lg p-4 text-[13px] text-[#775a19]">

                  {t(
                    "home.booking.dateTime.selectAvailableDate"
                  )}

                </div>

              ) : loadingSlots ? (

                <div className="bg-white border border-[#c4c6ce]/30 rounded-lg p-6 text-center">

                  <p className="text-[13px] text-[#74777e]">
                    {t(
                      "home.booking.dateTime.loadingTimes"
                    )}
                  </p>

                </div>

              ) : availableSlots.length ===
                0 ? (

                <div className="bg-[#fed488]/20 border border-[#fed488]/50 rounded-lg p-4 text-[13px] text-[#775a19]">

                  {t(
                    "home.booking.dateTime.noAvailableTimes"
                  )}

                </div>

              ) : (

                <div className="grid grid-cols-3 gap-3">

                  {availableSlots.map(
                    (slot) => {

                      const isSelected =
                        selectedTime ===
                        slot.startTime;

                      return (
                        <button
                          key={`${slot.startTime}-${slot.endTime}`}
                          type="button"
                          onClick={() => {

                            setSelectedTime(
                              slot.startTime
                            );

                            setSelectedSlot(
                              slot
                            );

                          }}
                          className={`
                            py-3
                            px-2
                            rounded-lg
                            text-center
                            transition-all
                            ${
                              isSelected
                                ? "border-2 border-[#1d324e] bg-[#eef3f7] shadow-sm"
                                : "border border-[#c4c6ce] bg-white hover:border-[#1d324e]"
                            }
                          `}
                        >

                          <span
                            className={`
                              text-[16px]
                              ${
                                isSelected
                                  ? "text-[#1d324e] font-semibold"
                                  : "text-[#1b1c1c]"
                              }
                            `}
                          >
                            {formatTime(
                              slot.startTime,
                              lang
                            )}
                          </span>

                          <span className="block text-[11px] text-[#74777e] mt-1">
                            {formatTime(
                              slot.endTime,
                              lang
                            )}
                          </span>

                        </button>
                      );
                    }
                  )}

                </div>
              )}

            </section>

          </>
        )}

        {/* =====================================================
            STEP 4 - PATIENT INFORMATION
        ===================================================== */}

        {currentStep === 4 && (
          <section className="px-5 py-6">

            <div className="mb-6">

              <h2 className="text-[24px] font-semibold text-[#1d324e]">
                {t(
                  "home.booking.patient.title"
                )}
              </h2>

              <p className="text-[14px] text-[#74777e] mt-2">
                {t(
                  "home.booking.patient.description"
                )}
              </p>

            </div>

            {/* NAME */}

            <div className="mb-5">

              <label
                htmlFor="patientName"
                className="block text-[13px] font-semibold text-[#1d324e] mb-2"
              >
                {t(
                  "home.booking.patient.fullName"
                )}
              </label>

              <input
                id="patientName"
                type="text"
                value={patientName}
                onChange={(e) =>
                  setPatientName(
                    e.target.value
                  )
                }
                placeholder={t(
                  "home.booking.patient.fullNamePlaceholder"
                )}
                className="w-full rounded-xl border border-[#c4c6ce] bg-white px-4 py-3 outline-none focus:border-[#1d324e]"
              />

            </div>

            {/* PHONE */}

            <div className="mb-5">

              <label
                htmlFor="patientPhone"
                className="block text-[13px] font-semibold text-[#1d324e] mb-2"
              >
                {t(
                  "home.booking.patient.phoneNumber"
                )}
              </label>

              <input
                id="patientPhone"
                type="tel"
                value={patientPhone}
                onChange={(e) =>
                  setPatientPhone(
                    e.target.value
                  )
                }
                placeholder={t(
                  "home.booking.patient.phonePlaceholder"
                )}
                className="w-full rounded-xl border border-[#c4c6ce] bg-white px-4 py-3 outline-none focus:border-[#1d324e]"
              />

            </div>

            {/* NOTES */}

            <div className="mb-5">

              <label
                htmlFor="notes"
                className="block text-[13px] font-semibold text-[#1d324e] mb-2"
              >

                {t(
                  "home.booking.patient.notes"
                )}

                <span className="font-normal text-[#74777e]">
                  {" "}
                  (
                  {t(
                    "home.booking.patient.optional"
                  )}
                  )
                </span>

              </label>

              <textarea
                id="notes"
                value={notes}
                onChange={(e) =>
                  setNotes(
                    e.target.value
                  )
                }
                placeholder={t(
                  "home.booking.patient.notesPlaceholder"
                )}
                rows={4}
                className="w-full rounded-xl border border-[#c4c6ce] bg-white px-4 py-3 outline-none resize-none focus:border-[#1d324e]"
              />

            </div>

            {/* SUMMARY */}

            <div className="bg-[#eef3f7] rounded-xl p-5 mb-5">

              <h3 className="text-[15px] font-semibold text-[#1d324e] mb-4">
                {t(
                  "home.booking.patient.summary"
                )}
              </h3>

              <div className="space-y-3 text-[13px]">

                <div className="flex justify-between gap-4">

                  <span className="text-[#74777e]">
                    {t(
                      "home.booking.patient.service"
                    )}
                  </span>

                  <span className="font-semibold text-[#1d324e] text-right">
                    {selectedServiceData
                      ? getServiceTitle(
                          selectedServiceData.id
                        )
                      : ""}
                  </span>

                </div>

                <div className="flex justify-between gap-4">

                  <span className="text-[#74777e]">
                    {t(
                      "home.booking.patient.doctor"
                    )}
                  </span>

                  <span className="font-semibold text-[#1d324e] text-right">
                    {
                      selectedDoctorData?.name
                    }
                  </span>

                </div>

                <div className="flex justify-between gap-4">

                  <span className="text-[#74777e]">
                    {t(
                      "home.booking.patient.date"
                    )}
                  </span>

                  <span className="font-semibold text-[#1d324e] text-right">

                    {selectedDate?.toLocaleDateString(
                      isArabic
                        ? "ar-EG"
                        : "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}

                  </span>

                </div>

                <div className="flex justify-between gap-4">

                  <span className="text-[#74777e]">
                    {t(
                      "home.booking.patient.time"
                    )}
                  </span>

                  <span className="font-semibold text-[#1d324e] text-right">

                    {selectedSlot
                      ? `${formatTime(
                          selectedSlot.startTime,
                          lang
                        )} - ${formatTime(
                          selectedSlot.endTime,
                          lang
                        )}`
                      : "-"}

                  </span>

                </div>

              </div>

            </div>

            {/* ERROR */}

            {appointmentError && (
              <div className="mb-5 bg-[#fed488]/20 border border-[#fed488]/50 rounded-lg p-4 text-[13px] text-[#775a19]">
                {appointmentError}
              </div>
            )}

          </section>
        )}

        {/* =====================================================
            STEP 5 - SUCCESS
        ===================================================== */}

        {currentStep === 5 && (
          <section className="px-5 py-6">

            <div className="text-center mb-8">

              <div className="mx-auto w-20 h-20 rounded-full bg-[#fed488]/30 flex items-center justify-center mb-5">

                <div className="w-12 h-12 rounded-full bg-[#fed488] flex items-center justify-center">

                  <Check
                    size={26}
                    className="text-[#785a1a]"
                    strokeWidth={2.5}
                  />

                </div>

              </div>

              <h2 className="text-[24px] font-semibold text-[#1d324e]">
                {t(
                  "home.booking.confirmation.appointmentRequestSent"
                )}
              </h2>

              <p className="text-[14px] text-[#74777e] mt-3 leading-6 max-w-[420px] mx-auto">
                {t(
                  "home.booking.confirmation.successMessage"
                )}
              </p>

            </div>

            {/* APPOINTMENT CARD */}

            <div className="bg-white rounded-2xl shadow-sm border border-[#c4c6ce]/30 overflow-hidden">

              {/* PATIENT */}

              <div className="p-5 border-b border-[#e4e2e1]">

                <p className="text-[11px] uppercase tracking-wider font-semibold text-[#74777e]">
                  {t(
                    "home.booking.confirmation.patient"
                  )}
                </p>

                <p className="text-[16px] font-semibold text-[#1d324e] mt-2">
                  {createdAppointment?.patientName ||
                    patientName}
                </p>

              </div>

              {/* DOCTOR */}

              <div className="p-5 border-b border-[#e4e2e1]">

                <p className="text-[11px] uppercase tracking-wider font-semibold text-[#74777e]">
                  {t(
                    "home.booking.confirmation.doctor"
                  )}
                </p>

                <p className="text-[16px] font-semibold text-[#1d324e] mt-2">
                  {createdAppointment?.doctorName ||
                    selectedDoctorData?.name}
                </p>

              </div>

              {/* DATE & TIME */}

              <div className="p-5 border-b border-[#e4e2e1]">

                <p className="text-[11px] uppercase tracking-wider font-semibold text-[#74777e]">
                  {t(
                    "home.booking.confirmation.dateTime"
                  )}
                </p>

                <p className="text-[16px] font-semibold text-[#1d324e] mt-2">

                  {selectedDate?.toLocaleDateString(
                    isArabic
                      ? "ar-EG"
                      : "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}

                </p>

                <p className="text-[14px] text-[#74777e] mt-1">

                  {selectedSlot
                    ? `${formatTime(
                        selectedSlot.startTime,
                        lang
                      )} - ${formatTime(
                        selectedSlot.endTime,
                        lang
                      )}`
                    : "-"}

                </p>

              </div>

              {/* STATUS */}

              <div className="p-5">

                <p className="text-[11px] uppercase tracking-wider font-semibold text-[#74777e] mb-3">
                  {t(
                    "home.booking.confirmation.appointmentStatus"
                  )}
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fed488]/25">

                  <span className="w-2 h-2 rounded-full bg-[#e5b84b]" />

                  <span className="text-[13px] font-semibold text-[#785a1a]">
                    {t(
                      "home.booking.confirmation.pendingConfirmation"
                    )}
                  </span>

                </div>

              </div>

            </div>

            {/* INFO */}

            <div className="mt-5 bg-[#eef3f7] border border-[#d5dfe7] rounded-xl p-4 flex items-start gap-3">

              <Info
                size={19}
                className="text-[#1d324e] shrink-0 mt-0.5"
              />

              <p className="text-[13px] text-[#44474d] leading-6">
                {t(
                  "home.booking.confirmation.information"
                )}
              </p>

            </div>

          </section>
        )}

      </main>

      {/* =====================================================
          BOTTOM BUTTON
      ===================================================== */}

      <footer className="booking-footer">

        <button
          type="button"
          className="booking-continue-button"
          disabled={
            submittingAppointment
          }
          onClick={
            currentStep === 4
              ? handleSubmitAppointment
              : currentStep === 5
              ? () =>
                  (window.location.href =
                    "/")
              : handleContinue
          }
        >

          <span>

            {currentStep === 1
              ? t(
                  "home.booking.buttons.continueToDoctor"
                )
              : currentStep === 2
              ? t(
                  "home.booking.buttons.continueToDateTime"
                )
              : currentStep === 3
              ? t(
                  "home.booking.buttons.continueToPatient"
                )
              : currentStep === 4
              ? submittingAppointment
                ? t(
                    "home.booking.buttons.sending"
                  )
                : t(
                    "home.booking.buttons.sendRequest"
                  )
              : t(
                  "home.booking.buttons.backToHome"
                )}

          </span>

          {currentStep === 5 ? (
            isArabic ? (
              <ArrowLeft size={18} />
            ) : (
              <ArrowRight size={18} />
            )
          ) : isArabic ? (
            <ArrowLeft size={18} />
          ) : (
            <ArrowRight size={18} />
          )}

        </button>

      </footer>

    </div>
  );
}

export default Booking;