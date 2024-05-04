const express = require('express');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'HallHaven',
  password: 'irfan',
  port: 5432,
});

const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/meal_times', async (req, res) => {
  try {
    // const result = await pool.query('SELECT meal_name, start_time, end_time FROM meal_times');
    // const mealTimes = result.rows;

    // const notifications = mealTimes.map(mealTime => {
    //   const now = new Date();
      // const mealStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), mealTime.start_time.getHours(), mealTime.start_time.getMinutes(), 0);
      // const mealStart = new Date(result.rows[0].start_time);
      // const notificationTime = new Date(mealStart.getTime() - 2 * 60 * 60 * 1000); // 2 hours before meal

      // return {
      //   meal: mealTime.meal,
      //   notificationTime,
      // };
    // console.log(mealTime.meal_name);
    // console.log(mealTime.start_time);
    // console.log(mealTime.end_time);
    

    const result= await pool.query('SELECT * FROM notification_time');
    const notifications= result.rows;
    
    // return {
    //     meal: mealTime.meal_name,
    //     mealStart,
    //     notificationTime
    // };
    // });

    console.log(notifications);

    return notifications;

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching meal times' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});