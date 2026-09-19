import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import { doctorTranslations } from "../../i18n/doctorTranslations";
import { useClinicData } from "../../constant/ClinicDataContext";
import heroImage from "../../assets/hero1.jpeg";
import "./Home.css";
import "../gallery/Gallery.css";

// =========================================================
// SERVICES META
// =========================================================

const serviceMeta = [
  { id: "general", icon: "dentistry" },
  { id: "cosmetic", icon: "auto_awesome" },
  { id: "orthodontics", icon: "health_and_beauty" },
] as const;

// =========================================================
// CASE TYPE
// =========================================================

type HomeCase = {
  id: string;
  before: string;
  after: string;
  eyebrow: string;
  title: string;
  doctor: string;
  doctorId: string;
};

const MAX_HOME_CASES = 8;

// =========================================================
// CASE CAROUSEL
// =========================================================

const CASE_CAROUSEL_INTERVAL_MS = 3000;

// =========================================================
// ICON
// =========================================================

interface IconProps {
  name: string;
  size?: number;
  fill?: boolean;
  className?: string;
}

function Icon({
  name,
  size,
  fill,
  className,
}: IconProps) {
  return (
    <span
      className={`icon material-symbols-outlined ${
        className || ""
      } ${fill ? "icon-fill" : ""} ${
        size ? `icon-size-${size}` : ""
      }`}
    >
      {name}
    </span>
  );
}

// =========================================================
// DOCTOR AVATAR
// Shows the real photo returned by the backend
// (profileImageUrl, set via POST /api/doctors/upload-image
// then POST /api/doctors). Falls back to a neutral person
// icon if the doctor has no photo yet.
// =========================================================

interface DoctorAvatarProps {
  src?: string;
  alt: string;
}

function DoctorAvatar({ src, alt }: DoctorAvatarProps) {
  if (src) {
    return <img src={src} alt={alt} />;
  }

  return (
    <div className="ek-doctor-photo-fallback">
      <Icon name="person" size={40} />
    </div>
  );
}

// =========================================================
// CASE MINI CARD
// =========================================================

interface CaseMiniCardProps {
  data: HomeCase;
  beforeLabel: string;
  afterLabel: string;
  onOpenDoctor: () => void;
}

function CaseMiniCard({
  data,
  beforeLabel,
  afterLabel,
  onOpenDoctor,
}: CaseMiniCardProps) {
  return (
    <button
      type="button"
      className="ek-case-mini-card"
      onClick={onOpenDoctor}
    >
      <div className="ek-case-mini-images">
        <div className="ek-case-mini-image-wrap">
          <img
            src={data.before}
            alt="Before treatment"
          />

          <span className="ek-case-mini-tag">
            {beforeLabel}
          </span>
        </div>

        <div className="ek-case-mini-image-wrap">
          <img
            src={data.after}
            alt="After treatment"
          />

          <span className="ek-case-mini-tag after">
            {afterLabel}
          </span>
        </div>
      </div>

      <div className="ek-case-mini-body">
        <span className="ek-case-mini-eyebrow">
          {data.eyebrow}
        </span>

        <h3 className="ek-case-mini-title">
          {data.title}
        </h3>

        <span className="ek-case-mini-doctor">
          <Icon name="person" size={14} />
          {data.doctor}
        </span>
      </div>
    </button>
  );
}

// =========================================================
// AUTO SCROLL CAROUSEL
// =========================================================

function useAutoScrollCarousel(intervalMs: number) {
  const [node, setNode] =
    useState<HTMLDivElement | null>(null);

  const isPausedRef = useRef(false);

  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      setNode(el);
    },
    []
  );

  useEffect(() => {
    const el = node;

    if (!el) return;

    const handlePause = () => {
      isPausedRef.current = true;
    };

    const handleResume = () => {
      isPausedRef.current = false;
    };

    el.addEventListener("mouseenter", handlePause);
    el.addEventListener("mouseleave", handleResume);
    el.addEventListener("touchstart", handlePause, {
      passive: true,
    });
    el.addEventListener("touchend", handleResume);

    const getStepPx = () => {
      const firstCard =
        el.firstElementChild as HTMLElement | null;

      const gap =
        parseFloat(
          getComputedStyle(el).columnGap || "0"
        ) || 0;

      const cardWidth =
        firstCard?.getBoundingClientRect().width ?? 0;

      return cardWidth > 0 ? cardWidth + gap : 220;
    };

    const interval = setInterval(() => {
      if (isPausedRef.current) return;

      const maxScroll = el.scrollWidth - el.clientWidth;

      if (maxScroll <= 0) return;

      const stepPx = getStepPx();

      const isRtl =
        getComputedStyle(el).direction === "rtl";

      if (isRtl) {
        const atEnd = el.scrollLeft <= -maxScroll + 4;

        el.scrollTo({
          left: atEnd ? 0 : el.scrollLeft - stepPx,
          behavior: "smooth",
        });
      } else {
        const atEnd = el.scrollLeft >= maxScroll - 4;

        el.scrollTo({
          left: atEnd ? 0 : el.scrollLeft + stepPx,
          behavior: "smooth",
        });
      }
    }, intervalMs);

    return () => {
      clearInterval(interval);

      el.removeEventListener("mouseenter", handlePause);
      el.removeEventListener("mouseleave", handleResume);
      el.removeEventListener("touchstart", handlePause);
      el.removeEventListener("touchend", handleResume);
    };
  }, [node, intervalMs]);

  return setRef;
}

// =========================================================
// CLINIC PHONE
// =========================================================

const CLINIC_PHONE = "+20 127 643 9959";

// =========================================================
// MAIN COMPONENT
// =========================================================

export default function ElkamalDentalClinic() {
  const { t, lang } = useLanguage();

  // =======================================================
  // DOCTOR TRANSLATION
  // =======================================================

  const getDoctorTranslation = (
    doctorId: string,
    fallbackName: string,
    fallbackBio: string,
    fallbackSpecialty: string
  ) => {
    return (
      doctorTranslations[lang][doctorId] || {
        name: fallbackName,
        bio: fallbackBio,
        specialty: fallbackSpecialty,
      }
    );
  };

  const {
    doctors,
    doctorsWithPhotos,
    loading,
    error,
  } = useClinicData();

  // =======================================================
  // HERO STATE
  // =======================================================

  const [heroAppointmentType, setHeroAppointmentType] =
    useState("");

  const [heroDoctorId, setHeroDoctorId] = useState("");

  const [heroTab, setHeroTab] =
    useState<"book" | "contact">("book");

  // =======================================================
  // LOADING / ERROR
  // =======================================================

  const loadingDoctors = loading;
  const doctorsError = error;

  const loadingCases = loading;
  const casesError = error;

  // =========================================================
  // CASES
  // =========================================================

  const cases: HomeCase[] = useMemo(() => {
    const combined: HomeCase[] = doctorsWithPhotos.flatMap(
      ({ doctor, photos }) =>
        photos
          .filter(
            (photo) =>
              photo.beforeImageUrl && photo.afterImageUrl
          )
          .map((photo) => {
            const translatedDoctor = getDoctorTranslation(
              doctor.id,
              doctor.name,
              doctor.bio,
              doctor.specialty
            );

            return {
              id: photo.id,
              before: photo.beforeImageUrl,
              after: photo.afterImageUrl,
              eyebrow: translatedDoctor.specialty,
              title: photo.description,
              doctor: translatedDoctor.name,
              doctorId: doctor.id,
            };
          })
    );

    return combined.slice(0, MAX_HOME_CASES);
  }, [doctorsWithPhotos, lang]);

  // =========================================================
  // NAVIGATION
  // =========================================================

  const navigate = useNavigate();
  const location = useLocation();

  // =========================================================
  // CASE CAROUSEL REF
  // =========================================================

  const casesCarouselRef = useAutoScrollCarousel(
    CASE_CAROUSEL_INTERVAL_MS
  );

  // =========================================================
  // SCROLL TO SECTION
  // =========================================================

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace("#", "");

    const timer = setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 150);

    return () => clearTimeout(timer);
  }, [location]);

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="ek-root">
      <main className="ek-main">
        {/* =================================================
            HERO
        ================================================= */}

        <section className="ek-hero">
          <div className="ek-hero-bg">
            <img
              src={heroImage}
              alt=""
              className="ek-hero-bg-image"
            />

            <div className="ek-hero-bg-gradient" />
          </div>

          <div className="ek-hero-inner">
            <div className="ek-hero-copy">
              <div className="ek-hero-badge">
                <Icon name="verified" size={16} />

                <span>{t("home.hero.badge")}</span>
              </div>

              <h1 className="ek-hero-title">
                {t("home.hero.titleLine1")}
                <br />
                <span className="ek-hero-highlight">
                  {t("home.hero.titleLine2")}
                </span>
              </h1>

              <p className="ek-hero-desc">
                {t("home.hero.desc")}
              </p>
            </div>
          </div>

          {/* =================================================
              HERO BOOKING CARD
          ================================================= */}

          <div className="ek-hero-card">
            <div className="ek-hero-card-tabs">
              <button
                type="button"
                className={`ek-hero-card-tab ${
                  heroTab === "book" ? "active" : ""
                }`}
                onClick={() => setHeroTab("book")}
              >
                <Icon name="calendar_month" size={18} />
                {t("home.hero.bookBtn")}
              </button>

              <button
                type="button"
                className={`ek-hero-card-tab ${
                  heroTab === "contact" ? "active" : ""
                }`}
                onClick={() => setHeroTab("contact")}
              >
                <Icon name="call" size={18} />
                {t("home.footer.contactUs")}
              </button>
            </div>

            {heroTab === "book" ? (
              <form
                className="ek-hero-card-form"
                onSubmit={(e) => {
                  e.preventDefault();

                  navigate("/booking", {
                    state: {
                      selectedAppointmentType:
                        heroAppointmentType || undefined,
                      selectedDoctorId:
                        heroDoctorId || undefined,
                    },
                  });
                }}
              >
                {/* Appointment Type */}

                <div className="ek-hero-card-field">
                  <label htmlFor="heroAppointmentType">
                    {t("home.booking.appointmentType.title")}
                  </label>

                  <select
                    id="heroAppointmentType"
                    value={heroAppointmentType}
                    onChange={(e) =>
                      setHeroAppointmentType(e.target.value)
                    }
                  >
                    <option value="">
                      {t(
                        "home.booking.appointmentType.placeholder"
                      )}
                    </option>

                    <option value="Checkup">
                      {t(
                        "home.booking.appointmentType.checkup"
                      )}
                    </option>

                    <option value="TreatmentSession">
                      {t(
                        "home.booking.appointmentType.consultation"
                      )}
                    </option>
                  </select>
                </div>

                {/* Doctor */}

                <div className="ek-hero-card-field">
                  <label htmlFor="heroDoctor">
                    {t("home.booking.doctor.title")}
                  </label>

                  <select
                    id="heroDoctor"
                    value={heroDoctorId}
                    onChange={(e) =>
                      setHeroDoctorId(e.target.value)
                    }
                  >
                    <option value="">
                      {t("gallery.allDoctors")}
                    </option>

                    {doctors.map((d) => {
                      const translatedDoctor =
                        getDoctorTranslation(
                          d.id,
                          d.name,
                          d.bio,
                          d.specialty
                        );

                      return (
                        <option key={d.id} value={d.id}>
                          {translatedDoctor.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Submit */}

                <button
                  type="submit"
                  className="ek-hero-card-submit"
                >
                  {t("home.hero.bookBtn")}
                </button>
              </form>
            ) : (
              <div className="ek-hero-card-contact">
                <p className="ek-hero-card-contact-label">
                  {t("home.footer.contactUs")}
                </p>

                <a
                  className="ek-hero-card-contact-phone"
                  href={`tel:${CLINIC_PHONE.replace(
                    /\s+/g,
                    ""
                  )}`}
                >
                  <Icon name="call" size={20} />
                  <span dir="ltr">{CLINIC_PHONE}</span>
                </a>

                <a
                  className="ek-hero-card-contact-cta"
                  href={`tel:${CLINIC_PHONE.replace(
                    /\s+/g,
                    ""
                  )}`}
                >
                  {t("home.hero.callNow")}
                </a>
              </div>
            )}
          </div>
        </section>

        {/* =================================================
            TRUST BAR
        ================================================= */}

        <section className="ek-trust">
          <div className="ek-container">
            <div className="ek-trust-grid">
              {/* Specialists */}
              <div className="ek-trust-item">
                <div className="ek-trust-icon">
                  <Icon
                    name="workspace_premium"
                    fill
                    size={22}
                  />
                </div>

                <div>
                  <h3 className="ek-trust-title">
                    {t("home.trust.specialistsTitle")}
                  </h3>

                  <p className="ek-trust-sub">
                    {t("home.trust.specialistsSub")}
                  </p>
                </div>
              </div>

              {/* Treatment */}
              <div className="ek-trust-item">
                <div className="ek-trust-icon">
                  <Icon
                    name="medical_information"
                    fill
                    size={22}
                  />
                </div>

                <div>
                  <h3 className="ek-trust-title">
                    {t("home.trust.treatmentTitle")}
                  </h3>

                  <p className="ek-trust-sub">
                    {t("home.trust.treatmentSub")}
                  </p>
                </div>
              </div>

              {/* Environment */}
              <div className="ek-trust-item">
                <div className="ek-trust-icon">
                  <Icon name="spa" fill size={22} />
                </div>

                <div>
                  <h3 className="ek-trust-title">
                    {t("home.trust.environmentTitle")}
                  </h3>

                  <p className="ek-trust-sub">
                    {t("home.trust.environmentSub")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            SERVICES
        ================================================= */}

        <section id="services" className="ek-section ek-container">
          <div className="ek-services-head">
            <h2 className="ek-section-title">
              {t("home.services.sectionTitle")}
            </h2>

            <p className="ek-section-desc">
              {t("home.services.sectionDesc")}
            </p>
          </div>

          <div className="ek-services-grid">
            {/* GENERAL DENTISTRY */}
            <div className="ek-service-card ek-service-span2">
              <div className="ek-service-decor" />

              <div className="ek-service-heading">
                <div className="ek-service-icon">
                  <Icon
                    name={serviceMeta[0].icon}
                    fill
                    size={30}
                  />
                </div>

                <h3 className="ek-service-title">
                  {t(
                    `home.services.${serviceMeta[0].id}.title`
                  )}
                </h3>
              </div>

              <div className="ek-service-content">
                <p className="ek-service-desc">
                  {t(
                    `home.services.${serviceMeta[0].id}.desc`
                  )}
                </p>
              </div>
            </div>

            {/* COSMETIC DENTISTRY */}
            <div className="ek-service-card ek-service-cosmetic">
              <div className="ek-service-heading">
                <div className="ek-service-icon on-secondary">
                  <Icon
                    name={serviceMeta[1].icon}
                    fill
                    size={28}
                  />
                </div>

                <h3 className="ek-service-title">
                  {t(
                    `home.services.${serviceMeta[1].id}.title`
                  )}
                </h3>
              </div>

              <div className="ek-service-content">
                <p className="ek-service-desc small">
                  {t(
                    `home.services.${serviceMeta[1].id}.desc`
                  )}
                </p>
              </div>
            </div>

            {/* ORTHODONTICS */}
            <div className="ek-service-card">
              <div className="ek-service-heading">
                <div className="ek-service-icon on-variant">
                  <Icon
                    name={serviceMeta[2].icon}
                    fill
                    size={28}
                  />
                </div>

                <h3 className="ek-service-title">
                  {t(
                    `home.services.${serviceMeta[2].id}.title`
                  )}
                </h3>
              </div>

              <div className="ek-service-content">
                <p className="ek-service-desc small">
                  {t(
                    `home.services.${serviceMeta[2].id}.desc`
                  )}
                </p>
              </div>
            </div>

            {/* RESTORATIVE DENTISTRY */}
            <div className="ek-service-card ek-service-span2 ek-service-restorative">
              <div className="ek-service-restorative-bg" />
              <div className="ek-service-restorative-fade" />

              <div className="ek-service-heading">
                <div className="ek-service-icon on-primary">
                  <Icon name="dentistry" fill size={28} />
                </div>

                <h3 className="ek-service-title">
                  {t("home.services.restorative.title")}
                </h3>
              </div>

              <div className="ek-service-restorative-copy ek-service-content">
                <p className="ek-service-desc">
                  {t("home.services.restorative.desc")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            CASES / GALLERY
        ================================================= */}

        <section className="ek-section ek-container">
          <div className="ek-section-head">
            <div className="ek-content-narrow">
              <h2 className="ek-section-title">
                {t("home.cases.sectionTitle")}
              </h2>

              <p className="ek-section-desc">
                {t("home.cases.sectionDesc")}
              </p>
            </div>
          </div>

          {/* Loading */}
          {loadingCases && (
            <div className="ek-cases-carousel">
              {[1, 2, 3, 4].map((i) => (
                <div
                  className="ek-case-mini-card ek-skeleton-card"
                  key={i}
                >
                  <div className="ek-case-mini-images">
                    <div className="ek-skeleton-block ek-case-mini-image-wrap" />
                    <div className="ek-skeleton-block ek-case-mini-image-wrap" />
                  </div>

                  <div className="ek-case-mini-body">
                    <div className="ek-skeleton-line ek-skeleton-line-sm" />
                    <div className="ek-skeleton-line ek-skeleton-line-lg" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loadingCases && casesError && (
            <p>{t("home.cases.error")}</p>
          )}

          {/* Empty */}
          {!loadingCases &&
            !casesError &&
            cases.length === 0 && (
              <p>{t("home.cases.empty")}</p>
            )}

          {/* Cases */}
          {!loadingCases &&
            !casesError &&
            cases.length > 0 && (
              <div
                className="ek-cases-carousel"
                ref={casesCarouselRef}
              >
                {cases.map((c) => (
                  <CaseMiniCard
                    key={c.id}
                    data={c}
                    beforeLabel={t("home.cases.before")}
                    afterLabel={t("home.cases.after")}
                    onOpenDoctor={() =>
                      navigate(
                        `/gallery?doctor=${c.doctorId}`
                      )
                    }
                  />
                ))}
              </div>
            )}
        </section>

        {/* =================================================
            DOCTORS
        ================================================= */}

        <section
          id="doctors"
          className="ek-doctors-section ek-section"
        >
          <div className="ek-container">
            <div className="ek-section-head">
              <div className="ek-content-narrow">
                <h2 className="ek-section-title">
                  {t("home.doctors.sectionTitle")}
                </h2>

                <p className="ek-section-desc">
                  {t("home.doctors.sectionDesc")}
                </p>
              </div>
            </div>

            <div className="ek-doctors-grid">
              {/* Loading */}
              {loadingDoctors && (
                <p>{t("home.doctors.loading")}</p>
              )}

              {/* Error */}
              {doctorsError && (
                <p>{t("home.doctors.error")}</p>
              )}

              {/* Doctors */}
              {!loadingDoctors &&
                !doctorsError &&
                doctors.map((d) => {
                  const translatedDoctor =
                    getDoctorTranslation(
                      d.id,
                      d.name,
                      d.bio,
                      d.specialty
                    );

                  return (
                    <div
                      className="ek-doctor-card"
                      key={d.id}
                    >
                      <div className="ek-doctor-photo">
                        <DoctorAvatar
                          src={d.profileImageUrl}
                          alt={`Portrait of ${translatedDoctor.name}`}
                        />
                      </div>

                      <div className="ek-doctor-info">
                        <div className="ek-doctor-heading">
                          <h3 className="ek-doctor-name">
                            {translatedDoctor.name}
                          </h3>

                          <span className="ek-doctor-badge">
                            {translatedDoctor.specialty}
                          </span>
                        </div>

                        <div className="ek-doctor-avail">
                          <Icon name="medical_information" />

                          <span>
                            {translatedDoctor.bio}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>
      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="ek-footer">
        <div className="ek-container ek-footer-grid">
          {/* Brand */}
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

          {/* Quick Links */}
          <div>
            <h4 className="ek-footer-heading">
              {t("home.footer.quickLinks")}
            </h4>

            <ul className="ek-footer-links">
              <li>
                <a
                  href="#services"
                  onClick={(e) => {
                    e.preventDefault();

                    document
                      .getElementById("services")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      });
                  }}
                >
                  {t("home.footer.servicesLink")}
                </a>
              </li>

              <li>
                <a
                  href="#doctors"
                  onClick={(e) => {
                    e.preventDefault();

                    document
                      .getElementById("doctors")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      });
                  }}
                >
                  {t("home.footer.ourDoctorsLink")}
                </a>
              </li>

              <li>
                <a
                  href="/booking"
                  onClick={(e) => {
                    e.preventDefault();

                    navigate("/booking");
                  }}
                >
                  {t("home.footer.bookAppointmentLink")}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="ek-footer-heading">
              {t("home.footer.legal")}
            </h4>

            <ul className="ek-footer-links">
              <li>
                <a href="#">
                  {t("home.footer.privacyPolicy")}
                </a>
              </li>

              <li>
                <a href="#">
                  {t("home.footer.termsOfService")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="ek-footer-heading">
              {t("home.footer.contactUs")}
            </h4>

            <ul className="ek-footer-contact">
              <li>
                <Icon name="location_on" />
                <span>{t("header.clinicAddress")}</span>
              </li>

              <li>
                <Icon name="call" />
                <span dir="ltr">{CLINIC_PHONE}</span>
              </li>

              <li>
                <Icon name="mail" />
                <span>info@elkamalclinic.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="ek-footer-bottom">
          <div className="ek-footer-bottom-inner">
            <p className="ek-footer-copy">
              {t("home.footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}