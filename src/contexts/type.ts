export type Staff = {
  id: string;          // Unique staff ID
  name: string;        // Full name
  email?: string;      // Optional email
  phone?: string;      // Optional phone number
  role?: "admin" | "operator";  // Staff role
  createdAt?: string;  // Date added
  password:string;
   isActive: boolean;
  updatedAt: string;       // Full name
};


export const initialStaff: Staff = {
  id: "",
  name: "",
  email: "",
  phone: "",
  role: "operator",
  createdAt: new Date().toISOString(),
  password:"password",
  updatedAt:"",
   isActive: false
};
export type User ={
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator';
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;       // Full name
  password:string;
}
export type AuthContextType= {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export type Service = {
  name: string;
  description: string;
  price: number;
  duration: string;
  category: "examination" | "treatment" | "surgery" | "consultation" | "";
  isActive: boolean;
  createdAt:string;
  updatedAt:string;
  maxDiscouunt:number;
};

export const initialService: Service = {
  name: "",
  description: "",
  price: 0,
  duration: "",
  category: "", // default category
  isActive: true,           // default active
  maxDiscouunt:0,
    createdAt:new Date().toISOString(),
    updatedAt:"",
};

export type Appointment = {
  id: string;
  ptName: string;
  age: number; // should be number, not string
  phoneNo: string;
  email?:string;
  preferredDate: string; // YYYY-MM-DD
  preferredTime: string; // HH:mm
  purpose: "eye-test" | "frame-selection" | "consultation" | "follow-up";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  assignedOperator?: string;
  createdAt: string;
  updatedAt: string;
  repeated:boolean;
  gender: "m" | "f" | "other";
};

export const initialAppointment: Appointment = {
  id: "",
  ptName: "",
  age: 0,
  email:"",
  phoneNo: "",
  preferredDate: "",
  preferredTime: "",
  purpose: "eye-test",
  status: "pending",
  notes: "",
  assignedOperator: "",
  createdAt:new Date().toISOString(),
  updatedAt: "",
  gender:"m",
  repeated:false,
};


export type Patient =  {
  orderDate: string;          // Order date (DD/MM/YY)               // Age of patient
  billNo: string;             // Bill number (unique)
  date:string;
  // Eye power / prescription
  rPower: string;             // Right eye power
  lPower: string;             // Left eye power
  cylinderR?: string;         // Right eye cylinder (if astigmatism)
  cylinderL?: string;         // Left eye cylinder
  axisR?: string;             // Right eye axis
  axisL?: string;             // Left eye axis
  addPowerR?: string;         // Right eye near addition
  addPowerL?: string;         // Left eye near addition

  // Medical details
  diagnosis?: string;         // Eye problem (e.g., myopia, hyperopia, cataract)
  doctorName?: string;        // Doctor/Optometrist name
  prescriptionDate?: string;  // Prescription date
  remarks?: string;           // Extra notes
  
  // Order details
  vendor?: string;
  rate?: number;
  frame?: number;
  lens?: number;
  total?: number;
  discount: number;
  advance: number;
  due: number;
  received: number;
  deliveryDate?: string;
  opticalTotal?: number;
  location?:string;
};


export type PatientFullType = Appointment & Patient;
export type PatientFullTypeWithObjectId=PatientFullType & {_id?:string};

const now = new Date();
const formattedDate = `${String(now.getDate()).padStart(2, "0")}-${String(
  now.getMonth() + 1
).padStart(2, "0")}-${String(now.getFullYear()).slice(-2)}`; // dd-mm-yy

export const initialPatient: Patient = {
  date:formattedDate,
  orderDate: "",          
  billNo: "",

  rPower: "",
  lPower: "",
  cylinderR: "",
  cylinderL: "",
  axisR: "",
  axisL: "",
  addPowerR: "",
  addPowerL: "",

  diagnosis: "",
  doctorName: "",
  prescriptionDate: "",
  remarks: "",

  vendor: "",
  rate: 0,
  frame: 0,
  lens: 0,
  total: 0,
  discount: 0,
  advance: 0,
  due: 0,
  received: 0,
  deliveryDate: "",
  opticalTotal: 0,
  location:"",
}; 


export type Vendor = {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  isActive: boolean;
  createdAt: string;  // ISO date string
  updatedAt: string;  // ISO date string
};
export type Order = {
  id: string;
  orderDate: string;       // e.g., "2024-12-17"
  ptName: string;          // patient name
  age: number;
  gender: "male" | "female" | "other";
  phone: string;
  billNo: string;
  rPower: string;          // right eye power
  lPower: string;          // left eye power
  advance: number;
  due: number;
  vendor: string;          // linked to Company.name
  rate: number;
  frame: string;
  lens: string;
  total: number;
  less: number;
  adv: number;
  dueAmount: number;
  rcv: number;
  deliveryDate: string;    // ISO date string or empty if not set
  opticalTotal: number;
  status: "processing" | "completed" | "cancelled"; // restrict to valid states
  createdAt: string;       // ISO string
  updatedAt: string;       // ISO string
};
