export type Staff = {
  id: string; // Unique staff ID
  name: string; // Full name
  email?: string; // Optional email
  phone?: string; // Optional phone number
  role?: "admin" | "operator"; // Staff role
  createdAt?: string; // Date added
  password: string;
  isActive: boolean;
  updatedAt: string; // Full name
};

export const initialStaff: Staff = {
  id: "",
  name: "",
  email: "",
  phone: "",
  role: "operator",
  createdAt: new Date().toISOString(),
  password: "password",
  updatedAt: "",
  isActive: false,
};

export type staffWithId = Staff & { _id?: string };
export type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "operator";
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string; // Full name
  password: string;
};
export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

export type Service = {
  name: string;
  description: string;
  price: number;
  duration: string;
  category: "examination" | "treatment" | "surgery" | "consultation" | "";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  maxDiscouunt: number;
};
export type serviceWithId = Service & { _id?: string };
export const initialService: Service = {
  name: "",
  description: "",
  price: 0,
  duration: "",
  category: "", // default category
  isActive: true, // default active
  maxDiscouunt: 0,
  createdAt: new Date().toISOString(),
  updatedAt: "",
};

export type Appointment = {
  id: string;
  ptName: string;
  age: number; // should be number, not string
  phoneNo: string;
  email?: string;
  preferredDate: string; // YYYY-MM-DD
  preferredTime: string; // HH:mm
  purpose: "eye-test" | "frame-selection" | "consultation" | "follow-up";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  // assignedOperator?: string;
  createdAt: string;
  updatedAt: string;
  repeated: boolean;
  gender: "m" | "f" | "other";
};

export const initialAppointment: Appointment = {
  id: "",
  ptName: "",
  age: 0,
  email: "",
  phoneNo: "",
  preferredDate: "",
  preferredTime: "",
  purpose: "eye-test",
  status: "pending",
  notes: "",
  createdAt: new Date().toISOString(),
  updatedAt: "",
  gender: "m",
  repeated: false,
};

export type Patient = {
  // Billing / Order Info
  visitDate: Date;
  billNo: string;

  // Visit
  visitPrice: number;
  visitAdvance:number;
  // Optical

  // Order
  opticalAdvance: number;
  opticalaDue: number;

  orderDate: string;

  frameId: string;
  lenseId: string;
  lensePrice: number;

  framePrice: number;

  deliveryDate: string;

  // Medicine
  medicineName: string;
  medicineAdvance: number;
  medicinePrice: number;
  medicineDue: number;

  // Totals
  totalAmount: number;
  totalAdvance: number;
  totalDue: number;
  // Medical Info
  primaryWorkupBy: string;
  presentComplaints: string[];
  iopPachyCCT: {
    rightEye: {
      methodTime: string;
      iop: number;
      correctedIop?: number;
      cct?: number;
    };
    leftEye: {
      methodTime: string;
      iop: number;
      correctedIop?: number;
      cct?: number;
    };
  };
  vision: {
    rightEye: {
      unaidedDistance: string;
      unaidedNear?: string;
      bestCorrectedDistance?: string;
      bestCorrectedNear?: string;
    };
    leftEye: {
      unaidedDistance: string;
      unaidedNear?: string;
      bestCorrectedDistance?: string;
      bestCorrectedNear?: string;
    };
  };
  examinedBy: string;
  examDetails: {
    adnexa: string;
    conjunctiva: string;
    cornea: string;
    anteriorChamber: string;
    iris: string;
    lens: string;
    fundus: string;
    orbit: string;
    syringing: string;
    vitreous: string;
  };
  diagnosis: string[];
  prescription: string;
  nextReview: string;
  doctorRemarks: string;
  glassesPrescription: {
    rightEye: {
      sph: string;
      cyl?: string;
      axis?: number;
      prism?: string;
      V_A?: string;
      N_V?: string;
    };
    leftEye: {
      sph: string;
      cyl?: string;
      axis?: number;
      prism?: string;
      V_A?: string;
      N_V?: string;
    };
    use: string;
  };
};

export type PatientFullType = Appointment & Patient;
export type PatientFullTypeWithObjectId = PatientFullType & { _id?: string };

export const initialPatient: Patient = {
  // Billing Info
  visitDate: new Date(),

  billNo: "",
  visitPrice: 0,
  visitAdvance:0,
  //order
  opticalAdvance: 0,
  opticalaDue: 0,
  // frame
  orderDate: "",

  frameId: "",
  framePrice: 0,
  // lance
  lenseId: "",
  lensePrice: 0,
  deliveryDate: "",

  //madicine
  medicineName: "",
  medicineAdvance: 0,
  medicinePrice: 0,
  medicineDue: 0,

  totalAmount: 0,
  totalAdvance: 0,
  totalDue: 0,

  // Medical Info (empty/default values)
  primaryWorkupBy: "",
  presentComplaints: [],
  iopPachyCCT: {
    rightEye: { methodTime: "", iop: 0 },
    leftEye: { methodTime: "", iop: 0 },
  },
  vision: {
    rightEye: { unaidedDistance: "" },
    leftEye: { unaidedDistance: "" },
  },
  examinedBy: "",
  examDetails: {
    adnexa: "",
    conjunctiva: "",
    cornea: "",
    anteriorChamber: "",
    iris: "",
    lens: "",
    fundus: "",
    orbit: "",
    syringing: "",
    vitreous: "",
  },
  diagnosis: [],
  prescription: "",
  nextReview: "",
  doctorRemarks: "",
  glassesPrescription: {
    rightEye: { sph: "" },
    leftEye: { sph: "" },
    use: "",
  },
};

export type Vendor = {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};
export type Order = {
  id: string;
  orderDate: string; // e.g., "2024-12-17"
  ptName: string; // patient name
  age: number;
  gender: "male" | "female" | "other";
  phone: string;
  billNo: string;
  rPower: string; // right eye power
  lPower: string; // left eye power
  advance: number;
  due: number;
  vendor: string; // linked to Company.name
  rate: number;
  frame: string;
  lens: string;
  total: number;
  less: number;
  adv: number;
  dueAmount: number;
  rcv: number;
  deliveryDate: string; // ISO date string or empty if not set
  opticalTotal: number;
  status: "processing" | "completed" | "cancelled"; // restrict to valid states
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};
