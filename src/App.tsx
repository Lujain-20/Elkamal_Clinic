import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LanguageProvider } from "./i18n/LanguageContext";

import Layout from "./commponents/layout/Layout";
import Home from "./commponents/home/Home";
import BookAppointment from "./commponents/bookAppointment/BookAppointment";
import MyAppointments from "./commponents/my_Appointment/MyAppointment";
import Gallery from "./commponents/gallery/Gallery";

function App() {
  return (
    // LanguageProvider يلف الموقع كله، عشان أي كومبوننت (الهيدر
    // وأي صفحة) يقدر يستخدم useLanguage() ويوصل لنفس اللغة
    // الحالية، ولما حد يغيّرها من أي مكان، الموقع كله يتغيّر فورًا.
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* Layout بيترسم مرة واحدة بس، وأي Route جواه بيتحط مكان <Outlet /> بداخله */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<BookAppointment />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            {/* كانت "/Gallery" بحرف كبير — لازم تبقى مطابقة تمامًا
                لكل الروابط في الهيدر وباقي الموقع اللي بتشاور على
                "/gallery" بحرف صغير، لأن React Router حساس لحالة
                الأحرف. */}
            <Route path="/gallery" element={<Gallery />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;