import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
   CLINIC INFO — replace with the real details
========================================================= */

const CLINIC_PHONE = "+20 100 000 0000";
const EMERGENCY_PHONE = "+20 100 000 0001";
const CLINIC_ADDRESS = "Qena , in font of Family Mall , Gnody street ";
const WORKING_HOURS = "Sat – Thu: 10:00 AM – 10:00 PM";

/* =========================================================
   NAV LINKS
   hash items scroll to a section on the Home page; if the
   visitor is on another page, they get navigated to "/" +
   hash first, and Home.tsx handles the scroll on arrival.
========================================================= */

type NavItem = {
  label: string;
  labelAr: string;
  path: string;
  hash?: string;
};

const NAV_LINKS: NavItem[] = [
  { label: "Home", labelAr: "الرئيسية", path: "/" },
  { label: "Services", labelAr: "الخدمات", path: "/", hash: "services" },
  { label: "Doctors", labelAr: "أطباؤنا", path: "/", hash: "doctors" },
  { label: "Gallery", labelAr: "المعرض", path: "/gallery" },
];

interface HeaderProps {
  lang: string;
  setLang: (lang: string) => void;
}

export default function Header({ lang, setLang }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [appointmentsOpen, setAppointmentsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  /* =========================================
     Smart sticky header: the main header (logo,
     nav, Appointments button) stays pinned at the
     top at all times. The top info bar (address,
     hours, emergency number) collapses smoothly
     once the page is scrolled a bit, so the header
     stays compact without losing quick access to
     booking or the emergency number.
  ========================================= */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =========================================
     Close dropdowns when clicking outside
  ========================================= */

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
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =========================================
     Close mobile menu on viewport resize to desktop
  ========================================= */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* =========================================
     Desktop hover (Appointments dropdown)
  ========================================= */

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

  /* =========================================
     Navigation helpers
  ========================================= */

  const goTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault();
    setAppointmentsOpen(false);
    setMobileMenuOpen(false);
    navigate(path);
  };

  // Handles both plain page links and section-anchor links
  // (Services / Doctors), whether we're already on Home or not.
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem
  ) => {
    e.preventDefault();
    setAppointmentsOpen(false);
    setMobileMenuOpen(false);

    if (!item.hash) {
      navigate(item.path);
      return;
    }

    if (location.pathname === "/") {
      const el = document.getElementById(item.hash);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(`/#${item.hash}`);
    }
  };

  const galleryLabel = lang === "ar" ? "المعرض" : "Gallery";

  const emergencyHref = `tel:${EMERGENCY_PHONE.replace(/\s/g, "")}`;
  const phoneHref = `tel:${CLINIC_PHONE.replace(/\s/g, "")}`;

  return (
    <header
      className={`ek-header ${isScrolled ? "ek-header-scrolled" : ""}`}
    >
      {/* ================================
          TOP INFO BAR (desktop / tablet)
          Collapses once the page is scrolled — see
          .ek-header-scrolled .ek-topbar in Header.css
      ================================= */}

      <div className="ek-topbar">
        <div className="ek-container ek-topbar-inner">
          <div className="ek-topbar-left">
            <span className="ek-topbar-item">
              <Icon name="location_on" size={16} />
              <span>{CLINIC_ADDRESS}</span>
            </span>

            <span className="ek-topbar-item">
              <Icon name="schedule" size={16} />
              <span>{WORKING_HOURS}</span>
            </span>
          </div>

          <div className="ek-topbar-right">
            <a className="ek-topbar-phone" href={phoneHref}>
              <Icon name="call" size={16} />
              <span>{CLINIC_PHONE}</span>
            </a>

            <a className="ek-topbar-emergency" href={emergencyHref}>
              <span className="ek-topbar-emergency-dot" />
              <Icon name="emergency" size={16} />
              <span>Emergency: {EMERGENCY_PHONE}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ================================
          MAIN HEADER
      ================================= */}

      <div className="ek-container ek-header-inner">
        {/* LEFT */}

        <div className="ek-header-left">
          <button
            ref={menuButtonRef}
            type="button"
            className="ek-menu-btn lg-hidden"
            aria-label="Menu"
            aria-haspopup="true"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <Icon name={mobileMenuOpen ? "close" : "menu"} />
          </button>

          <a href="/" className="ek-logo" onClick={(e) => goTo(e, "/")}>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNcwU5RiVn0HTHmU2U1u3d1VTlRtOOXXjHxSBMjrL0LqFHxJ6fxbE7YlE4iBx9Nbz4gkweZ-5MZrjbDXzRMUYeEyuwLuA122Bm0uUpQy9DC5EaPq6WlYh2LP89NktybWVhANLT_xLkz40vzNxyAMJMCNVLplDyGtwlojYXTrLx2hEEuf0omuuKLQucZCYxgrS_u1RGTJ7Bm9x1MU4U0ZeoON9j-sitQxtawGIfOfPufWOsHVzPgePGCIulnAKsdx5UxYQ"
              alt="ELKAMAL Dental Clinic Logo"
            />
            <span className="ek-logo-text md-block">ELKAMAL</span>
          </a>
        </div>

        {/* RIGHT (Desktop) */}

        <div className="ek-header-right">
          <nav className="ek-nav lg-flex">
            {NAV_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.hash ? `/#${item.hash}` : item.path}
                onClick={(e) => handleNavClick(e, item)}
              >
                {item.label === "Gallery" ? galleryLabel : item.label}
              </a>
            ))}
          </nav>

          {/* Language toggle — hidden on mobile, shown inside mobile menu instead */}
          <div className="ek-lang-toggle sm-flex">
            <button
              type="button"
              className={lang === "en" ? "active" : ""}
              onClick={() => setLang("en")}
            >
              En
            </button>
            <button
              type="button"
              className={lang === "ar" ? "active" : ""}
              onClick={() => setLang("ar")}
            >
              عربي
            </button>
          </div>

          {/* Appointments dropdown */}
          <div
            className="ek-appointments-dropdown"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className="btn btn-primary ek-appointments-button"
              aria-haspopup="true"
              aria-expanded={appointmentsOpen}
              onClick={() => setAppointmentsOpen((open) => !open)}
            >
              <span>Appointments</span>
              <Icon
                name="expand_more"
                size={18}
                className={appointmentsOpen ? "ek-chevron-open" : ""}
              />
            </button>

            {appointmentsOpen && (
              <div className="ek-appointments-menu">
                <a href="/booking" onClick={(e) => goTo(e, "/booking")}>
                  <Icon name="calendar_month" size={18} />
                  <span>Book Appointment</span>
                </a>

                <a
                  href="/my-appointments"
                  onClick={(e) => goTo(e, "/my-appointments")}
                >
                  <Icon name="event_available" size={18} />
                  <span>My Appointments</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================================
          MOBILE MENU (below 1024px)
      ================================= */}

      {mobileMenuOpen && (
        <div className="ek-mobile-menu" ref={mobileMenuRef}>
          <nav className="ek-mobile-nav">
            {NAV_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.hash ? `/#${item.hash}` : item.path}
                onClick={(e) => handleNavClick(e, item)}
              >
                <Icon
                  name={
                    item.label === "Home"
                      ? "home"
                      : item.label === "Services"
                      ? "dentistry"
                      : item.label === "Doctors"
                      ? "stethoscope"
                      : "photo_library"
                  }
                  size={18}
                />
                <span>
                  {item.label === "Gallery" ? galleryLabel : item.label}
                </span>
              </a>
            ))}

            <a href="/booking" onClick={(e) => goTo(e, "/booking")}>
              <Icon name="calendar_month" size={18} />
              <span>Book Appointment</span>
            </a>

            <a
              href="/my-appointments"
              onClick={(e) => goTo(e, "/my-appointments")}
            >
              <Icon name="event_available" size={18} />
              <span>My Appointments</span>
            </a>
          </nav>

          {/* Clinic info — normally shown in the top bar, which
              is hidden on mobile, so it lives here instead. */}
          <div className="ek-mobile-info">
            <span className="ek-mobile-info-item">
              <Icon name="location_on" size={16} />
              <span>{CLINIC_ADDRESS}</span>
            </span>

            <span className="ek-mobile-info-item">
              <Icon name="schedule" size={16} />
              <span>{WORKING_HOURS}</span>
            </span>
          </div>

          <div className="ek-mobile-lang">
            <button
              type="button"
              className={lang === "en" ? "active" : ""}
              onClick={() => setLang("en")}
            >
              En
            </button>
            <button
              type="button"
              className={lang === "ar" ? "active" : ""}
              onClick={() => setLang("ar")}
            >
              عربي
            </button>
          </div>

          <a className="ek-mobile-phone" href={phoneHref}>
            <Icon name="call" size={18} />
            <span>{CLINIC_PHONE}</span>
          </a>

          <a className="ek-mobile-emergency" href={emergencyHref}>
            <span className="ek-topbar-emergency-dot" />
            <Icon name="emergency" size={18} />
            <span>Emergency: {EMERGENCY_PHONE}</span>
          </a>
        </div>
      )}
    </header>
  );
}