import asyncHandler from "express-async-handler";

import {prisma} from "../config/prismaConfig.js";
//creating a user
export const createUser = asyncHandler(async(req, res) =>{
   
    let {email} = req.body;
   
// checking if a user already exits
    const userExists = await prisma.user.findUnique({where:{email:email}})
    
    if (!userExists)
    {
        console.log("in if block")
        const user = await prisma.user.create({data:req.body})
       
        res.send({
            message:"User registered successfully",
            user:user,
        }

        )
    }
    else res.status(201).send({message:"user already registered" });
  
}
)
// function to book a visit to a residence

export const bookVisit = asyncHandler(async(req, res)=>{
    const {email, date}= req.body // get the user email and date
    const {id}= req.params;
    try{
     const alreadyBooked = await prisma.user.findUnique({
        where:{email},
        select:{bookedVisits: true}
     })
     if (alreadyBooked.bookedVisits.some((visit)=> visit.id===id))
     {
       res.status(400).json({message:"You have already booked this residency"})
     }
     else{
        await prisma.user.update({
            where: {email:email},
            data:{
                bookedVisits:{push:{id, date}}
            }
        })
     }
     res.send("your visit has been booked successfully")
    }
    catch(err){
        throw new Error(err.message)
    }
})
// function to get all bookings of a user
export const getAllBookings = asyncHandler(async (req,res)=>{
    const {email}= req.body
    try{
        const bookings = await prisma.user.findUnique({
            where:{email},
            select:{bookedVisits: true}
        })
        res.status(200).send(bookings)
    }
    catch(err)
    {
        throw new Error(err.message)
    }
})
// function to cancel a booking
export const cancelBooking = asyncHandler(async(req, res)=>{
    const {email} = req.body;
    const {id} = req.params
    try{
     const user = await prisma.user.findUnique({
        where: {email: email},
        select: {bookedVisits: true}
     })
     const index = user.bookedVisits.findIndex((visit)=> visit.id===id)
         if (index ===-1)
         {
            res.status(404).json({message: "Booking not found"})
         }
         else{
            user.bookedVisits.splice(index ,1)
            await prisma.user.update({
                where: {email},
                data:{
                    bookedVisits: user.bookedVisits
                }

            })
            res.send("Booking cancelled successfully")
         }
    }
    catch(err)
    {
        throw new Error(err.message)
    }
}
)
// function to add a residence in favourite list
export const toFav = asyncHandler(async(req ,res)=>{
    const {email} = req.body;
    const {rid} = req.params;
    try{
        const user = await prisma.user.findUnique(
          {
            where : {email}
          }  
        )
        if(user.favResidenciesID.includes(rid)){
            const updateUser = await prisma.user.update({
                where: {email},
                data:{
                    favResidenciesID:{
                        set:user.favResidenciesID.filter((id)=> id !== rid)
                    }
                }
            })
            res.send({message: "Removed from favorites",user:updateUser})
        }
        else{
            const updateUser = await prisma.user.update({
                where: {email},
                data:{
                    favResidenciesID:{
                        push: rid
                    }
                }
            })
            res.send({message:"updated to favourites", user:updateUser})
        }
       
    }
    catch(err)
    {
        throw new Error(err.message);
    }
})
// function to get all favorites
export const getAllFavorites = asyncHandler(async(req, res)=>{
    const {email} = req.body;
    try{
        const favResd = await prisma.user.findUnique({
            where: {email},
            select:{favResidenciesID: true},
        })
       res.status(200).send(favResd);
    }
    catch(err)
    {
        throw new Error(err.message)
    }
})