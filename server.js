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

app.post('/result', (req, res) => {
    const { userId, userScore, scoreDate } = req.body;
    const queryID = 'SELECT * FROM user WHERE user_id = (?)';

    connection.query(queryID, [userId], (error, results, fields) => {
        const querySelectTop10 = 'SELECT * FROM user ORDER BY user_score DESC LIMIT 10';
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length > 0) {
            const querySignup = 'UPDATE user SET user_score = ?, score_date = ? WHERE user_id = ?';
            connection.query(querySignup, [userScore, scoreDate, userId], (error, results, fields) => {
                if (error) {
                return res.status(500).json({ error: 'Internal Server Error' });
                }
                connection.query(querySelectTop10, (error, selectResults, fields) => {
                    if (error) {
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    return res.json({ data : selectResults }); 
                })
            });
        } else {
            const querySignup = 'INSERT INTO user (user_id, user_score, score_date) VALUES (?, ?, ?)';
            connection.query(querySignup, [userId, userScore, scoreDate], (error, results, fields) => {
                if (error) {
                return res.status(500).json({ error: 'Internal Server Error' });
                }
                connection.query(querySelectTop10, (error, selectResults, fields) => {
                    if (error) {
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    return res.json({ data : selectResults }); 
                })
            });
        };
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});