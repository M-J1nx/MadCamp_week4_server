const express = require('express');
const mysql = require('mysql');
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3001;

const connection = mysql.createConnection({
    host: '15.164.214.108',
    user: 'MadCampWeek4',
    password: 'tj11021223',
    database: 'madcampweek4'
});

connection.connect();

app.post('/searchRanking', (req, res) => {
    const { userId, userScore, scoreDate } = req.body;
    const queryID = 'SELECT * FROM user WHERE user_id = (?)';

    connection.query(queryID, [userId], (error, results, fields) => {
        const querySelectTop10 = 'SELECT * FROM user ORDER BY user_score DESC LIMIT 10';
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        } else {
            const queryAddScore = 'INSERT INTO user (user_id, user_score, score_date) VALUES (?, ?, ?)';
            connection.query(queryAddScore, [userId, userScore, scoreDate], (error, results, fields) => {
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