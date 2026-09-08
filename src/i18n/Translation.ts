export type Lang = "en" | "ar";

/* =========================================================
   TRANSLATIONS
   Organized by page/section so it's easy to find and extend.
   To add a new page: add a new top-level key (e.g. "booking")
   under both "en" and "ar" with matching nested keys, then
   call t("booking.someKey") from that page's component.
========================================================= */

export const translations = {
  en: {
    header: {
      nav: {
        home: "Home",
        services: "Services",
        doctors: "Doctors",
        gallery: "Gallery",
      },
      logoText: "El Kamal ",
      clinicAddress: "َQena - Ginody Street ",
      workingHours: "Sat – Thu: 10:00 AM – 10:00 PM ",
      emergencyLabel: "Emergency",
      appointments: "Appointments",
      bookAppointment: "Book Appointment",
      myAppointments: "My Appointments",
    },
    home: {
      hero: {
        badge: "Premium Dental Care",
        titleLine1: "Your Smile,",
        titleLine2: "Our Expertise.",
        desc: "Experience premium dental care with our team of experienced specialists. We provide personalized treatments in a modern, comfortable, and tranquil environment designed for your peace of mind.",
        bookBtn: "Book an Appointment",
        exploreBtn: "Explore Services",
      },
      trust: {
        specialistsTitle: "Experienced Specialists",
        specialistsSub: "Expert care you can trust",
        treatmentTitle: "Personalized Treatment",
        treatmentSub: "Tailored to your unique needs",
        environmentTitle: "Modern Environment",
        environmentSub: "Comfort in every visit",
      },
      services: {
        sectionTitle: "Comprehensive Dental Services",
        sectionDesc:
          "We offer a full spectrum of premium dental treatments utilizing the latest technology to ensure optimal oral health and aesthetics.",
        general: {
          title: "General Dentistry",
          desc: "Routine check-ups, cleanings, and preventive care to maintain your perfect smile and overall oral health.",
        },
        cosmetic: {
          title: "Cosmetic Dentistry",
          desc: "Veneers, teeth whitening, and complete smile makeovers.",
        },
        orthodontics: {
          title: "Orthodontics",
          desc: "Clear aligners and modern braces for perfect alignment.",
        },
        restorative: {
          title: "Restorative Dentistry",
          desc: "Implants, crowns, and bridges designed to flawlessly restore the function and natural beauty of your teeth.",
        },
      },
      cases: {
        sectionTitle: "Smile Transformations",
        sectionDesc:
          "Explore our curated selection of successful dental transformations and life-changing results.",
        viewAll: "View All Cases",
        loading: "Loading cases...",
        empty: "No cases available yet.",
        error: "Unable to load cases right now.",
        viewDoctorCases: "View Doctor's Cases",
        before: "Before",
        after: "After",
      },
      doctors: {
        sectionTitle: "Meet Our Specialists",
        sectionDesc:
          "Dedicated professionals committed to providing you with the highest standard of personalized clinical care.",
        loading: "Loading doctors...",
        error: "Failed to load doctors.",
      },
      footer: {
        brandDesc:
          "Qena - Ginody Street - Doctors Building above San Thomas for Gold",
        quickLinks: "Quick Links",
        legal: "Legal",
        contactUs: "Contact Us",
        servicesLink: "Services",
        ourDoctorsLink: "Our Doctors",
        bookAppointmentLink: "Book Appointment",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        copyright: "© 2026 ELKAMAL Dental Clinic. All Rights Reserved.",
      },


      // Appointmat

      booking: {
        back: "Back",

        steps: {
          service: "Service",
          doctor: "Doctor",
          dateTime: "Date & Time",
          confirm: "Confirm",
          done: "Done",
        },

        service: {
          title: "Select a Service",
          description: "Choose the dental service you would like to book.",

          general: {
            title: "General Dentistry",
            description:
              "Routine check-ups, cleanings, and preventive care to maintain your perfect smile and overall oral health.",
          },

          cosmetic: {
            title: "Cosmetic Dentistry",
            description:
              "Veneers, teeth whitening, and complete smile makeovers.",
          },

          orthodontics: {
            title: "Orthodontics",
            description:
              "Clear aligners and modern braces for perfect alignment.",
          },

          restorative: {
            title: "Restorative Dentistry",
            description:
              "Implants, crowns, and bridges designed to restore the function and natural beauty of your teeth.",
          },

          select: "Select",
          selected: "Selected",
        },

        doctor: {
          title: "Select a Doctor",
          description:
            "Choose the doctor available for your selected service.",

          selectedService: "Selected Service",

          loading: "Loading doctors...",
          error: "Unable to load doctors. Please try again.",
          empty: "No doctors found.",

          doctorLabel: "Doctor",
        },

        dateTime: {
          checkingAvailability: "Checking availability...",

          available: "Available",
          fullyBooked: "Fully booked",

          noAppointments:
            "No available appointments on this day.",

          availableTimesFor: "Available Times for",
          selectDateFirst: "Select a date first",

          selectAvailableDate:
            "Please select an available date to see the available times.",

          loadingTimes: "Loading available times...",
          noAvailableTimes: "No available times for this date.",
        },

        patient: {
          title: "Patient Information",
          description:
            "Please enter your information to complete the appointment request.",

          fullName: "Full Name",
          fullNamePlaceholder: "Enter your full name",

          phoneNumber: "Phone Number",
          phonePlaceholder: "01xxxxxxxxx",

          notes: "Notes",
          optional: "Optional",
          notesPlaceholder:
            "Anything you would like the doctor to know?",

          summary: "Appointment Summary",

          service: "Service",
          doctor: "Doctor",
          date: "Date",
          time: "Time",
        },

        confirmation: {
          appointmentRequestSent: "Appointment Request Sent",

          successMessage:
            "Your appointment request has been sent successfully and is waiting for doctor confirmation.",

          patient: "Patient",
          doctor: "Doctor",
          dateTime: "Date & Time",
          appointmentStatus: "Appointment Status",

          pendingConfirmation: "Pending Confirmation",

          information:
            "Your request has been sent to the doctor. You will be notified once the doctor reviews and accepts or declines your appointment.",
        },

        errors: {
          selectService: "Please select a service first.",
          selectDoctor: "Please select a doctor first.",
          selectDate: "Please select a date first.",
          selectTime: "Please select a time.",
          enterName: "Please enter your full name.",
          enterPhone: "Please enter your phone number.",

          slotUnavailable:
            "This time slot is no longer available. Please choose another time.",

          appointmentFailed:
            "Unable to send appointment request. Please try again.",
        },

        buttons: {
          continueToDoctor: "Continue to Doctor",
          continueToDateTime: "Continue to Date & Time",
          continueToPatient:
            "Continue to Patient Information",
          sendRequest: "Send Appointment Request",
          sending: "Sending...",
          backToHome: "Back to Home",
        },
      },
    },

    myAppointments: {
      title: "My Appointments",
      description:
        "Enter the phone number you used when booking to see your appointment history and status.",

      phoneNumber: "Phone Number",
      phonePlaceholder: "01xxxxxxxxx",

      searching: "Searching...",
      viewAppointments: "View My Appointments",

      helper:
        "Use the same phone number you entered during booking.",

      showingResultsFor: "Showing results for",
      searchAnother: "Search another number",

      loading: "Loading your appointments...",
      pleaseWait: "Please wait a moment.",

      noAppointments: "No appointments found",
      noAppointmentsDescription:
        "We couldn't find any bookings for this phone number. Please check the number and try again.",

      searchAgain: "Search again",

      cancelAppointment: "Cancel appointment",
      cancelQuestion: "Cancel this appointment?",
      keepAppointment: "Keep it",
      cancelling: "Cancelling...",
      confirmCancel: "Yes, cancel",

      errors: {
        enterPhone: "Please enter your phone number.",
        searchFailed:
          "We couldn't find appointments for this number. Please check it and try again.",
        cancelFailed:
          "Unable to cancel this appointment right now. Please try again.",
      },

      appointmentTypes: {
        generalCheckup: "General Checkup",
        treatmentSession: "Treatment Session",
        orthodonticFollowUp: "Orthodontic Follow-up",
      },

      status: {
        pending: "Pending confirmation",
        confirmed: "Confirmed",
        completed: "Completed",
        cancelled: "Cancelled",
        declined: "Declined",
      },
    },
    gallery: {
      title: "Smile Transformations",
      description:
        "Witness the artistry and precision of our dental team. Explore our gallery of beautiful, healthy smiles.",
      doctor: "Doctor",
      allDoctors: "All Doctors",
      treatment: "Treatment",
      allTreatments: "All Treatments",
      resetFilters: "Reset Filters",
      loading: "Loading gallery...",
      noCases: "No cases match the selected filters.",
      before: "Before",
      after: "After",
    },
  },

  ar: {
    header: {
      nav: {
        home: "الرئيسية",
        services: "الخدمات",
        doctors: "أطباؤنا",
        gallery: "المعرض",
      },
      logoText: "الكمال",
      clinicAddress: "قنا - شارع جينودي - عمارة الدكاترة اعلى سان توماس للذهب",
      workingHours: "السبت – الخميس: 10:00 ص – 10:00 م",
      emergencyLabel: "الطوارئ",
      appointments: "المواعيد",
      bookAppointment: "احجز موعد",
      myAppointments: "مواعيدي",
    },
    home: {
      hero: {
        badge: "رعاية أسنان متميزة",
        titleLine1: "ابتسامتك،",
        titleLine2: "خبرتنا.",
        desc: "استمتع برعاية أسنان متميزة مع فريقنا من المتخصصين ذوي الخبرة. نقدم علاجات مخصصة في بيئة عصرية ومريحة وهادئة، مصممة لراحة بالك.",
        bookBtn: "احجز موعدًا",
        exploreBtn: "استكشف الخدمات",
      },
      trust: {
        specialistsTitle: "أطباء ذوو خبرة",
        specialistsSub: "رعاية موثوقة من خبراء",
        treatmentTitle: "علاج مخصص لك",
        treatmentSub: "مصمم خصيصًا لاحتياجاتك",
        environmentTitle: "بيئة عصرية",
        environmentSub: "راحة في كل زيارة",
      },
      services: {
        sectionTitle: "خدمات طب أسنان شاملة",
        sectionDesc:
          "نقدم مجموعة كاملة من علاجات الأسنان المتميزة باستخدام أحدث التقنيات لضمان أفضل صحة وجمال لفمك.",
        general: {
          title: "طب الأسنان العام",
          desc: "فحوصات دورية وتنظيف ورعاية وقائية للحفاظ على ابتسامتك المثالية وصحة فمك العامة.",
        },
        cosmetic: {
          title: "طب الأسنان التجميلي",
          desc: "فينير، تبييض الأسنان، وتجديد كامل للابتسامة.",
        },
        orthodontics: {
          title: "تقويم الأسنان",
          desc: "تقويم شفاف وتقويم حديث لمحاذاة مثالية.",
        },
        restorative: {
          title: "طب الأسنان الترميمي",
          desc: "زراعة أسنان وتيجان وجسور مصممة لاستعادة وظيفة وجمال أسنانك الطبيعي بشكل كامل.",
        },
      },
      cases: {
        sectionTitle: "تحولات الابتسامة",
        sectionDesc:
          "استكشف مجموعتنا المختارة من التحولات الناجحة والنتائج التي غيّرت حياة مرضانا.",
        viewAll: "عرض كل الحالات",
        loading: "جاري تحميل الحالات...",
        empty: "لا توجد حالات متاحة حاليًا.",
        error: "تعذر تحميل الحالات في الوقت الحالي.",
        viewDoctorCases: "عرض حالات الطبيب",
        before: "قبل",
        after: "بعد",
      },
      doctors: {
        sectionTitle: "تعرف على أطبائنا",
        sectionDesc:
          "فريق متخصص ملتزم بتقديم أعلى مستوى من الرعاية الطبية الشخصية لك.",
        loading: "جاري تحميل الأطباء...",
        error: "تعذر تحميل بيانات الأطباء.",
      },
      footer: {
        brandDesc:
          "نقدم رعاية أسنان متميزة وشخصية في بيئة عصرية وهادئة.",
        quickLinks: "روابط سريعة",
        legal: "قانوني",
        contactUs: "تواصل معنا",
        servicesLink: "الخدمات",
        ourDoctorsLink: "أطباؤنا",
        bookAppointmentLink: "احجز موعد",
        privacyPolicy: "سياسة الخصوصية",
        termsOfService: "شروط الخدمة",
        copyright: "© 2026 عيادة الكمال لطب الأسنان. جميع الحقوق محفوظة.",
      },

      // الحجز
      booking: {
        back: "رجوع",

        steps: {
          service: "الخدمة",
          doctor: "الطبيب",
          dateTime: "التاريخ والوقت",
          confirm: "التأكيد",
          done: "تم",
        },

        service: {
          title: "اختر الخدمة",
          description: "اختر خدمة الأسنان التي ترغب في حجزها.",

          general: {
            title: "طب الأسنان العام",
            description:
              "فحوصات دورية وتنظيف ورعاية وقائية للحفاظ على ابتسامتك المثالية وصحة فمك العامة.",
          },

          cosmetic: {
            title: "طب الأسنان التجميلي",
            description:
              "فينير، تبييض الأسنان، وتجديد كامل للابتسامة.",
          },

          orthodontics: {
            title: "تقويم الأسنان",
            description:
              "تقويم شفاف وتقويم حديث لمحاذاة مثالية.",
          },

          restorative: {
            title: "طب الأسنان الترميمي",
            description:
              "زراعة أسنان وتيجان وجسور مصممة لاستعادة وظيفة وجمال أسنانك الطبيعي.",
          },

          select: "اختر",
          selected: "تم الاختيار",
        },

        doctor: {
          title: "اختر الطبيب",
          description:
            "اختر الطبيب المتاح للخدمة التي قمت باختيارها.",

          selectedService: "الخدمة المختارة",

          loading: "جاري تحميل الأطباء...",
          error: "تعذر تحميل الأطباء. يرجى المحاولة مرة أخرى.",
          empty: "لم يتم العثور على أطباء.",

          doctorLabel: "الطبيب",
        },

        dateTime: {
          checkingAvailability: "جاري التحقق من المواعيد المتاحة...",

          available: "متاح",
          fullyBooked: "مكتمل",

          noAppointments:
            "لا توجد مواعيد متاحة في هذا اليوم.",

          availableTimesFor: "المواعيد المتاحة لـ",
          selectDateFirst: "اختر تاريخًا أولًا",

          selectAvailableDate:
            "يرجى اختيار تاريخ متاح لعرض المواعيد المتاحة.",

          loadingTimes: "جاري تحميل المواعيد المتاحة...",
          noAvailableTimes: "لا توجد مواعيد متاحة لهذا التاريخ.",
        },

        patient: {
          title: "بيانات المريض",
          description:
            "يرجى إدخال بياناتك لإكمال طلب حجز الموعد.",

          fullName: "الاسم بالكامل",
          fullNamePlaceholder: "أدخل اسمك بالكامل",

          phoneNumber: "رقم الهاتف",
          phonePlaceholder: "01xxxxxxxxx",

          notes: "ملاحظات",
          optional: "اختياري",
          notesPlaceholder:
            "هل هناك أي معلومات تود أن يعرفها الطبيب؟",

          summary: "ملخص الموعد",

          service: "الخدمة",
          doctor: "الطبيب",
          date: "التاريخ",
          time: "الوقت",
        },

        confirmation: {
          appointmentRequestSent: "تم إرسال طلب الموعد",

          successMessage:
            "تم إرسال طلب حجز الموعد بنجاح، وهو الآن في انتظار تأكيد الطبيب.",

          patient: "المريض",
          doctor: "الطبيب",
          dateTime: "التاريخ والوقت",
          appointmentStatus: "حالة الموعد",

          pendingConfirmation: "في انتظار التأكيد",

          information:
            "تم إرسال طلبك إلى الطبيب. سيتم إخطارك بعد مراجعة الطبيب للطلب وقبوله أو رفضه.",
        },

        errors: {
          selectService: "يرجى اختيار خدمة أولًا.",
          selectDoctor: "يرجى اختيار طبيب أولًا.",
          selectDate: "يرجى اختيار تاريخ أولًا.",
          selectTime: "يرجى اختيار وقت.",
          enterName: "يرجى إدخال اسمك بالكامل.",
          enterPhone: "يرجى إدخال رقم هاتفك.",

          slotUnavailable:
            "هذا الموعد لم يعد متاحًا. يرجى اختيار موعد آخر.",

          appointmentFailed:
            "تعذر إرسال طلب الموعد. يرجى المحاولة مرة أخرى.",
        },

        buttons: {
          continueToDoctor: "المتابعة لاختيار الطبيب",
          continueToDateTime: "المتابعة لاختيار التاريخ والوقت",
          continueToPatient: "المتابعة لإدخال بيانات المريض",
          sendRequest: "إرسال طلب الموعد",
          sending: "جاري الإرسال...",
          backToHome: "العودة للرئيسية",
        },
      },
    },
    myAppointments: {
      title: "مواعيدي",
      description:
        "أدخل رقم الهاتف الذي استخدمته عند الحجز لعرض سجل مواعيدك وحالتها.",

      phoneNumber: "رقم الهاتف",
      phonePlaceholder: "01xxxxxxxxx",

      searching: "جاري البحث...",
      viewAppointments: "عرض مواعيدي",

      helper:
        "استخدم نفس رقم الهاتف الذي أدخلته أثناء الحجز.",

      showingResultsFor: "عرض النتائج للرقم",
      searchAnother: "البحث برقم آخر",

      loading: "جاري تحميل مواعيدك...",
      pleaseWait: "يرجى الانتظار لحظة.",

      noAppointments: "لا توجد مواعيد",
      noAppointmentsDescription:
        "لم نتمكن من العثور على أي حجوزات مرتبطة برقم الهاتف هذا. يرجى التحقق من الرقم والمحاولة مرة أخرى.",

      searchAgain: "البحث مرة أخرى",

      cancelAppointment: "إلغاء الموعد",
      cancelQuestion: "هل تريد إلغاء هذا الموعد؟",
      keepAppointment: "الاحتفاظ بالموعد",
      cancelling: "جاري الإلغاء...",
      confirmCancel: "نعم، إلغاء",

      errors: {
        enterPhone: "يرجى إدخال رقم الهاتف.",
        searchFailed:
          "لم نتمكن من العثور على مواعيد لهذا الرقم. يرجى التحقق من الرقم والمحاولة مرة أخرى.",
        cancelFailed:
          "تعذر إلغاء هذا الموعد حاليًا. يرجى المحاولة مرة أخرى.",
      },

      appointmentTypes: {
        generalCheckup: "فحص عام",
        treatmentSession: "جلسة علاج",
        orthodonticFollowUp: "متابعة تقويم الأسنان",
      },

      status: {
        pending: "في انتظار التأكيد",
        confirmed: "تم التأكيد",
        completed: "مكتمل",
        cancelled: "ملغي",
        declined: "مرفوض",
      },
    },
    gallery: {
      title: "تحولات الابتسامة",
      description:
        "شاهد دقة ومهارة فريقنا الطبي واستكشف معرضنا للحالات والابتسامات الجميلة والصحية.",
      doctor: "الطبيب",
      allDoctors: "جميع الأطباء",
      treatment: "نوع العلاج",
      allTreatments: "جميع العلاجات",
      resetFilters: "إعادة تعيين الفلاتر",
      loading: "جاري تحميل المعرض...",
      noCases: "لا توجد حالات تطابق الفلاتر المحددة.",
      before: "قبل",
      after: "بعد",
    },
  },

} as const;