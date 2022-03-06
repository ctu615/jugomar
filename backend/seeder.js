import mongoose from "mongoose";
import chalk from "chalk";
import dotenv from "dotenv";
import products from "./data/products.js";
import users from "./data/users.js";
import Product from "./models/productModel.js";
import User from "./models/userModel.js";
import Order from "./models/orderModel.js";
import connectMongoDB from './config/db.js';

dotenv.config()

connectMongoDB()

const importData = async () =>{
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    const createdUsers = await User.insertMany(users)

    const adminUser = createdUsers[0]._id

    const sampleProducts = products.map(product => {
      return {...product, user: adminUser}

    })
    await Product.insertMany(sampleProducts)
    console.log(chalk.cyan.bold('Data Imported!'))
    process.exit()
  } catch (error) {
    console.error(chalk.red.bold(`${error}`));process.exit(1);
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    
    console.log(chalk.magenta.bold('Data Destroyed!'));
    process.exit();
  } catch (error) {
    console.error(chalk.red.bold(`${error}`));
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}