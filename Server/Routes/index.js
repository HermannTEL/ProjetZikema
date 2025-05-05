const express = require('express');
const redirect = express.Router();

const authRoute = require('./auth.routes');
const courseRoute = require('./course.routes');
const centerRoute = require('./center.routes');
const enrollmentRoute = require('./enrollment.routes');
const paymentRoute = require('./payment.routes');
const progressRoute = require('./progress.routes');
const scheduleRoute = require('./schedule.routes');
const userRoute = require('./user.routes');
const videoCourseRoute = require('./videoCourse.routes');
const productRoute = require('./product.routes');
const orderRoute = require('./order.routes');
const cartRoute = require('./cart.routes');
const notifRoute = require("./notification.routes");


redirect.use("/auth", authRoute);
redirect.use("/courses", courseRoute);
redirect.use("/centers", centerRoute);
redirect.use("/enrollments", enrollmentRoute)
redirect.use("/payments", paymentRoute);
redirect.use("/progress", progressRoute);
redirect.use("/schedules", scheduleRoute);
redirect.use("/users", userRoute);
redirect.use("/videoCourses", videoCourseRoute);
redirect.use("/products", productRoute);
redirect.use("/orders", orderRoute);
redirect.use("/cart", cartRoute);
redirect.use("/notifications", notifRoute);


module.exports = redirect;
