import jwt from 'jsonwebtoken';
import { createUser, findByEmail, validateUser } from '../data/userStore.js';

const JWT_SECRET = process.env.JWT_SECRET;

function makeToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

export async function register(req, res) {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
        return res.status(400).json({ error: 'Missing fields' });

    const existing = await findByEmail(email);
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const user = await createUser({ username, email, password });
    const token = makeToken(user);
    res.status(201).json({ user, token });
}

export async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: 'Missing credentials' });

    const user = await validateUser(email, password);
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const token = makeToken(user);
    res.json({ user, token });
}

export async function me(req, res) {
    res.json({ user: req.user });
}