"use server";

import type { BusinessBooster, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const getAllBusinessBoosters = async () => {
  const boosters = await prisma.businessBooster.findMany();

  return boosters.map(booster => ({
    ...booster,
    dates: typeof booster.dates === 'string' 
      ? JSON.parse(booster.dates) 
      : Array.isArray(booster.dates) 
        ? booster.dates 
        : Object.values(booster.dates)
  }));
};
export const getBusinessBoosterById = async (
  id: string
): Promise<BusinessBooster | null> =>
  await prisma.businessBooster.findFirst({
    where: { id },
  });

export const updateBusinessBoosterById = async (
  id: string,
  data: any // TODO: Replace by a true type
): Promise<boolean> =>
  !!(await prisma.businessBooster.update({
    where: { id },
    data,
  }));

export const deleteBusinessBoosterById = async (id: string): Promise<boolean> =>
  !!(await prisma.businessBooster.delete({
    where: { id },
  }));
