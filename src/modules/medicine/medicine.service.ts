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

const getAllMedicine=async(payload:{
    search:string|undefined,
    category:string|undefined,
    manufacturer:string|undefined,
   

})=>{

 const result = await prisma.medicine.findMany({
    where: {
  OR: [
    {
      name: {
        contains: payload.search as string,
        mode: "insensitive",
      },
    },
    {
       manufacturer: {
        contains: payload.search as string,
        mode: "insensitive",
      },
    },
  ],
}
 });
 return result;
}


export const medicineService={
    createMedicine,
    getAllMedicine
    

}