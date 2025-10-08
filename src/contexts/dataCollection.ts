"use client"
import {useState,useEffect} from "react";
import { staffWithId,serviceWithId,PatientFullTypeWithObjectId } from "./type";

export function useDashboardData() {
  const [staffs, setStaffs] = useState<staffWithId[] >([]);
  const [services, setServices] = useState<serviceWithId[]>([]);
  const [patients, setPatients] = useState<PatientFullTypeWithObjectId[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/dashboard", { method: "GET", cache: "no-store" });
      const data = await res.json();
      setStaffs(data.staff || []);
      setServices(data.services || []);
      setPatients(data.patients || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { staffs, services,patients, fetchData };
}
