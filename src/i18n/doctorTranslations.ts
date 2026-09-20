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
    "b7c97761-72b9-4f86-9ee9-11e4bdb9771e": {
      name: "Dr. Ahmad Ibrahim",
      bio: "British Fellowship in Orthodontics",
      specialty: "Orthodontics",
    },

    "85fae94d-8ecc-456a-8e61-f1b734e23fcd": {
      name: "Dr. Michael Kamal",
      bio: "Specialist in cosmetic dentistry and dental restorations.",
      specialty: "Cosmetic & Restorative Dentistry",
    },
  },

  ar: {
    "b7c97761-72b9-4f86-9ee9-11e4bdb9771e": {
      name: "د. أحمد ابراهيم",
      bio: "حاصل على الزمالة البريطانية لتقويم الاسنان",
      specialty: "تقويم الأسنان",
    },

    "85fae94d-8ecc-456a-8e61-f1b734e23fcd": {
      name: "د. مايكل كمال",
      bio: "أخصائية تجميل وتركيبات الأسنان",
      specialty: "تجميل وتركيبات الأسنان",
    },
  },
};