const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const { mongoUri } = require('../Conf/Database');

const User = require("../Models/User");
const Course = require("../Models/Course");
const Schedule = require("../Models/Schedule");
const Center = require('../Models/Center');
const Enrollment = require('../Models/Enrollment');
const Notification = require('../Models/Notification');
const Order = require('../Models/Order');
const Progress = require('../Models/Progress');
const Cart = require('../Models/Cart');
const Product = require('../Models/Product');
const Payment = require("../Models/Payment");
const VideoCourse = require("../Models/VideoCourse");

const { users } = require("./users");
const { courses } = require("./course");
const { centers } = require("./center");
const { schedules } = require("./schedule");
const { carts } = require("./cart");
const { payments } = require("./payment");
const { progresses } = require("./progress");
const { enrollments } = require("./enrollment");
const { notifications } = require("./notification");
const { orders } = require("./order");
const { products } = require("./product");
const { videoCourses } = require("./video_cours");

mongoose.connect(mongoUri || "mongodb://localhost:27017/zikema", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Connexion à la base réussie.");
  seedData();
})
.catch((err) => {
  console.error("❌ Erreur de connexion à la base :", err);
  process.exit(1);
});

const seedData = async () => {
  try {
    await User.deleteMany({});
    console.log("✅ Users table cleared successfully");
    await Course.deleteMany({});
    console.log("✅ Courses table cleared successfully");
    await Schedule.deleteMany({});
    console.log("✅ Schedules table cleared successfully");
    await Payment.deleteMany({});
    console.log("✅ Payments table cleared successfully");
    await VideoCourse.deleteMany({});
    console.log("✅ VideoCourses table cleared successfully");
    await Center.deleteMany({});
    console.log("✅ Centers table cleared successfully");
    await Enrollment.deleteMany({});
    console.log("✅ Enrollments table cleared successfully");
    await Notification.deleteMany({});
    console.log("✅ Notifications table cleared successfully");
    await Order.deleteMany({});
    console.log("✅ Orders table cleared successfully");
    await Product.deleteMany({});
    console.log("✅ Products table cleared successfully");
    await Progress.deleteMany({});
    console.log("✅ Progresses table cleared successfully");
    await Cart.deleteMany({});
    console.log("✅ Carts table cleared successfully");

    // Hacher les mots de passe des utilisateurs
    const hashedUsers = await Promise.all(users.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt); // Hachage du mot de passe à douze index
      return { ...user, password: hashedPassword }; // Remplacer le mot de passe par le haché
    }));

    // Insert data
    const insertedUser = await User.insertMany(hashedUsers);
    // const insertedUser = await User.insertMany(users);
    console.log(`✅ ${insertedUser.length} Users seeded successfully`);
    const insertedCourse = await Course.insertMany(courses);
    console.log(`✅ ${insertedCourse.length} Courses seeded successfully`);
    const insertedSchedule = await Schedule.insertMany(schedules);
    console.log(`✅ ${insertedSchedule.length} Schedules seeded successfully`);
    const insertedPayment = await Payment.insertMany(payments);
    console.log(`✅ ${insertedPayment.length} Payments seeded successfully`);
    const insertedVideoCourse = await VideoCourse.insertMany(videoCourses);
    console.log(`✅ ${insertedVideoCourse.length} VideoCourses seeded successfully`);
    const insertedCenter = await Center.insertMany(centers);
    console.log(`✅ ${insertedCenter.length} Centers seeded successfully`);
    const insertedEnrollment = await Enrollment.insertMany(enrollments);
    console.log(`✅ ${insertedEnrollment.length} Enrollments seeded successfully`);
    const insertedNotification = await Notification.insertMany(notifications);
    console.log(`✅ ${insertedNotification.length} Notifications seeded successfully`);
    const insertedOrder = await Order.insertMany(orders);
    console.log(`✅ ${insertedOrder.length} Orders seeded successfully`);
    const insertedProduct = await Product.insertMany(products);
    console.log(`✅ ${insertedProduct.length} Products seeded successfully`);
    const insertedProgress = await Progress.insertMany(progresses);
    console.log(`✅ ${insertedProgress.length} Progresses seeded successfully`);
    const insertedCart = await Cart.insertMany(carts);
    console.log(`✅ ${insertedCart.length} Carts seeded successfully`);

    console.log("✅ All seeders executed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
};

// Pour exécuter ce script avec succes entrer node Seeds/index.js dans le terminal