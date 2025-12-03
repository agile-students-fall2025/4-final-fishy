import jwt from 'jsonwebtoken';
import { createUser, validateUser, validateUserById } from '../data/userStore.js';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '7d'; 

if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined in environment');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRATION }
  );
}

export async function register(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ error: 'Missing fields' });

  const existing = await validateUser(email, password); 
  if (existing) return res.status(409).json({ error: 'Email already in use' });

  const user = await createUser({ username, email, password });

  const token = generateToken(user);

  res.status(201).json({ message: 'User registered', user, token });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Missing credentials' });

  const user = await validateUser(email, password);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const token = generateToken(user);

  res.json({ message: 'Logged in', user, token });
}

export async function me(req, res) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const user = await validateUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json({ user });
}
