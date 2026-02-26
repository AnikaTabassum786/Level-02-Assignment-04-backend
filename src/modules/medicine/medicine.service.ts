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
    maxPrice:number|undefined,
    page: number,
    limit: number,
    skip: number,


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

    // if (payload.minPrice !== undefined || payload.maxPrice !== undefined) {
    //     whereCondition.price = {
    //         gte: payload.minPrice,
    //         lte: payload.maxPrice
    //     };
    // }

    if (payload.category) {
        whereCondition.category = {
            name: {
                equals: payload.category,
                mode: "insensitive",
            },
        };
    }

    const total = await prisma.medicine.count({
        where:whereCondition
    })

    const result = await prisma.medicine.findMany({

        where: whereCondition,
         skip: payload.skip,   
        take: payload.limit, 
        include: {
            category: true,
        },
    });
    // return result;
      return {
       
        pagination: {
            page: payload.page,
            limit: payload.limit,
            total,
            totalPage: Math.ceil(total / payload.limit)

        },
        data:result
    }
}

const getMedicineById = async(medicineId:string)=>{
const result = await prisma.medicine.findUnique({
    where:{
        id:medicineId
    }
})
return result
}


export const medicineService = {
    createMedicine,
    getAllMedicine,
    getMedicineById
}