import { prisma } from "../../lib/prisma"


const createMedicine = async (data: {
  name: string;
  description: string;
  price: string; // because Decimal
  stock: number;
  manufacturer: string;
  imageURL?: string;
  categoryId: string;
  sellerId: string;
})=>{
    const result = await prisma.medicine.create({
        data:{
            ...data,
        }
    })
    return result
}

const getAllMedicine=async()=>{
 const result = await prisma.medicine.findMany();
 return result;
}

export const medicineService={
    createMedicine,
    getAllMedicine
    

}