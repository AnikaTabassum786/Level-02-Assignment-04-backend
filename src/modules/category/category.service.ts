import { prisma } from "../../lib/prisma";

const createCategory = async (data: { name: string }) => {
  const result = await prisma.category.create({
    data,
  });

  return result;
};

const getAllCategory = async()=>{
  return await prisma.category.findMany({
    orderBy:{
      createdAt:"desc"
    }
  })
}

export const categoryService = {
  createCategory,
  getAllCategory
};