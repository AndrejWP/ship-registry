export type UserRole = 'ADMIN' | 'DISPATCHER' | 'VIEWER';
export type ShipStatus = 'ACTIVE' | 'MAINTENANCE' | 'DECOMMISSIONED';
export type VoyageStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface AuthResponse {
  accessToken: string;
  role: UserRole;
  name: string;
  email: string;
}

export interface Ship {
  id: number;
  name: string;
  type: string;
  imoNumber: string;
  buildYear: number;
  capacity: number;
  status: ShipStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ShipPayload {
  name: string;
  type: string;
  imoNumber: string;
  buildYear: number;
  capacity: number;
  status: ShipStatus;
}

export interface Port {
  id: number;
  name: string;
  country: string;
  city: string;
}

export interface Captain {
  id: number;
  fullName: string;
  licenseNumber: string;
  experienceYears: number;
}

export interface Voyage {
  id: number;
  shipId: number;
  captainId: number;
  departurePortId: number;
  arrivalPortId: number;
  departureDate: string;
  arrivalDate: string;
  status: VoyageStatus;
  ship?: Ship;
  captain?: Captain;
  departurePort?: Port;
  arrivalPort?: Port;
}

export interface VoyagePayload {
  shipId: number;
  captainId: number;
  departurePortId: number;
  arrivalPortId: number;
  departureDate: string;
  arrivalDate: string;
  status: VoyageStatus;
}

export interface MaintenanceRecord {
  id: number;
  shipId: number;
  description: string;
  maintenanceDate: string;
  cost: string;
  ship?: Ship;
}

