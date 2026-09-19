export const doctorTranslations: Record<
  "en" | "ar",
  Record<
    string,
    {
      name: string;
      bio: string;
      specialty: string;
    }
  >
> = {
  en: {
    "366f7cbd-295d-41b8-9335-6fd9fcfb39da": {
      name: "Dr. Ahmad Ibrahim",
      bio: "Orthodontic consultant with 10 years of experience.",
      specialty: "Orthodontics",
    },

    "5caec077-5107-44d6-bc4b-78f8336334b6": {
      name: "Dr. Michael Kamal",
      bio: "Specialist in cosmetic dentistry and dental restorations.",
      specialty: "Cosmetic & Restorative Dentistry",
    },
  },

  ar: {
    "366f7cbd-295d-41b8-9335-6fd9fcfb39da": {
      name: "د. أحمد ابراهيم",
      bio: "استشاري تقويم أسنان بخبرة 10 سنين",
      specialty: "تقويم الأسنان",
    },

    "5caec077-5107-44d6-bc4b-78f8336334b6": {
      name: "د. مايكل كمال",
      bio: "أخصائية تجميل وتركيبات الأسنان",
      specialty: "تجميل وتركيبات الأسنان",
    },
  },
};