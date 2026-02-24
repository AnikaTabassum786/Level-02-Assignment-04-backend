import { prisma } from "../../lib/prisma";

const createCategory = async (data: { name: string }) => {
  const result = await prisma.category.create({
    data,
  });

  return result;
};

export const categoryService = {
  createCategory
};