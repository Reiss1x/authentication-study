import e, {Request, Response} from "express";
import { UserRepository } from "../repositories/UserRepository";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export class UserController {
    async create(req: Request, res: Response){
        try {
            const { name, email, password, active} = req.body
            const existingEmail = await UserRepository.findOneBy({email})

            if(existingEmail) {
                return res.status(400).json({message: "Email already in use."})
            }
           
            const pass = await bcrypt.hash(password, 8)
            const newUser = UserRepository.create({
                name, 
                email, 
                password: pass, 
                active
            })
            await UserRepository.save(newUser)

            const {password: _, ...user} = newUser

            return res.status(201).json(user);
            
        } catch (error) {
            return res.status(500).json({message: "Error creating user"})
        }
        
    }

    async get(req: Request, res: Response){
        const { email, password } = req.body
        const user = await UserRepository.findOneBy({email})
        
        
        try {

            
            
            if(!user) {
                return res.status(500).json({message: "Wrong E-mail Address."})
            }

            const check = await bcrypt.compare(password, user.password);

            if (!check){
                return res.status(500).json({message: "Wrong Password."})
            }

            const token = jwt.sign({id: user.id}, process.env.JWT_PASS ?? '', {
                expiresIn: '1h'
            })

            const {password: _, ...userRes} = user

            return res.json({
                user: userRes,
                token: token,
            })
            
        } catch (error) {
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