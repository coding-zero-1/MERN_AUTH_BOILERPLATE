import { z } from "zod";
import { Request, Response } from "express";

export const signUp = async (req:Request, res:Response) => {
    try {
        const { username, password } = req.body;
    
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const signIn = async (req:Request, res:Response) => {
    try {
        const { username, password } = req.body;
    
    
        res.status(200).json({ message: "User signed in successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const signOut = async (req:Request, res:Response) => {

}