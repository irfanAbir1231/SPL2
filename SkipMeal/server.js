const express = require('express');
const { Pool } = require('pg');
const cron = require('node-cron');
const webpush = require('web-push');
const path = require('path');

// Configure web push notifications
const publicKey = 'BNdi53FuDWVw_yS3bcEuHCGfexBfA0tkcTV4zk1cKnC0ezdh_D-XdBoLIcoYoFYdMY-SgLMAhGSbs_nAQSiLf5A';
const privateKey = 'uos9goHkxxkPaZHbwsw7_bZGfDjiC5MF8ROQiEJypxs';
webpush.setVapidDetails('mailto:your-email@example.com', publicKey, privateKey);

const app = express();


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to PostgreSQL database
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'HallHaven',
  password: 'irfan',
  port: 5432,
});

// Schedule to send notifications to students
cron.schedule('0 20 * * *', async () => { // At 8:00 PM every day
  try {
    const mealNotifications = await pool.query('SELECT * FROM notification_time');
    mealNotifications.rows.forEach(notification => {
      sendNotification(notification);
    });
  } catch (err) {
    console.error('Error sending notifications:', err);
  }
});

// app.use(express.static(path.join(__dirname, 'public')));

// Define a route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//

async function sendNotification(notification) {
  // Send notification to each student subscribed
  const payload = JSON.stringify({
    title: 'Meal Reminder',
    body: `Don't forget to have your ${notification.meal} at ${notification.notification_time}`,
  });

  try {
    const subscriptions = await pool.query('SELECT * FROM student_subscriptions');
    subscriptions.rows.forEach(subscription => {
      webpush.sendNotification(subscription, payload).catch(error => {
        console.error('Error sending notification:', error);
      });
    });
  } catch (err) {
    console.error('Error fetching subscriptions:', err);
  }
}

// Middleware to parse JSON bodies
app.use(express.json());

// Handle student subscription to notifications
app.post('/subscribe', async (req, res) => {
  const subscription = req.body;
  try {
    await pool.query('INSERT INTO student_subscriptions (subscription) VALUES ($1)', [subscription]);
    res.status(201).json({ message: 'Subscription added successfully' });
  } catch (err) {
    console.error('Error adding subscription:', err);
    res.status(500).json({ error: 'An error occurred while adding subscription' });
  }
});

// Handle submission of skipped meals and awarding rewards
app.post('/submit-meal-skips', async (req, res) => {
  const { meal, submissionTime, studentId } = req.body;
  let credits;

  // Determine credits based on meal
  switch (meal) {
    case 'breakfast':
      credits = 40;
      break;
    case 'lunch':
      credits = 70;
      break;
    case 'dinner':
      credits = 80;
      break;
    default:
      return res.status(400).json({ error: 'Invalid meal type' });
  }

  // Check if submission is within the allowed time range
  const submissionDate = new Date(submissionTime);
  const notificationDate = new Date(submissionDate);
  notificationDate.setHours(notificationDate.getHours() - 2); // Subtract 2 hours
  const now = new Date();

  if (submissionDate > now || submissionDate < notificationDate) {
    return res.status(400).json({ error: 'Submission not within the allowed time range' });
  }

  // Award credits to the student
  try {
    await pool.query('UPDATE students SET credits = credits + $1 WHERE id = $2', [credits, studentId]);
    res.status(200).json({ message: `You've been awarded ${credits} credits for skipping ${meal}` });
  } catch (err) {
    console.error('Error awarding credits:', err);
    res.status(500).json({ error: 'An error occurred while awarding credits' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to database');
  client.release();
});

// Handle student subscription to notifications
app.post('/set_notification', async (req, res) => {
  const { breakfastStartTime, breakfastEndTime, lunchStartTime, lunchEndTime, dinnerStartTime, dinnerEndTime, notificationTime } = req.body;
  
  console.log('Received notification data:', req.body); // Log received data
  
  
  try {
    // Perform database query to insert data
    const result = await pool.query('INSERT INTO notification_time (breakfast_start_time, breakfast_end_time, lunch_start_time, lunch_end_time, dinner_start_time, dinner_end_time, notification_time) VALUES ($1, $2, $3, $4, $5, $6, $7)', [breakfastStartTime, breakfastEndTime, lunchStartTime, lunchEndTime, dinnerStartTime, dinnerEndTime, notificationTime]);
    
    console.log('Database insert result:', result); // Log database insert result
    
    res.status(201).json({ message: 'Notification data added successfully' });
  } catch (err) {
    console.error('Error adding notification data:', err); // Log error
    res.status(500).json({ error: 'An error occurred while adding notification data' });
  }
});


