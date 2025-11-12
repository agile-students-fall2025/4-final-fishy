import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const USER_FILE = process.env.USER_FILE;
let users = [];

async function load() {
    if (!USER_FILE) return;
    try {
        const p = path.resolve(USER_FILE);
        const txt = await fs.readFile(p, 'utf-8');
        users = JSON.parse(txt || '[]');
    } catch (e) {
        if (e.code === 'ENOENT') await save();
        else console.warn('userStore load error:', e.message);
    }
}

async function save(data = users) {
    if (!USER_FILE) return;
    const p = path.resolve(USER_FILE);
    await fs.mkdir(path.dirname(p), { recursive: true });
    await fs.writeFile(p, JSON.stringify(data, null, 2));
}

await load();

export async function createUser({ username, email, password }) {
    const id = `user_${crypto.randomUUID()}`;
    const hashed = await bcrypt.hash(password, 10);
    const user = { id, username, email, password: hashed, createdAt: Date.now() };
    users.push(user);
    await save();
    return { id, username, email };
}

export async function findByEmail(email) {
    return users.find((u) => u.email === email) || null;
}

export async function validateUser(email, password) {
    const user = await findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password);
    return match ? { id: user.id, username: user.username, email: user.email } : null;
}