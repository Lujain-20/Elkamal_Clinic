import { useEffect, useState } from "react";
import { getDoctors, getDoctorPhotos } from "../services/doctorService";
import type { Doctor, DoctorPhoto } from "../services/doctorService";
import { useNavigate, useLocation } from "react-router-dom";
import "./Home.css";


const services = [
  {
    variant: "large",
    icon: "dentistry",
    title: "General Dentistry",
    desc: "Routine check-ups, cleanings, and preventive care to maintain your perfect smile and overall oral health.",
  },
  {
    variant: "cosmetic",
    icon: "auto_awesome",
    title: "Cosmetic Dentistry",
    desc: "Veneers, teeth whitening, and complete smile makeovers.",
  },
  {
    variant: "orthodontics",
    icon: "health_and_beauty",
    title: "Orthodontics",
    desc: "Clear aligners and modern braces for perfect alignment.",
  },
];

type HomeCase = {
  id: string;
  before: string;
  after: string;
  eyebrow: string;
  title: string;
  doctor: string;
  doctorId: string;
};

const MAX_HOME_CASES = 2;

const formatSpecialty = (specialty: string) => {
  // Splits stuck-together words like "RestorativeCosmetic" into
  // "Restorative Cosmetic" by inserting a space before each
  // capital letter that follows a lowercase letter.
  return specialty.replace(/([a-z])([A-Z])/g, "$1 $2");
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

export default function ElkamalDentalClinic() {
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [doctorsError, setDoctorsError] = useState("");

  const [cases, setCases] = useState<HomeCase[]>([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [casesError, setCasesError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

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
     SCROLL TO SECTION (Services / Doctors) when arriving with
     a hash, e.g. coming from the header nav on another page.
  ========================================================= */

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace("#", "");

    // Small delay lets fonts/layout settle so the scroll
    // position lands correctly, especially right after
    // navigating from another page.
    const timer = setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);

    return () => clearTimeout(timer);
  }, [location]);

  // use effect Doctor
  useEffect(() => {
  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);

      const data = await getDoctors();

      setDoctors(data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      setDoctorsError("Failed to load doctors");
    } finally {
      setLoadingDoctors(false);
    }
  };

  fetchDoctors();
}, []);

  /* =========================================================
     SMILE TRANSFORMATIONS PREVIEW (real before/after photos)
  ========================================================= */

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoadingCases(true);
        setCasesError("");

        const doctorList = await getDoctors();

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

        const combined: HomeCase[] = photosByDoctor.flatMap(
          ({ doctor, photos }) =>
            photos
              .filter(
                (photo) => photo.beforeImageUrl && photo.afterImageUrl
              )
              .map((photo) => ({
                id: photo.id,
                before: photo.beforeImageUrl,
                after: photo.afterImageUrl,
                eyebrow: formatSpecialty(doctor.specialty),
                title: photo.description,
                doctor: doctor.name,
                doctorId: doctor.id,
              }))
        );

        setCases(combined.slice(0, MAX_HOME_CASES));
      } catch (error) {
        console.error("Failed to load cases:", error);
        setCasesError("Unable to load cases right now.");
      } finally {
        setLoadingCases(false);
      }
    };

    fetchCases();
  }, []);

  return (
    <div className="ek-root">

    

      <main className="ek-main">
        {/* Hero */}
        <section className="ek-hero">
          <div className="ek-hero-bg">
            <div
              className="ek-hero-bg-image"

            />
            <div className="ek-hero-bg-gradient" />
          </div>

          <div className="ek-hero-inner">
            <div className="ek-hero-copy">
              <div className="ek-hero-badge">
                <Icon name="verified" size={16} />
                <span>Premium Dental Care</span>
              </div>
              <h1 className="ek-hero-title">
                Your Smile,
                <br />
                <span>Our Expertise.</span>
              </h1>
              <p className="ek-hero-desc">
                Experience premium dental care with our team of experienced specialists. We
                provide personalized treatments in a modern, comfortable, and tranquil
                environment designed for your peace of mind.
              </p>
              <div className="ek-hero-actions">
                <button
                  className="btn btn-primary btn-large"
                  onClick={() => navigate("/booking")}
                >
                  Book an Appointment
                  <Icon name="calendar_month" size={20} />
                </button>
                <button
  className="btn btn-outline"
  onClick={() => {
    document.getElementById("services")?.scrollIntoView({
      behavior: "smooth",
    });
  }}
>
  Explore Services
</button>
              </div>
              
            </div>

            <div className="ek-hero-art">
              <div className="ek-hero-art-glow" />
              <img
                alt="Confident smiling patient in a modern dental chair with a dentist"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCinBb1jN0lvoBECFb1toBM_OB2D0T1uCWa7I4sCQWwBCFaSEYFulKMqjTLjlqmie9V9bxmtMsjpH_sJtNWGEuRkGTVitXTaaUt0_8BDNGMDnPvObJCxfKbwwODT9CSD1rghMSiSe9YRK35XnVDsY-bmC4sUGmBZ98zH-sqteTEqSsHBuxW7FvOnDMtt4aA-GN3kFu0Yo5VNJ-jOjeSLXoQHq_gXyUJZlJsWY-6KetnrHHesvaJrseICQ"
              />
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="ek-trust">
          <div className="ek-container">
            <div className="ek-trust-grid">
              <div className="ek-trust-item">
                <div className="ek-trust-icon">
                  <Icon name="workspace_premium" fill size={22} />
                </div>
                <div>
                  <h3 className="ek-trust-title">Experienced Specialists</h3>
                  <p className="ek-trust-sub">Expert care you can trust</p>
                </div>
              </div>
              <div className="ek-trust-item">
                <div className="ek-trust-icon">
                  <Icon name="medical_information" fill size={22} />
                </div>
                <div>
                  <h3 className="ek-trust-title">Personalized Treatment</h3>
                  <p className="ek-trust-sub">Tailored to your unique needs</p>
                </div>
              </div>
              <div className="ek-trust-item">
                <div className="ek-trust-icon">
                  <Icon name="spa" fill size={22} />
                </div>
                <div>
                  <h3 className="ek-trust-title">Modern Environment</h3>
                  <p className="ek-trust-sub">Comfort in every visit</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="ek-section ek-container">
          <div className="ek-services-head">
            <h2 className="ek-section-title">Comprehensive Dental Services</h2>
            <p className="ek-section-desc">
              We offer a full spectrum of premium dental treatments utilizing the latest
              technology to ensure optimal oral health and aesthetics.
            </p>
          </div>

          <div className="ek-services-grid">
            {/* General Dentistry — large card */}
            <div className="ek-service-card ek-service-span2">
              <div className="ek-service-decor" />
              <div className="ek-service-top">
                <div className="ek-service-icon">
                  <Icon name={services[0].icon} fill size={32} />
                </div>
              </div>
              <div className="ek-service-content">
                <h3 className="ek-service-title">{services[0].title}</h3>
                <p className="ek-service-desc">{services[0].desc}</p>
              </div>
            </div>

            {/* Cosmetic Dentistry */}
            <div className="ek-service-card ek-service-cosmetic">
              <div className="ek-service-icon on-secondary">
                <Icon name={services[1].icon} fill size={28} />
              </div>
              <div className="ek-service-content">
                <h3 className="ek-service-title">{services[1].title}</h3>
                <p className="ek-service-desc small">{services[1].desc}</p>
              </div>
            </div>

            {/* Orthodontics */}
            <div className="ek-service-card">
              <div className="ek-service-icon on-variant">
                <Icon name={services[2].icon} fill size={28} />
              </div>
              <div className="ek-service-content">
                <h3 className="ek-service-title">{services[2].title}</h3>
                <p className="ek-service-desc small">{services[2].desc}</p>
              </div>
            </div>

            {/* Restorative Dentistry */}
            <div className="ek-service-card ek-service-span2 ek-service-restorative">
              <div
                className="ek-service-restorative-bg"

              />
              <div className="ek-service-restorative-fade" />
              <div className="ek-service-top">
                <div className="ek-service-icon on-primary">
                  <Icon name="cloud_download" fill size={28} />
                </div>
              </div>
              <div className="ek-service-restorative-copy ek-service-content">
                <h3 className="ek-service-title">Restorative Dentistry</h3>
                <p className="ek-service-desc">
                  Implants, crowns, and bridges designed to flawlessly restore the function and
                  natural beauty of your teeth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cases */}
        <section className="ek-section ek-container">
          <div className="ek-section-head">
            <div className="ek-content-narrow">
              <h2 className="ek-section-title">Smile Transformations</h2>
              <p className="ek-section-desc">
                Explore our curated selection of successful dental transformations and
                life-changing results.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate("/gallery")}>
              View All Cases
              <Icon name="arrow_forward" size={18} />
            </button>
          </div>

          {loadingCases && <p>Loading cases...</p>}

          {!loadingCases && casesError && <p>{casesError}</p>}

          {!loadingCases && !casesError && cases.length === 0 && (
            <p>No cases available yet.</p>
          )}

          {!loadingCases && !casesError && cases.length > 0 && (
            <div className="ek-cases-grid">
              {cases.map((c) => (
                <div className="ek-case-card" key={c.id}>
                  <div className="ek-case-images">
                    <div className="ek-case-image-wrap">
                      <img src={c.before} alt="Before treatment" />
                      <span className="ek-case-tag">Before</span>
                    </div>
                    <div className="ek-case-image-wrap">
                      <img src={c.after} alt="After treatment" />
                      <span className="ek-case-tag after">After</span>
                    </div>
                  </div>
                  <div className="ek-case-body">
                    <div>
                      <span className="ek-case-eyebrow">{c.eyebrow}</span>
                      <h3 className="ek-case-title">{c.title}</h3>
                    </div>
                    <div className="ek-case-footer">
                      <div className="ek-case-doc">
                        <Icon name="person" />
                        <span>{c.doctor}</span>
                      </div>
                      <a
                        className="ek-case-link"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/gallery?doctor=${c.doctorId}`);
                        }}
                      >
                        View Doctor's Cases <Icon name="chevron_right" size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Doctors */}
        <section id="doctors" className="ek-doctors-section ek-section">
          <div className="ek-container">
            <div className="ek-section-head">
              <div className="ek-content-narrow">
                <h2 className="ek-section-title">Meet Our Specialists</h2>
                <p className="ek-section-desc">
                  Dedicated professionals committed to providing you with the highest standard
                  of personalized clinical care.
                </p>
              </div>
              {/* <a className="ek-case-link ek-secondary-link" href="#">
                View All Doctors <Icon name="arrow_forward" size={18} />
              </a> */}
            </div>

            <div className="ek-doctors-grid">

  {loadingDoctors && <p>Loading doctors...</p>}

  {doctorsError && <p>{doctorsError}</p>}

  {!loadingDoctors &&
    !doctorsError &&
    doctors.map((d) => (
      <div className="ek-doctor-card" key={d.id}>
        
        <div className="ek-doctor-photo">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSQhEYFib5Ux3Lnyug4ZR_YjP0UFfeQqTrPG2s62quqxa0U81-Fln68NnA9KolGIJXDVuajjgL0mlhyiCYxp4NsBfyA-z6YFD0QV3ObHJv-WDXWBKs6uUzqAviFME-XTO0R40L1qPxiCYTbI1eSUSz_xY6yUssvLRDYAPQrqB4BFQjrTo-p3oI36VIv8oVs37xx7Q5DjfrcAaAaEPFGOcYgEF7ArG3AaUTepg8YfPymD--rmZvVaYD9g"
            alt={`Portrait of ${d.name}`}
          />
        </div>

        <div className="ek-doctor-info">

          <div className="ek-doctor-heading">
            <h3 className="ek-doctor-name">
              {d.name}
            </h3>

            <p className="ek-doctor-role">
              {d.specialty}
            </p>
          </div>

          <div className="ek-doctor-avail">
            <Icon name="medical_information" />
            <span>{d.bio}</span>
          </div>

          {/* <button className="btn-doctor">
            Book Consultation
          </button> */}

        </div>
      </div>
    ))}
</div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="ek-footer">
        <div className="ek-container ek-footer-grid">
          <div className="ek-footer-brand">
            <a href="#">
              <img
                alt="ELKAMAL Dental Clinic Logo"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjiHZ7i-qSZICLitRFThdvpmWw_IcS0yNrZTE4Ygr_z8smUf3mGaeY3jafdKomhjrTqSLRxWR_t_JcxT0GOOuIlCwb7DYU7fBtUdCLEnK7VjDnRWuVDMqZZ8LVs2_zj0O4gs3vjdBNfcHsfa8GiMrxUTcNRY8_I8Ssr98EyBpBgK2DcJHgXnsJ3m4CKF-RFOE4LU_39pJlhhO8Tk7UB5LpLogPnOM0sFFBZLWM21sFwOtxltifuqSEsXKYbESDwl7NoCo"
              />
            </a>
            <p>Providing premium, personalized dental care in a modern and tranquil environment.</p>
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
            <h4 className="ek-footer-heading">Quick Links</h4>
            <ul className="ek-footer-links">
              <li><a href="#">Services</a></li>
              <li><a href="#">Our Doctors</a></li>
              <li><a href="#">Book Appointment</a></li>
            </ul>
          </div>

          <div>
            <h4 className="ek-footer-heading">Legal</h4>
            <ul className="ek-footer-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="ek-footer-heading">Contact Us</h4>
            <ul className="ek-footer-contact">
              <li>
                <Icon name="location_on" />
                <span>123 Clinical Avenue, Medical District</span>
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
            <p className="ek-footer-copy">© 2024 ELKAMAL Dental Clinic. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}