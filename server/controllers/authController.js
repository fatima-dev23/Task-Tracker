import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const login = async (req,res) => {
    try {
        const {email, password}=req.body
        const user = await User.findOne({email})
        if (!user){
            return res.status(404).json({success:false, error: "Incorrect Email!"})
        }

        const isMatching = await bcrypt.compare(password, user.password)
        if(!isMatching){
            return res.status(404).json({success:false, error: "Incorrect Password!"})
        }

        const token = jwt.sign({_id: user.id, role: user.role},
            process.env.JWT_KEY
        )


        res.status(200).json({success: true, token, user:{_id: user.id, email:user.email, role:user.role}})
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
}

const signup = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: "Email already registered!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        const token = jwt.sign(
            { _id: newUser.id, role: newUser.role },
            process.env.JWT_KEY
        );

        res.status(201).json({ success: true, token, user: { _id: newUser.id, email: newUser.email, role: newUser.role } });
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};

export { login, signup };