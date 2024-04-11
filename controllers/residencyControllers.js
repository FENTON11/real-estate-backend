import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

export const createResidency = asyncHandler(async(req,res)=>{
  const {
    title, 
    description, 
    price, 
    address, 
    country,
    city,
    facilities,
    image,
    userEmail,
}= req.body.data

  
  try{
    const residency = await prisma.residency.create ({
    data:{
    title, 
    description, 
    price, 
    address, 
    country,
    city,
    facilities,
    image,
    owner:{connect:{email:userEmail}},
        },
     }) 
   res.send({message: "Residency created successfully", residency})
  }catch(err)
  {
    if(err.code=== "P2002")// a code that generated to show that the residency address already exits
    {
        throw new Error(" a residency with this address is already exits")
    }
    throw new Error(err.message)
  }
})

export const getAllResidencies = asyncHandler(async(req, res)=>{
    const residencies = await prisma.residency.findMany({
        orderBy:{
            createdAt:"desc"
        }
    })
    res.send(residencies)
})
// function to get a particular residency
export const getResidency = asyncHandler(async(req, res)=>{
    const{id}= req.params;// we use params when we want to pass data by url

    try{
       const residency = await prisma.residency.findUnique(
        {where: {id: id}}
       )
       res.send(residency)
    }
    catch(err)
    {
        throw new Error(err.message)
    }
})



