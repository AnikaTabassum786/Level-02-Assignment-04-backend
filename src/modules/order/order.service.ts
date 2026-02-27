import { OrderStatus, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma"

const createOrder = async (data: {
    customerId: string;
    shippingAddress: string;
    items: {
        medicineId: string;
        quantity: number;
    }[];
}) => {
    return await prisma.$transaction(async (tx) => {
        // let totalAmount = new Prisma.Decimal(0);
        let totalAmount = 0;
        const orderItemsData = [];

        for (const item of data.items) {
            const medicine = await tx.medicine.findUnique({
                where: { id: item.medicineId }
            })

            if (!medicine) {
                throw new Error("Medicine is not found");
            }

            if (medicine.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${medicine.name}`)
            }

            // const itemTotal = new Prisma.Decimal(medicine.price).mul(item.quantity);
            // totalAmount = totalAmount.add(itemTotal);

            const itemTotal = Number(medicine.price) * item.quantity;
            totalAmount = totalAmount + itemTotal;

            orderItemsData.push({
                medicineId: item.medicineId,
                quantity: item.quantity,
                price: medicine.price
            })

            await tx.medicine.update({
                where: { id: item.medicineId },
                data: {
                    stock: {
                        decrement: item.quantity
                    }
                }
            })
        }

        const order = await tx.order.create({
            data: {
                customerId: data.customerId,
                shippingAddress: data.shippingAddress,
                totalAmount,
                status: OrderStatus.PLACED,
                orderItems: {
                    create: orderItemsData,
                },
            },
            include: {
                orderItems: true
            }
        })
        return order
    })
}

const getOwnOrder = async (customerId: string, role: string) => {

    if (role === "ADMIN") {
        const result = await prisma.order.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
        return result
    }

    const result = await prisma.order.findMany({
        where: {
            customerId
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return { result }
}

export const orderService = {
    createOrder,
    getOwnOrder
}