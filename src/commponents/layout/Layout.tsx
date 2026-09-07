import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./../header/Header";

export default function Layout() {
 
  const [lang, setLang] = useState("en");

  return (
    <div className="ek-root">
      <Header />
      {/* هنا بالظبط بيتحط محتوى أي صفحة (Home, BookAppointment...) */}
      <Outlet context={{ lang, setLang }} />
    </div>
  );
}