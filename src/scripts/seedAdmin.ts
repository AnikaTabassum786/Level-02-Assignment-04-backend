import { prisma } from "../lib/prisma"
import { Role } from "../middlewares/auth"

async function seedAdmin(){
    try{
        console.log("***** Admin Seeding Started....")
       const adminData = {
        name:"tom",
        email:"tom@gmail.com",
        role:Role.ADMIN,
        password:'12345678'
       }

       console.log("***** Checking Admin Exist or not")
       const existingUser = await prisma.user.findUnique({
        where:{
            email:adminData.email
        }
       })

       if(existingUser){
        throw new Error("User already existing")
       }

       const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                origin:"http://localhost:3000"
            },
            body: JSON.stringify(adminData)
        })

         if (signUpAdmin.ok) {
            console.log("**** Admin created")
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            })

            console.log("**** Email verification status updated!")
        }
        console.log("******* SUCCESS ******")
    }
    catch(error){
        console.log(error)
    }
}

seedAdmin()