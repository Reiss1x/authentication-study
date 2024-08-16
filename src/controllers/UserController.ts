import {Request, Response} from "express";
import { UserRepository } from "../repositories/UserRepository";

export class UserController {
    async create(req: Request, res: Response){
        const newUser = UserRepository.create(req.body)
            await UserRepository.save(newUser)
            return res.status(201).json(newUser);
        
        try {
            
        } catch (error) {
            return res.status(500).json({message: "Error creating user"})
        }
        
    }
}