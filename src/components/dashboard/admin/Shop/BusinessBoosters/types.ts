// src/components/dashboard/admin/Shop/BusinessBoosters/types.ts

import { DateRange } from "react-day-picker";
export interface BusinessBooster {
  id: string;
  image: string | null;
  alt: string;
  title: string;
  description: string;
  quantity: number;
  price: number;
  // dates: DateRange[];
  dates: { from: Date; to: Date | null }[];
  createdAt: Date;
  updatedAt: Date;
  idStripe: string | null;
  period: string;
}
