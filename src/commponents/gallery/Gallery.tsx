import {  useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useClinicData } from "../../constant/ClinicDataContext";
import "../home/Home.css";

// import { getDoctors, getDoctorPhotos } from "../services/doctorService";
// import type { Doctor, DoctorPhoto } from "../services/doctorService";

import { useLanguage } from "../../i18n/LanguageContext";

type GalleryCase = {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  description: string;
  beforeImage: string;
  afterImage: string;
};

interface IconProps {
  name: string;
  size?: number;
  fill?: boolean;
  className?: string;
}

function Icon({ name, size, fill, className }: IconProps) {
  return (
    <span
      className={`icon material-symbols-outlined ${className || ""} ${fill ? "icon-fill" : ""} ${size ? `icon-size-${size}` : ""}`}
    >
      {name}
    </span>
  );
}

const badgeColors = [
  "bg-[#fed488] text-[#785a1a]",
  "bg-[#344966] text-[#d4e3ff]",
  "bg-[#4c483f] text-[#bdb7ab]",
];

const formatSpecialty = (specialty: string) => {
  return specialty.replace(/([a-z])([A-Z])/g, "$1 $2");
};




const getBadgeColor = (specialty: string) => {
  let hash = 0;

  for (let i = 0; i < specialty.length; i++) {
    hash = specialty.charCodeAt(i) + ((hash << 5) - hash);
  }

  return badgeColors[Math.abs(hash) % badgeColors.length];
};

export default function SmileTransformations() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
// const location = useLocation();


  const [doctorFilter, setDoctorFilter] = useState(
    searchParams.get("doctor") || "all"
  );

  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  

  /*
  =========================================================
  LANGUAGE
  =========================================================
  */

  const { lang, t } = useLanguage();

  const isArabic = lang === "ar";

const { doctors, doctorsWithPhotos, loading, error } = useClinicData();

const loadError = error ? t("gallery.error") : "";

const cases: GalleryCase[] = useMemo(() => {
  const combined: GalleryCase[] = doctorsWithPhotos.flatMap(
    ({ doctor, photos }) =>
      photos
        .filter(
          (photo) => photo.beforeImageUrl && photo.afterImageUrl
        )
        .map((photo) => ({
          id: photo.id,
          doctorId: doctor.id,
          doctorName: doctor.name,
          specialty: doctor.specialty,
          description: photo.description,
          beforeImage: photo.beforeImageUrl,
          afterImage: photo.afterImageUrl,
        }))
  );

  combined.sort((a, b) => a.doctorName.localeCompare(b.doctorName));

  return combined;
}, [doctorsWithPhotos]);


  

  
  /*
  =========================================================
  FILTER OPTIONS
  =========================================================
  */

  const specialtyOptions = useMemo(() => {
    const unique = Array.from(
      new Set(doctors.map((doctor) => doctor.specialty))
    );

    return unique;
  }, [doctors]);

  /*
  =========================================================
  FILTER CASES
  =========================================================
  */

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const doctorMatches =
        doctorFilter === "all" ||
        item.doctorId === doctorFilter;

      const specialtyMatches =
        specialtyFilter === "all" ||
        item.specialty === specialtyFilter;

      return doctorMatches && specialtyMatches;
    });
  }, [cases, doctorFilter, specialtyFilter]);

  /*
  =========================================================
  RESET FILTERS
  =========================================================
  */

  const resetFilters = () => {
    setDoctorFilter("all");
    setSpecialtyFilter("all");
  };

  /*
  =========================================================
  RENDER
  =========================================================
  */

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen flex flex-col bg-[#fbf9f8] text-[#1b1c1c]"
    >
      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-5 py-8 md:px-16">

        {/* ===================================================
            HEADING
        =================================================== */}

        <section
          className={`mb-8 ${
            isArabic
              ? "text-center md:text-right"
              : "text-center md:text-left"
          }`}
        >
          <h1 className="mb-2 font-['Manrope'] text-[32px] font-bold leading-tight tracking-tight text-[#1d324e] md:text-[48px]">
            {t("gallery.title")}
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-[#44474d]">
            {t("gallery.description")}
          </p>
        </section>

        {/* ===================================================
            FILTERS
        =================================================== */}

        <section className="mb-10 flex flex-col items-stretch justify-between gap-4 rounded-xl border border-[#c4c6ce]/30 bg-[#fbf9f8]/80 p-4 shadow-[0_4px_20px_rgba(52,73,102,0.05)] backdrop-blur-md md:mb-20 md:flex-row md:items-end">

          <div className="flex flex-col gap-4 md:flex-row">

            {/* DOCTOR FILTER */}

            <div className="w-full md:w-64">
              <label
                htmlFor="doctor"
                className="mb-2 block font-['Manrope'] text-sm font-semibold tracking-wider text-[#44474d]"
              >
                {t("gallery.doctor")}
              </label>

              <select
                id="doctor"
                value={doctorFilter}
                onChange={(e) =>
                  setDoctorFilter(e.target.value)
                }
className="w-full cursor-pointer appearance-none rounded-md border border-[#c4c6ce] bg-[#fbf9f8] bg-no-repeat bg-[right_1rem_center] px-4 py-2.5 pr-10 text-[#1b1c1c] outline-none transition focus:border-[#1d324e] focus:ring-1 focus:ring-[#1d324e]"
style={{
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2344474d' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
}}              >
                <option value="all">
                  {t("gallery.allDoctors")}
                </option>

                {doctors.map((doctor) => (
                  <option
                    key={doctor.id}
                    value={doctor.id}
                  >
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* TREATMENT FILTER */}

            <div className="w-full md:w-64">
              <label
                htmlFor="specialty"
                className="mb-2 block font-['Manrope'] text-sm font-semibold tracking-wider text-[#44474d]"
              >
                {t("gallery.treatment")}
              </label>

              <select
                id="specialty"
                value={specialtyFilter}
                onChange={(e) =>
                  setSpecialtyFilter(e.target.value)
                }
                className="w-full cursor-pointer rounded-md border border-[#c4c6ce] bg-[#fbf9f8] px-4 py-2.5 text-[#1b1c1c] outline-none transition focus:border-[#1d324e] focus:ring-1 focus:ring-[#1d324e]"
              >
                <option value="all">
                  {t("gallery.allTreatments")}
                </option>

                {specialtyOptions.map((specialty) => (
                  <option
                    key={specialty}
                    value={specialty}
                  >
                    {formatSpecialty(specialty)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* RESET */}

          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-2 self-end border-0 bg-transparent pb-1 font-['Manrope'] text-sm font-semibold text-[#775a19] transition-colors hover:text-[#1d324e]"
          >
            <span className="material-symbols-outlined text-lg">
              refresh
            </span>

            {t("gallery.resetFilters")}
          </button>
        </section>

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (
          <p className="py-12 text-center text-[#44474d]">
            {t("gallery.loading")}
          </p>
        )}

        {/* ===================================================
            ERROR
        =================================================== */}

        {!loading && loadError && (
          <div className="mb-10 rounded-xl border border-[#e3b6b6] bg-[#fbeaea] p-4 text-center text-[#9a3b3b]">
            {loadError}
          </div>
        )}

        {/* ===================================================
            GALLERY CARDS
        =================================================== */}

        {!loading && !loadError && (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {filteredCases.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-[#c4c6ce]/30 bg-[#fbf9f8] shadow-[0_4px_20px_rgba(52,73,102,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(52,73,102,0.12)]"
              >

                {/* BEFORE / AFTER */}

                <div className="relative flex h-64 w-full divide-x-[3px] divide-white">

                  {/* BEFORE IMAGE */}

                  <div
  className="h-full w-1/2 bg-cover bg-center"
  style={{
    backgroundImage: `url(${item.beforeImage})`,
  }}
/>

                  {/* AFTER IMAGE */}

                 <div
  className="h-full w-1/2 bg-cover bg-center"
  style={{
    backgroundImage: `url(${item.afterImage})`,
  }}
/>

                  {/* CENTER ICON */}

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="grid h-9 w-9 place-items-center rounded-full border border-[#c4c6ce]/20 bg-[#fbf9f8]/90 shadow-md backdrop-blur-sm">
                      <span className="material-symbols-outlined text-xl text-[#1d324e]">
                        compare_arrows
                      </span>
                    </div>
                  </div>

                  {/* BEFORE LABEL */}

                  <span
                    className={`absolute top-2 rounded bg-[#fbf9f8]/80 px-2 py-1 text-xs text-[#1b1c1c] backdrop-blur-sm ${
                      isArabic ? "right-2" : "left-2"
                    }`}
                  >
                    {t("gallery.before")}
                  </span>

                  {/* AFTER LABEL */}

                  <span
                    className={`absolute top-2 rounded bg-[#fbf9f8]/80 px-2 py-1 text-xs text-[#1b1c1c] backdrop-blur-sm ${
                      isArabic ? "left-2" : "right-2"
                    }`}
                  >
                    {t("gallery.after")}
                  </span>
                </div>

                {/* CARD CONTENT */}

                <div className="flex flex-1 flex-col p-4">

                  <div
                    className={`mb-2 flex items-start justify-between gap-3 ${
                      isArabic ? "flex-row-reverse" : ""
                    }`}
                  >

                    {/* SPECIALTY */}

                    <span
                      className={`rounded-full px-2 py-1 text-[11px] uppercase tracking-wider ${getBadgeColor(
                        item.specialty
                      )}`}
                    >
                      {formatSpecialty(item.specialty)}
                    </span>

                    {/* DOCTOR */}

                    <span
                      className={`flex items-center gap-1 text-xs text-[#44474d] ${
                        isArabic
                          ? "text-left"
                          : "text-right"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        person
                      </span>

                      {item.doctorName}
                    </span>
                  </div>

                  {/* DESCRIPTION */}

                  <p
                    className={`mb-4 flex-1 text-base leading-relaxed text-[#44474d] ${
                      isArabic
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </article>
            ))}

          </section>
        )}

        {/* ===================================================
            NO RESULTS
        =================================================== */}

        {!loading &&
  !loadError &&
  filteredCases.length === 0 && (
    <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-[#c4c6ce]/30 bg-white/60 py-16 px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#eef3f7]">
        <span className="material-symbols-outlined text-3xl text-[#1d324e]">
          search_off
        </span>
      </div>
      <p className="text-[16px] font-semibold text-[#1d324e]">
        {t("gallery.noCases")}
      </p>
      <button
        type="button"
        onClick={resetFilters}
        className="mt-4 rounded-lg border border-[#1d324e] px-4 py-2 text-sm font-semibold text-[#1d324e] transition hover:bg-[#1d324e] hover:text-white"
      >
        {t("gallery.resetFilters")}
      </button>
    </div>
  )}

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

     
      <footer className="ek-footer">
        <div className="ek-container ek-footer-grid">
          <div className="ek-footer-brand">
            <a href="#">
              <img
                alt="ELKAMAL Dental Clinic Logo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjiHZ7i-qSZICLitRFThdvpmWw_IcS0yNrZTE4Ygr_z8smUf3mGaeY3jafdKomhjrTqSLRxWR_t_JcxT0GOOuIlCwb7DYU7fBtUdCLEnK7VjDnRWuVDMqZZ8LVs2_zj0O4gs3vjdBNfcHsfa8GiMrxUTcNRY8_I8Ssr98EyBpBgK2DcJHgXnsJ3m4CKF-RFOE4LU_39pJlhhO8Tk7UB5LpLogPnOM0sFFBZLWM21sFwOtxltifuqSEsXKYbESDwl7NoCo"
              />
            </a>
            <p>{t("home.footer.brandDesc")}</p>
            <div className="ek-footer-social">
              <a aria-label="Facebook" href="#">
                <Icon name="thumb_up" />
              </a>
              <a aria-label="Instagram" href="#">
                <Icon name="photo_camera" />
              </a>
            </div>
          </div>

         <div>
            <h4 className="ek-footer-heading">{t("home.footer.quickLinks")}</h4>
            <ul className="ek-footer-links">
              <li><a href="#services" onClick={(e) => { e.preventDefault(); document.getElementById("services")?.scrollIntoView({ behavior: "smooth" }); }}>{t("home.footer.servicesLink")}</a></li>
              <li><a href="#doctors" onClick={(e) => { e.preventDefault(); document.getElementById("doctors")?.scrollIntoView({ behavior: "smooth" }); }}>{t("home.footer.ourDoctorsLink")}</a></li>
              <li><a href="/booking" onClick={(e) => { e.preventDefault(); navigate("/booking"); }}>{t("home.footer.bookAppointmentLink")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="ek-footer-heading">{t("home.footer.legal")}</h4>
            <ul className="ek-footer-links">
              <li><a href="#">{t("home.footer.privacyPolicy")}</a></li>
              <li><a href="#">{t("home.footer.termsOfService")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="ek-footer-heading">{t("home.footer.contactUs")}</h4>
            <ul className="ek-footer-contact">
              <li>
                <Icon name="location_on" />
                <span>{t("header.clinicAddress")}</span>
              </li>
              <li>
                <Icon name="call" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li>
                <Icon name="mail" />
                <span>info@elkamalclinic.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="ek-footer-bottom">
          <div className="ek-footer-bottom-inner">
            <p className="ek-footer-copy">{t("home.footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}