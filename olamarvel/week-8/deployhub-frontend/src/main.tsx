import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout"; // we’ll make a layout wrapper
import ActivitiesPage from "./app/activities/page";
import ActivityCreatePage from "./app/activities/create/page";
import ActivityDetailPage from "./app/activities/[id]/page";
import AppointmentsPage from "./app/appointments/page";
import AppointmentCreatePage from "./app/appointments/create/page";
import AppointmentDetailPage from "./app/appointments/[id]/page";
import DoctorsPage from "./app/doctors/page";
import DoctorCreatePage from "./app/doctors/create/page";
import DoctorDetailPage from "./app/doctors/[id]/page";
import LoginPage from "./app/login/page";
import LogoutPage from "./app/logout/page";
import MealsPage from "./app/meals/page";
import RegisterPage from "./app/register/page";
import Home from "./app/page";
import "./app/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/activities/create" element={<ActivityCreatePage />} />
          <Route path="/activities/:id" element={<ActivityDetailPage />} />

          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/appointments/create" element={<AppointmentCreatePage />} />
          <Route path="/appointments/:id" element={<AppointmentDetailPage />} />

          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctors/create" element={<DoctorCreatePage />} />
          <Route path="/doctors/:id" element={<DoctorDetailPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/meals" element={<MealsPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  </React.StrictMode>
);
