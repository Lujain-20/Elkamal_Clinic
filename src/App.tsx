import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LanguageProvider } from "./i18n/LanguageContext";
import { ClinicDataProvider } from "./constant/ClinicDataContext";

import Layout from "./commponents/layout/Layout";
import Home from "./commponents/home/Home";
import Booking from "./commponents/bookAppointment/BookAppointment";
import SmileTransformations from "./commponents/gallery/Gallery";
import MyAppointments from "./commponents/my_Appointment/MyAppointment";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ClinicDataProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/gallery" element={<SmileTransformations />} />
              <Route path="/my-appointments" element={<MyAppointments />} />
            </Route>
          </Routes>
        </ClinicDataProvider>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;