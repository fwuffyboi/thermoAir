import {
  createTRPCRouter,
  protectedProcedure,
  rateLimitedProtectedProcedure,
} from "~web/server/api/trpc";
import { TRPCError } from "@trpc/server";
import crypto from "node:crypto";

export const boxWebRouter = createTRPCRouter({
  getUserBoxes: rateLimitedProtectedProcedure.query(async ({ ctx }) => {
    const userBoxes = await ctx.prisma.box.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
    });

    return userBoxes.map((box) => ({
      id: box.id,
      name: box.name,
      createdAt: box.createdAt,
      updatedAt: box.updatedAt,
    })) satisfies UserBoxReturned[];
  }),
  fetchCode: protectedProcedure.query(async ({ ctx }) => {
    console.log(ctx.ip, "ip");
    if (!ctx.ip) {
      throw new TRPCError({
        code: "BAD_REQUEST",
      });
    }

    const existingCode = await ctx.prisma.boxInit.findFirst({
      where: {
        creatorId: ctx.session.user.id,
      },
    });

    if (existingCode && existingCode.verificationCode) {
      return {
        verificationCode: existingCode.verificationCode,
      };
    }

    const EightDigitCode = crypto.randomInt(10000000, 99999999);

    const boxInit = await ctx.prisma.boxInit.create({
      data: {
        verificationCode: EightDigitCode.toString(),
        creatorId: ctx.session.user.id,
      },
    });

    return {
      verificationCode: boxInit.verificationCode,
    };
  }),
});

export interface UserBoxReturned {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
