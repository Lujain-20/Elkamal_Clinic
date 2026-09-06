import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../home/Home.css";

import { getDoctors, getDoctorPhotos } from "../services/doctorService";
import type { Doctor, DoctorPhoto } from "../services/doctorService";

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
      className={`icon material-symbols-outlined ${className || ""} ${
        fill ? "icon-fill" : ""
      } ${size ? `icon-size-${size}` : ""}`}
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
  // Splits stuck-together words like "RestorativeCosmetic" into
  // "Restorative Cosmetic" by inserting a space before each
  // capital letter that follows a lowercase letter.
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
  const [doctorFilter, setDoctorFilter] = useState(
    searchParams.get("doctor") || "all"
  );
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [lang, setLang] = useState("en");

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [cases, setCases] = useState<GalleryCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const link1 = document.createElement("link");
    link1.rel = "stylesheet";
    link1.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";

    const link2 = document.createElement("link");
    link2.rel = "stylesheet";
    link2.href =
      "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap";

    document.head.appendChild(link1);
    document.head.appendChild(link2);

    return () => {
      document.head.removeChild(link1);
      document.head.removeChild(link2);
    };
  }, []);

  /* =========================================================
     LOAD DOCTORS + THEIR PHOTOS
  ========================================================= */

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const doctorList = await getDoctors();
        setDoctors(doctorList);

        const photosByDoctor = await Promise.all(
          doctorList.map(async (doctor) => {
            try {
              const photos = await getDoctorPhotos(doctor.id);
              return { doctor, photos };
            } catch (error) {
              console.error(
                `Failed to load photos for doctor ${doctor.id}:`,
                error
              );
              return { doctor, photos: [] as DoctorPhoto[] };
            }
          })
        );

        const combined: GalleryCase[] = photosByDoctor.flatMap(
          ({ doctor, photos }) =>
            photos
              .filter(
                (photo) =>
                  photo.beforeImageUrl && photo.afterImageUrl
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

        setCases(combined);
      } catch (error) {
        console.error("Failed to load gallery:", error);
        setLoadError(
          "We couldn't load the gallery right now. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  /* =========================================================
     FILTER OPTIONS (derived from real data)
  ========================================================= */

  const specialtyOptions = useMemo(() => {
    const unique = Array.from(
      new Set(doctors.map((doctor) => doctor.specialty))
    );
    return unique;
  }, [doctors]);

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const doctorMatches =
        doctorFilter === "all" || item.doctorId === doctorFilter;

      const specialtyMatches =
        specialtyFilter === "all" || item.specialty === specialtyFilter;

      return doctorMatches && specialtyMatches;
    });
  }, [cases, doctorFilter, specialtyFilter]);

  const resetFilters = () => {
    setDoctorFilter("all");
    setSpecialtyFilter("all");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f8] text-[#1b1c1c]">

      {/* Header */}
      {/* <header className="ek-header">
        <div className="ek-container ek-header-inner">

          <div className="ek-header-left">
            <button
              className="ek-menu-btn lg-hidden"
              aria-label="Menu"
            >
              <Icon name="menu" />
            </button>

            <a className="ek-logo" href="/">
              <img
                alt="ELKAMAL Dental Clinic Logo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNcwU5RiVn0HTHmU2U1u3d1VTlRtOOXXjHxSBMjrL0LqFHxJ6fxbE7YlE4iBx9Nbz4gkweZ-5MZrjbDXzRMUYeEyuwLuA122Bm0uUpQy9DC5EaPq6WlYh2LP89NktybWVhANLT_xLkz40vzNxyAMJMCNVLplDyGtwlojYXTrLx2hEEuf0omuuKLQucZCYxgrS_u1RGTJ7Bm9x1MU4U0ZeoON9j-sitQxtawGIfOfPufWOsHVzPgePGCIulnAKsdx5UxYQ"
              />

              <span className="ek-logo-text md-block">
                ELKAMAL
              </span>
            </a>
          </div>

          <div className="ek-header-right">

            <nav className="ek-nav lg-flex">
              <a href="/gallery">Cases</a>

              <a href="/gallery" dir="rtl">
                الحالات
              </a>
            </nav>

            <div className="ek-lang-toggle sm-flex">

              <button
                className={lang === "en" ? "active" : ""}
                onClick={() => setLang("en")}
              >
                En
              </button>

              <button
                className={lang === "ar" ? "active" : ""}
                onClick={() => setLang("ar")}
              >
                عربي
              </button>

            </div>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/booking")}
            >
              Book Appointment
              <Icon name="arrow_forward" size={18} />
            </button>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/my-appointments")}
            >
              My Appointments
              <Icon name="arrow_forward" size={18} />
            </button>

          </div>
        </div>
      </header> */}

      {/* Main */}
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-5 py-8 md:px-16">

        {/* Heading */}
        <section className="mb-8 text-center md:text-left">
          <h1 className="mb-2 font-['Manrope'] text-[32px] font-bold leading-tight tracking-tight text-[#1d324e] md:text-[48px]">
            Smile Transformations
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-[#44474d]">
            Witness the artistry and precision of our dental team.
            Explore our gallery of beautiful, healthy smiles.
          </p>
        </section>

        {/* Filters */}
        <section className="mb-10 flex flex-col items-stretch justify-between gap-4 rounded-xl border border-[#c4c6ce]/30 bg-[#fbf9f8]/80 p-4 shadow-[0_4px_20px_rgba(52,73,102,0.05)] backdrop-blur-md md:mb-20 md:flex-row md:items-end">

          <div className="flex flex-col gap-4 md:flex-row">

            {/* Doctor */}
            <div className="w-full md:w-64">
              <label
                htmlFor="doctor"
                className="mb-2 block font-['Manrope'] text-sm font-semibold tracking-wider text-[#44474d]"
              >
                Doctor
              </label>

              <select
                id="doctor"
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="w-full cursor-pointer rounded-md border border-[#c4c6ce] bg-[#fbf9f8] px-4 py-2.5 text-[#1b1c1c] outline-none transition focus:border-[#1d324e] focus:ring-1 focus:ring-[#1d324e]"
              >
                <option value="all">All Doctors</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialty */}
            <div className="w-full md:w-64">
              <label
                htmlFor="specialty"
                className="mb-2 block font-['Manrope'] text-sm font-semibold tracking-wider text-[#44474d]"
              >
                Treatment
              </label>

              <select
                id="specialty"
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="w-full cursor-pointer rounded-md border border-[#c4c6ce] bg-[#fbf9f8] px-4 py-2.5 text-[#1b1c1c] outline-none transition focus:border-[#1d324e] focus:ring-1 focus:ring-[#1d324e]"
              >
                <option value="all">All Treatments</option>
                {specialtyOptions.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {formatSpecialty(specialty)}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-2 self-end border-0 bg-transparent pb-1 font-['Manrope'] text-sm font-semibold text-[#775a19] transition-colors hover:text-[#1d324e]"
          >
            <span className="material-symbols-outlined text-lg">
              refresh
            </span>

            Reset Filters
          </button>

        </section>

        {/* Loading */}
        {loading && (
          <p className="py-12 text-center text-[#44474d]">
            Loading gallery...
          </p>
        )}

        {/* Error */}
        {!loading && loadError && (
          <div className="mb-10 rounded-xl border border-[#e3b6b6] bg-[#fbeaea] p-4 text-center text-[#9a3b3b]">
            {loadError}
          </div>
        )}

        {/* Cards */}
        {!loading && !loadError && (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {filteredCases.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-[#c4c6ce]/30 bg-[#fbf9f8] shadow-[0_4px_20px_rgba(52,73,102,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(52,73,102,0.12)]"
              >

                <div className="relative flex h-64 w-full">

                  <div
                    className="h-full w-1/2 border-r border-[#fbf9f8] bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${item.beforeImage})`,
                    }}
                  />

                  <div
                    className="h-full w-1/2 border-l border-[#fbf9f8] bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${item.afterImage})`,
                    }}
                  />

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="grid h-9 w-9 place-items-center rounded-full border border-[#c4c6ce]/20 bg-[#fbf9f8]/90 shadow-md backdrop-blur-sm">
                      <span className="material-symbols-outlined text-xl text-[#1d324e]">
                        compare_arrows
                      </span>
                    </div>
                  </div>

                  <span className="absolute left-2 top-2 rounded bg-[#fbf9f8]/80 px-2 py-1 text-xs text-[#1b1c1c] backdrop-blur-sm">
                    Before
                  </span>

                  <span className="absolute right-2 top-2 rounded bg-[#fbf9f8]/80 px-2 py-1 text-xs text-[#1b1c1c] backdrop-blur-sm">
                    After
                  </span>

                </div>

                <div className="flex flex-1 flex-col p-4">

                  <div className="mb-2 flex items-start justify-between gap-3">

                    <span
                      className={`rounded-full px-2 py-1 text-[11px] uppercase tracking-wider ${getBadgeColor(
                        item.specialty
                      )}`}
                    >
                      {formatSpecialty(item.specialty)}
                    </span>

                    <span className="flex items-center gap-1 text-right text-xs text-[#44474d]">
                      <span className="material-symbols-outlined text-sm">
                        person
                      </span>

                      {item.doctorName}
                    </span>

                  </div>

                  <p className="mb-4 flex-1 text-base leading-relaxed text-[#44474d]">
                    {item.description}
                  </p>

                </div>

              </article>
            ))}

          </section>
        )}

        {!loading && !loadError && filteredCases.length === 0 && (
          <p className="mt-8 text-center text-[#44474d]">
            No cases match the selected filters.
          </p>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#c4c6ce]/30 bg-[#e4e2e1]">
        <div className="mx-auto w-full max-w-[1280px] px-5 py-8 md:px-16">

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">

            <div className="font-['Manrope'] text-2xl font-bold text-[#1d324e]">
              ELKAMAL Dental Clinic
            </div>

            <nav className="flex flex-wrap justify-center gap-4">
              <a href="#services" className="text-sm font-semibold text-[#44474d] hover:text-[#1d324e]">
                Services
              </a>

              <a href="#doctors" className="text-sm font-semibold text-[#44474d] hover:text-[#1d324e]">
                Our Doctors
              </a>

              <a href="#contact" className="text-sm font-semibold text-[#44474d] hover:text-[#1d324e]">
                Contact Us
              </a>

              <a href="#privacy" className="text-sm font-semibold text-[#44474d] hover:text-[#1d324e]">
                Privacy Policy
              </a>

              <a href="#terms" className="text-sm font-semibold text-[#44474d] hover:text-[#1d324e]">
                Terms of Service
              </a>
            </nav>

          </div>

          <p className="mt-6 text-center text-sm text-[#44474d]">
            © 2024 ELKAMAL Dental Clinic. All Rights Reserved.
          </p>

        </div>
      </footer>

    </div>
  );
}