"use client"
import {useState,useEffect} from "react";
import { Staff,Service,Appointment,PatientFullTypeWithObjectId } from "./type";

export function useDashboardData() {
  const [staffs, setStaffs] = useState<Staff[] >([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [patients, setPatients] = useState<PatientFullTypeWithObjectId[]>([]);
  console.log(patients);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard", { method: "GET", cache: "no-store" });
        const data = await res.json();
        setStaffs(data.staff || []);
        setAppointments(data.appointments || []);
        setServices(data.services || []);
        setPatients(data.patients || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    }
    fetchData();
  }, []);

  return { staffs, appointments, services,patients };
}
