import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../i18n/LanguageContext";
import "./Header.css";

interface IconProps {
  name: string;
  size?: number;
  fill?: boolean;
  className?: string;
}

function Icon({ name, size, fill, className }: IconProps) {
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

/* =========================================================
   CLINIC PHONE NUMBERS
========================================================= */

const CLINIC_PHONE = "+20 127 643 9959";
const EMERGENCY_PHONE = "+20 127 643 9959";

/* =========================================================
   NAV LINKS
========================================================= */

type NavItem = {
  key: "home" | "services" | "doctors" | "gallery";
  path: string;
  hash?: string;
  icon: string;
};

const NAV_LINKS: NavItem[] = [
  {
    key: "home",
    path: "/",
    icon: "home",
  },
  {
    key: "services",
    path: "/",
    hash: "services",
    icon: "dentistry",
  },
  {
    key: "doctors",
    path: "/",
    hash: "doctors",
    icon: "stethoscope",
  },
  {
    key: "gallery",
    path: "/gallery",
    icon: "photo_library",
  },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const { lang, setLang, t } = useLanguage();

  /* =========================================================
     DESKTOP APPOINTMENTS DROPDOWN
  ========================================================= */

  const [appointmentsOpen, setAppointmentsOpen] =
    useState(false);

  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [mobileAppointmentsOpen, setMobileAppointmentsOpen] =
    useState(false);

  const closeTimer =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  const mobileMenuRef =
    useRef<HTMLDivElement>(null);

  const menuButtonRef =
    useRef<HTMLButtonElement>(null);

  /* =========================================================
     Close dropdowns when clicking outside
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setAppointmentsOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
        setMobileAppointmentsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     Close mobile menu on viewport resize
  ========================================================= */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
        setMobileAppointmentsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  /* =========================================================
     Desktop hover - Appointments dropdown
  ========================================================= */

  const handleMouseEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }

    setAppointmentsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setAppointmentsOpen(false);
    }, 150);
  };

  /* =========================================================
     Navigation helpers
  ========================================================= */

  const goTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();

    setAppointmentsOpen(false);
    setMobileMenuOpen(false);
    setMobileAppointmentsOpen(false);

    navigate(path);
  };

  /* =========================================================
     Navigation with sections
  ========================================================= */

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem
  ) => {
    e.preventDefault();

    setAppointmentsOpen(false);
    setMobileMenuOpen(false);
    setMobileAppointmentsOpen(false);

    if (!item.hash) {
      navigate(item.path);
      return;
    }

    if (location.pathname === "/") {
      const el = document.getElementById(item.hash);

      el?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      navigate(`/#${item.hash}`);
    }
  };

  /* =========================================================
     Phone links
  ========================================================= */

  const emergencyHref = `tel:${EMERGENCY_PHONE.replace(
    /\s/g,
    ""
  )}`;

  const phoneHref = `tel:${CLINIC_PHONE.replace(
    /\s/g,
    ""
  )}`;

  return (
    <header className="ek-header">

      {/* =====================================================
          TOP INFO BAR
      ===================================================== */}

      <div className="ek-topbar">
        <div className="ek-container ek-topbar-inner">

          {/* LEFT */}

          <div className="ek-topbar-left">

            <span className="ek-topbar-item">
              <Icon
                name="location_on"
                size={16}
              />

              <span>
                {t("header.clinicAddress")}
              </span>
            </span>

            <span className="ek-topbar-item">
              <Icon
                name="schedule"
                size={16}
              />

              <span>
                {t("header.workingHours")}
              </span>
            </span>

          </div>

          {/* RIGHT */}

          <div className="ek-topbar-right">

            {/* CLINIC PHONE */}

            <a
              className="ek-topbar-phone"
              href={phoneHref}
            >
              <Icon
                name="call"
                size={16}
              />

              <span dir="ltr">
                {CLINIC_PHONE}
              </span>
            </a>

            {/* EMERGENCY */}

            <a
              className="ek-topbar-emergency"
              href={emergencyHref}
            >
              <span className="ek-topbar-emergency-dot" />

              <Icon
                name="emergency"
                size={16}
              />

              <span>
                {t("header.emergencyLabel")}:{" "}

                <span dir="ltr">
                  {EMERGENCY_PHONE}
                </span>
              </span>
            </a>

            {/* LANGUAGE */}

            <div className="ek-topbar-lang">

              <button
                type="button"
                className={
                  lang === "en"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setLang("en")
                }
              >
                En
              </button>

              <button
                type="button"
                className={
                  lang === "ar"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setLang("ar")
                }
              >
                عربي
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN HEADER
      ===================================================== */}

      <div className="ek-header-main">

        <div className="ek-container ek-header-inner">

          {/* LEFT */}

          <div className="ek-header-left">

            {/* MOBILE MENU BUTTON */}

            <button
              ref={menuButtonRef}
              type="button"
              className="ek-menu-btn lg-hidden"
              aria-label="Menu"
              aria-haspopup="true"
              aria-expanded={mobileMenuOpen}
              onClick={() => {
                setMobileMenuOpen(
                  (open) => !open
                );

                setMobileAppointmentsOpen(false);
              }}
            >
              <Icon
                name={
                  mobileMenuOpen
                    ? "close"
                    : "menu"
                }
              />
            </button>

            {/* LOGO */}

            <a
              href="/"
              className="ek-logo"
              onClick={(e) =>
                goTo(e, "/")
              }
            >
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNcwU5RiVn0HTHmU2U1u3d1VTlRtOOXXjHxSBMjrL0LqFHxJ6fxbE7YlE4iBx9Nbz4gkweZ-5MZrjbDXzRMUYeEyuwLuA122Bm0uUpQy9DC5EaPq6WlYh2LP89NktybWVhANLT_xLkz40vzNxyAMJMCNVLplDyGtwlojYXTrLx2hEEuf0omuuKLQucZCYxgrS_u1RGTJ7Bm9x1MU4U0ZeoON9j-sitQxtawGIfOfPufWOsHVzPgePGCIulnAKsdx5UxYQ"
                alt="ELKAMAL Dental Clinic Logo"
              />

              <span className="ek-logo-text">
                {t("header.logoText")}
              </span>
            </a>

          </div>

          {/* RIGHT DESKTOP */}

          <div className="ek-header-right">

            {/* NAVIGATION */}

            <nav className="ek-nav lg-flex">

              {NAV_LINKS.map(
                (item) => (
                  <a
                    key={item.key}
                    href={
                      item.hash
                        ? `/#${item.hash}`
                        : item.path
                    }
                    onClick={(e) =>
                      handleNavClick(
                        e,
                        item
                      )
                    }
                  >
                    {t(
                      `header.nav.${item.key}`
                    )}
                  </a>
                )
              )}

            </nav>

            {/* APPOINTMENTS */}

            <div
              className="ek-appointments-dropdown"
              ref={dropdownRef}
              onMouseEnter={
                handleMouseEnter
              }
              onMouseLeave={
                handleMouseLeave
              }
            >

              <button
                type="button"
                className="btn btn-primary ek-appointments-button"
                aria-haspopup="true"
                aria-expanded={
                  appointmentsOpen
                }
                onClick={() =>
                  setAppointmentsOpen(
                    (open) => !open
                  )
                }
              >

                <span>
                  {t(
                    "header.appointments"
                  )}
                </span>

                <Icon
                  name="expand_more"
                  size={18}
                  className={
                    appointmentsOpen
                      ? "ek-chevron-open"
                      : ""
                  }
                />

              </button>

              {appointmentsOpen && (
                <div className="ek-appointments-menu">

                  <a
                    href="/booking"
                    onClick={(e) =>
                      goTo(
                        e,
                        "/booking"
                      )
                    }
                  >
                    <Icon
                      name="calendar_month"
                      size={18}
                    />

                    <span>
                      {t(
                        "header.bookAppointment"
                      )}
                    </span>
                  </a>

                  <a
                    href="/my-appointments"
                    onClick={(e) =>
                      goTo(
                        e,
                        "/my-appointments"
                      )
                    }
                  >
                    <Icon
                      name="event_available"
                      size={18}
                    />

                    <span>
                      {t(
                        "header.myAppointments"
                      )}
                    </span>
                  </a>

                </div>
              )}

            </div>

          </div>
        </div>

        {/* =====================================================
            MOBILE MENU
        ===================================================== */}

        {mobileMenuOpen && (
          <div
            className="ek-mobile-menu"
            ref={mobileMenuRef}
          >

            {/* MOBILE NAV */}

            <nav className="ek-mobile-nav">

              {NAV_LINKS.map(
                (item) => (
                  <a
                    key={item.key}
                    href={
                      item.hash
                        ? `/#${item.hash}`
                        : item.path
                    }
                    onClick={(e) =>
                      handleNavClick(
                        e,
                        item
                      )
                    }
                  >
                    <Icon
                      name={item.icon}
                      size={18}
                    />

                    <span>
                      {t(
                        `header.nav.${item.key}`
                      )}
                    </span>
                  </a>
                )
              )}

              {/* =================================================
                  MOBILE APPOINTMENTS
              ================================================= */}

              <div className="ek-mobile-appointments">

                <button
                  type="button"
                  className="ek-mobile-appointments-btn"
                  aria-expanded={
                    mobileAppointmentsOpen
                  }
                  onClick={() =>
                    setMobileAppointmentsOpen(
                      (open) => !open
                    )
                  }
                >
                  <span className="ek-mobile-appointments-title">

                    <Icon
                      name="calendar_month"
                      size={18}
                    />

                    <span>
                      {t(
                        "header.appointments"
                      )}
                    </span>

                  </span>

                  <Icon
                    name="expand_more"
                    size={20}
                    className={
                      mobileAppointmentsOpen
                        ? "ek-chevron-open"
                        : ""
                    }
                  />
                </button>

                {mobileAppointmentsOpen && (
                  <div className="ek-mobile-appointments-submenu">

                    {/* BOOK APPOINTMENT */}

                    <a
                      href="/booking"
                      onClick={(e) =>
                        goTo(
                          e,
                          "/booking"
                        )
                      }
                    >
                      <Icon
                        name="calendar_month"
                        size={18}
                      />

                      <span>
                        {t(
                          "header.bookAppointment"
                        )}
                      </span>
                    </a>

                    {/* MY APPOINTMENTS */}

                    <a
                      href="/my-appointments"
                      onClick={(e) =>
                        goTo(
                          e,
                          "/my-appointments"
                        )
                      }
                    >
                      <Icon
                        name="event_available"
                        size={18}
                      />

                      <span>
                        {t(
                          "header.myAppointments"
                        )}
                      </span>
                    </a>

                  </div>
                )}

              </div>

            </nav>

            {/* MOBILE CLINIC INFO */}

            <div className="ek-mobile-info">

              <span className="ek-mobile-info-item">

                <Icon
                  name="location_on"
                  size={16}
                />

                <span>
                  {t(
                    "header.clinicAddress"
                  )}
                </span>

              </span>

              <span className="ek-mobile-info-item">

                <Icon
                  name="schedule"
                  size={16}
                />

                <span>
                  {t(
                    "header.workingHours"
                  )}
                </span>

              </span>

            </div>

            {/* MOBILE LANGUAGE */}

            <div className="ek-mobile-lang">

              <button
                type="button"
                className={
                  lang === "en"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setLang("en")
                }
              >
                En
              </button>

              <button
                type="button"
                className={
                  lang === "ar"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setLang("ar")
                }
              >
                عربي
              </button>

            </div>

            {/* MOBILE PHONE */}

            <a
              className="ek-mobile-phone"
              href={phoneHref}
            >
              <Icon
                name="call"
                size={18}
              />

              <span dir="ltr">
                {CLINIC_PHONE}
              </span>
            </a>

            {/* MOBILE EMERGENCY */}

            <a
              className="ek-mobile-emergency"
              href={emergencyHref}
            >
              <span className="ek-topbar-emergency-dot" />

              <Icon
                name="emergency"
                size={18}
              />

              <span>
                {t(
                  "header.emergencyLabel"
                )}:{" "}

                <span dir="ltr">
                  {EMERGENCY_PHONE}
                </span>
              </span>
            </a>

          </div>
        )}

      </div>
    </header>
  );
}