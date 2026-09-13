import { useState } from "react";
import {
  Calendar,
  Clock,
  Phone,
  Search,
  Stethoscope,
  X,
  XCircle,
} from "lucide-react";

import {
  getAppointmentsByPhone,
  cancelAppointment,
} from "../services/appointmentService";

import type { Appointment } from "../services/appointmentService";
import {
  isCancellableStatus,
  getStatusTranslationKey,
  getAppointmentTypeTranslationKey,
} from "../../constant/appointment";
import { useLanguage } from "../../i18n/LanguageContext";

import "./MyAppointment.css";

/* =========================================================
   HELPERS
========================================================= */

const formatDateTime = (
  scheduledAt: string,
  lang: "en" | "ar"
) => {
  const date = new Date(scheduledAt);

  const locale = lang === "ar" ? "ar-EG" : "en-US";

  const dateLabel = date.toLocaleDateString(locale, {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const timeLabel = date.toLocaleTimeString(locale, {
    hour: "numeric",
    minute: "2-digit",
  });

  return {
    dateLabel,
    timeLabel,
  };
};



/* =========================================================
   COMPONENT
========================================================= */

function MyAppointments() {
  const { lang, t } = useLanguage();

  const isArabic = lang === "ar";

  /* =========================================================
     STATE
  ========================================================= */

  const [phoneNumber, setPhoneNumber] = useState("");

  const [hasSearched, setHasSearched] =
    useState(false);

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [searchError, setSearchError] =
    useState("");

  const [cancellingId, setCancellingId] =
    useState<string | null>(null);

  const [confirmingId, setConfirmingId] =
    useState<string | null>(null);

  const [cancelError, setCancelError] =
    useState("");

  /* =========================================================
     STATUS LABEL
  ========================================================= */

 const getStatusLabel = (status: string) => {
  return t(`myAppointments.status.${getStatusTranslationKey(status)}`);
};

const getAppointmentTypeLabel = (type: string) => {
  const key = getAppointmentTypeTranslationKey(type);
  if (!key) return type;
  return t(`myAppointments.appointmentTypes.${key}`);
};

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = async () => {
    const trimmedPhone =
      phoneNumber.trim();

    if (!trimmedPhone) {
      setSearchError(
        t(
          "myAppointments.errors.enterPhone"
        )
      );
      return;
    }

    try {
      setLoading(true);

      setSearchError("");
      setCancelError("");

      const data =
        await getAppointmentsByPhone(
          trimmedPhone
        );

      const sorted =
        [...data].sort(
          (a, b) =>
            new Date(
              b.scheduledAt
            ).getTime() -
            new Date(
              a.scheduledAt
            ).getTime()
        );

      setAppointments(sorted);

      setHasSearched(true);
    } catch (error) {
      console.error(
        "Failed to load appointments:",
        error
      );

      setSearchError(
        t(
          "myAppointments.errors.searchFailed"
        )
      );

      setAppointments([]);

      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     ENTER KEY
  ========================================================= */

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  /* =========================================================
     NEW SEARCH
  ========================================================= */

  const handleNewSearch = () => {
    setHasSearched(false);

    setAppointments([]);

    setSearchError("");

    setCancelError("");

    setPhoneNumber("");

    setConfirmingId(null);
  };

  /* =========================================================
     CANCEL
  ========================================================= */

  const handleConfirmCancel =
    async (
      appointmentId: string
    ) => {
      try {
        setCancellingId(
          appointmentId
        );

        setCancelError("");

        await cancelAppointment(
          appointmentId
        );

        setAppointments(
          (prev) =>
            prev.map(
              (appt) =>
                appt.id ===
                appointmentId
                  ? {
                      ...appt,
                      status:
                        "Cancelled",
                    }
                  : appt
            )
        );

        setConfirmingId(null);
      } catch (error: any) {
        console.error(
          "Failed to cancel appointment:",
          error
        );

        const backendMessage =
          error?.response?.data
            ?.message;

        setCancelError(
          backendMessage ||
            t(
              "myAppointments.errors.cancelFailed"
            )
        );

        setConfirmingId(null);
      } finally {
        setCancellingId(null);
      }
    };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className="myappt-page min-h-screen flex flex-col"
      dir={
        isArabic
          ? "rtl"
          : "ltr"
      }
    >
      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="flex-grow pb-16">

        {/* ===================================================
            SEARCH STATE
        =================================================== */}

        {!hasSearched && (
          <section className="px-5 pt-10 pb-16">

            <div className="myappt-search-card max-w-[600px] mx-auto">

              {/* Icon */}

              <div className="mx-auto w-16 h-16 rounded-full bg-[#eef3f7] flex items-center justify-center mb-6">
                <Phone
                  size={26}
                  className="text-[#1d324e]"
                />
              </div>

              {/* Heading */}

              <h2 className="text-[24px] font-semibold text-[#1d324e]">
                {t(
                  "myAppointments.title"
                )}
              </h2>

              {/* Description */}

              <p className="text-[14px] text-[#74777e] mt-2 leading-6 max-w-[480px] mx-auto">
                {t(
                  "myAppointments.description"
                )}
              </p>

              {/* Form */}

              <div
                className={`mt-8 ${
                  isArabic
                    ? "text-right"
                    : "text-left"
                }`}
              >

                <label
                  htmlFor="lookupPhone"
                  className="block text-[13px] font-semibold text-[#1d324e] mb-2"
                >
                  {t(
                    "myAppointments.phoneNumber"
                  )}
                </label>

                <input
                  id="lookupPhone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(
                      e.target.value
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                  placeholder={t(
                    "myAppointments.phonePlaceholder"
                  )}
                  className="myappt-phone-input"
                />

                {/* Search Error */}

                {searchError && (
                  <p className="text-[13px] text-[#9a3b3b] mt-2">
                    {searchError}
                  </p>
                )}
              </div>

              {/* Search Button */}

              <button
                type="button"
                onClick={
                  handleSearch
                }
                disabled={loading}
                className="myappt-search-button mt-5"
              >
                <Search size={18} />

                <span>
                  {loading
                    ? t(
                        "myAppointments.searching"
                      )
                    : t(
                        "myAppointments.viewAppointments"
                      )}
                </span>
              </button>

              {/* Helper */}

              <p className="myappt-helper-text">
                {t(
                  "myAppointments.helper"
                )}
              </p>

            </div>

          </section>
        )}

        {/* ===================================================
            RESULTS
        =================================================== */}

        {hasSearched && (
          <section className="px-5 pt-8">

            <div className="max-w-[900px] mx-auto">

              {/* Results Header */}

              <div
                className={`myappt-results-header flex items-center justify-between mb-6 gap-4 ${
                  isArabic
                    ? "flex-row-reverse"
                    : ""
                }`}
              >

                <div>
                  <p className="text-[12px] uppercase tracking-wider font-semibold text-[#74777e]">
                    {t(
                      "myAppointments.showingResultsFor"
                    )}
                  </p>

                  <p className="text-[16px] font-semibold text-[#1d324e] mt-1">
                    {phoneNumber}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    handleNewSearch
                  }
                  className="myappt-new-search-button"
                >
                  {t(
                    "myAppointments.searchAnother"
                  )}
                </button>

              </div>

              {/* Cancel Error */}

              {cancelError && (
                <div className="mb-5 bg-[#fbeaea] border border-[#e3b6b6] rounded-xl p-4 text-[13px] text-[#9a3b3b]">
                  {cancelError}
                </div>
              )}

              {/* Loading */}

              {loading && (
                <div className="myappt-message-card">

                  <div className="myappt-loading-icon">
                    <Search size={22} />
                  </div>

                  <p className="text-[15px] font-semibold text-[#1d324e]">
                    {t(
                      "myAppointments.loading"
                    )}
                  </p>

                  <p className="text-[13px] text-[#74777e] mt-1">
                    {t(
                      "myAppointments.pleaseWait"
                    )}
                  </p>

                </div>
              )}

              {/* No appointments */}

              {!loading &&
                appointments.length ===
                  0 && (
                  <div className="myappt-message-card">

                    <div className="mx-auto w-14 h-14 rounded-full bg-[#f0eded] flex items-center justify-center mb-4">
                      <Calendar
                        size={24}
                        className="text-[#74777e]"
                      />
                    </div>

                    <p className="text-[16px] font-semibold text-[#1d324e]">
                      {t(
                        "myAppointments.noAppointments"
                      )}
                    </p>

                    <p className="text-[13px] text-[#74777e] mt-2 max-w-[400px] mx-auto leading-6">
                      {t(
                        "myAppointments.noAppointmentsDescription"
                      )}
                    </p>

                    <button
                      type="button"
                      onClick={
                        handleNewSearch
                      }
                      className="myappt-empty-search-button"
                    >
                      {t(
                        "myAppointments.searchAgain"
                      )}
                    </button>

                  </div>
                )}

              {/* Appointments */}

              {!loading &&
                appointments.length >
                  0 && (
                  <div className="space-y-4">

                    {appointments.map(
                      (appt) => {

                        const {
                          dateLabel,
                          timeLabel,
                        } =
                          formatDateTime(
                            appt.scheduledAt,
                            lang
                          );

                        const statusKind = getStatusTranslationKey(appt.status);

                        const cancellable = isCancellableStatus(appt.status);

                        const isConfirming =
                          confirmingId ===
                          appt.id;

                        const isCancelling =
                          cancellingId ===
                          appt.id;

                        return (
                          <div
                            key={
                              appt.id
                            }
                            className="myappt-appointment-card"
                          >

                            {/* Appointment Info */}

                            <div className="p-5 md:p-6 flex items-start gap-4">

                              {/* Doctor Icon */}

                              <div className="myappt-doctor-icon">
                                <Stethoscope
                                  size={24}
                                />
                              </div>

                              {/* Content */}

                              <div className="flex-grow min-w-0">

                                <div className="flex items-start justify-between gap-3">

                                  <div className="min-w-0">

                                    <h3 className="text-[17px] font-semibold text-[#1d324e] truncate">
                                      {
                                        appt.doctorName
                                      }
                                    </h3>

                                    <p className="text-[13px] text-[#74777e] mt-1">
                                      {getAppointmentTypeLabel(
                                        appt.appointmentType
                                      )}
                                    </p>

                                  </div>

                                  <span
                                    className={`myappt-status-badge myappt-status-${statusKind}`}
                                  >
                                    {getStatusLabel(
                                      appt.status
                                    )}
                                  </span>

                                </div>

                                {/* Date / Time */}

                                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-[13px] text-[#44474d]">

                                  <span className="flex items-center gap-2">

                                    <Calendar
                                      size={16}
                                      className="text-[#775a19]"
                                    />

                                    {dateLabel}

                                  </span>

                                  <span className="flex items-center gap-2">

                                    <Clock
                                      size={16}
                                      className="text-[#775a19]"
                                    />

                                    {timeLabel}

                                  </span>

                                </div>

                              </div>

                            </div>

                            {/* Cancel Area */}

                            {cancellable && (
                              <div className="border-t border-[#e4e2e1] px-5 py-3">

                                {!isConfirming ? (
                                  <div
                                    className={`flex ${
                                      isArabic
                                        ? "justify-start"
                                        : "justify-end"
                                    }`}
                                  >

                                    <button
                                      type="button"
                                      onClick={() =>
                                        setConfirmingId(
                                          appt.id
                                        )
                                      }
                                      className="myappt-cancel-button"
                                    >
                                      <XCircle
                                        size={16}
                                      />

                                      <span>
                                        {t(
                                          "myAppointments.cancelAppointment"
                                        )}
                                      </span>

                                    </button>

                                  </div>
                                ) : (
                                  <div
                                    className={`myappt-cancel-confirm flex items-center justify-between gap-3 ${
                                      isArabic
                                        ? "flex-row-reverse"
                                        : ""
                                    }`}
                                  >

                                    <span className="text-[13px] text-[#44474d]">
                                      {t(
                                        "myAppointments.cancelQuestion"
                                      )}
                                    </span>

                                    <div className="flex items-center gap-3">

                                      <button
                                        type="button"
                                        onClick={() =>
                                          setConfirmingId(
                                            null
                                          )
                                        }
                                        className="myappt-keep-button"
                                      >
                                        <X
                                          size={14}
                                        />

                                        {t(
                                          "myAppointments.keepAppointment"
                                        )}
                                      </button>

                                      <button
                                        type="button"
                                        disabled={
                                          isCancelling
                                        }
                                        onClick={() =>
                                          handleConfirmCancel(
                                            appt.id
                                          )
                                        }
                                        className="myappt-confirm-cancel-button"
                                      >
                                        {isCancelling
                                          ? t(
                                              "myAppointments.cancelling"
                                            )
                                          : t(
                                              "myAppointments.confirmCancel"
                                            )}
                                      </button>

                                    </div>

                                  </div>
                                )}

                              </div>
                            )}

                          </div>
                        );
                      }
                    )}

                  </div>
                )}

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default MyAppointments;