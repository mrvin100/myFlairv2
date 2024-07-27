// import { PrismaClient } from "@prisma/client";
// // import { withAccelerate } from "@prisma/extension-accelerate";

// // export const prisma = new PrismaClient().$extends(withAccelerate());
// export const prisma = new PrismaClient();

import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const prisma = new PrismaClient().$extends(withAccelerate());
