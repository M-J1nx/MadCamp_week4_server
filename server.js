const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3001;

const connection = mysql.createConnection({
    host: '13.124.147.237',
    user: 'MadCampWeek4',
    password: '0000',
    database: 'MadCampWeek4'
});

connection.connect();

app.post('/login', (req, res) => {
    const { user_id } = req.body;
    const queryID = 'SELECT * FROM user WHERE user_id = (?)';

    connection.query(queryID, [user_id], (error, results, fields) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length > 0) {
            return res.json({ message: "already exist user" })
        } else {
            const querySignup = 'INSERT INTO user (user_id) VALUES (?)';
            connection.query(querySignup, [user_id], (error, results, fields) => {
                if (error) {
                return res.status(500).json({ error: 'Internal Server Error' });
                }
                return res.json({ message: 'Assign success' }); 
            });
        };
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});