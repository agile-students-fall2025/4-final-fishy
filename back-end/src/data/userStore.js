import User from '../models/user.js';
import bcrypt from 'bcryptjs';

export async function createUser({ username, email, password }) {
    const newUser = await User.create({
        username,
        email,
        password // raw password
    });

    return {
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email
    };
}


export async function findByEmail(email) {
    const user = await User.findOne({ email });

    if (!user) return null;

    return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        password: user.password, // required for validateUser
        createdAt: user.createdAt
    };
}

export async function validateUser(email, password) {
    const user = await findByEmail(email); // get user including hashed password
    if (!user) return null;

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;

    return {
        id: user.id,
        username: user.username,
        email: user.email
    };
}