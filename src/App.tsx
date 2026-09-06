import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./commponents/layout/Layout";
import Home from "./commponents/home/Home";
import BookAppointment from "./commponents/bookAppointment/BookAppointment";
import MyAppointments from "./commponents/my_Appointment/MyAppointment";
import Gallery from "./commponents/gallery/Gallery";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout بيترسم مرة واحدة بس، وأي Route جواه بيتحط مكان <Outlet /> بداخله */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<BookAppointment />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/Gallery" element={<Gallery />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;