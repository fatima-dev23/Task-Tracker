import User from "./models/User.js";
import bcrypt from "bcrypt"
import db from "./db/db.js";


const userRegister = async ()=>{
    await db.connectDB()
    try {
        const hashPassword = await bcrypt.hash("123admin", 11)
        const newUser = new User({
            username : "Admin",
            email : "admin1@gmail.com",
            password: hashPassword,
            role: "admin",

        })
        await newUser.save()
    } catch (error) {
        console.log("Error", error);
        
    }
}

userRegister();