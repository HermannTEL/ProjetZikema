// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: [
      'new_message', 
      'course_reminder', 
      'payment_received', 
      'course_cancelled', 
      'course_rescheduled',
      'new_progress',
      'new_review',
      'admin_notice',
      'cart',
      'new_comment',
      'center',
      'enrollment',
    ]
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedTo: { // L'élément concerné par la notification
    model: { type: String, enum: ['Course', 'Schedule', 'Payment', 'User', 'VideoCourse'] },
    id: { type: mongoose.Schema.Types.ObjectId }
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);