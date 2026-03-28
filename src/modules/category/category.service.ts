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

const deleteCategoryById = async (categoryId: string) => {
    const result = await prisma.category.delete({
        where: {
            id: categoryId
        }

    })
    return result
}


export const categoryService = {
  createCategory,
  getAllCategory,
  deleteCategoryById
};