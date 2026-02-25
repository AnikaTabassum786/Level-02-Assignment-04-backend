import { equal } from "node:assert";
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
}) => {
    const result = await prisma.medicine.create({
        data: {
            ...data,
        }
    })
    return result
}

const getAllMedicine = async (payload: {
    search: string | undefined,
    category: string | undefined,
    manufacturer: string | undefined,
    price:number|undefined,
    minPrice:number|undefined,
    maxPrice:number|undefined


}) => {
    const whereCondition: any = {};
     

    if (payload.search) {
        whereCondition.OR = [
            {
                name: {
                    contains: payload.search,
                    mode: "insensitive",
                },
            },
            {
                description: {
                    contains: payload.search,
                    mode: "insensitive",
                },
            },
            {
                manufacturer: {
                    contains: payload.search,
                    mode: "insensitive",
                },
            },
        ];
    }

   if(payload.price !== undefined){
      whereCondition.price={
        equals:payload.price
      }
   }

    if (payload.category) {
        whereCondition.category = {
            name: {
                equals: payload.category,
                mode: "insensitive",
            },
        };
    }

    const result = await prisma.medicine.findMany({

        where: whereCondition,
        include: {
            category: true,
        },
    });
    return result;
}


export const medicineService = {
    createMedicine,
    getAllMedicine
}