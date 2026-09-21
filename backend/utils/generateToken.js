import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fittrack_super_secret_jwt_key_2026_xyz', {
    expiresIn: '30d'
  });
};

export default generateToken;
