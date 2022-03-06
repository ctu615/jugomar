import bcrypt from "bcryptjs";

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 13),
    isAdmin: true,
  },
  {
    name: 'Will Smith',
    email: 'will@example.com',
    password: bcrypt.hashSync('123456', 13),
  },
  {
    name: 'Jada Smith',
    email: 'jada@example.com',
    password: bcrypt.hashSync('123456', 13),
  },
];

export default users