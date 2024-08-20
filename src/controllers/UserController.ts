import {Request, Response} from "express";
import { UserRepository } from "../repositories/UserRepository";

export class UserController {
    async create(req: Request, res: Response){
        try {
            const newUser = UserRepository.create(req.body)
            await UserRepository.save(newUser)
            return res.status(201).json(newUser);
            
        } catch (error) {
            return res.status(500).json({message: "Error creating user"})
        }
        
    }

    async get(req: Request, res: Response){
        const { userId } = req.params;
        const User = await UserRepository.findOneBy({id: Number(userId)})
        try {
            
            if(User) {
                return res.status(200).json(User);
            }
            return res.status(500).json({message: `User ${userId} not found.`})
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: "Error fetching user."})
        }
    }
    
    async delete(req: Request, res: Response){
        const { userId } = req.params;
        const User = await UserRepository.findOneBy({id: Number(userId)})
        try {
            if(User) {
                UserRepository.delete({id: Number(userId)})
                return res.status(200).json({message: `User ${userId} deleted.`,User});
            }
            return res.status(500).json({message: `User ${userId} not found.`})
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: "Error deleting user."})
        }
    }

    async getAll(req: Request, res: Response){
        const deletedUserList = await UserRepository.find()

        try {
            if(deletedUserList) {
                return res.status(200).json(deletedUserList);
            }
            return res.status(500).json({message: `No users found.`})
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({message: "Error fetching users."})
        } 
    }
}