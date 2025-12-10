// Helper to generate test JWT tokens for Mocha tests
import jwt from 'jsonwebtoken';

const TEST_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-mocha-tests';

export function getTestToken(user = { id: 'test-user-id', email: 'test@example.com' }) {
  return jwt.sign(user, TEST_SECRET);
}

export function getAuthHeader(user) {
  return `Bearer ${getTestToken(user)}`;
}

