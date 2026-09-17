require('dotenv').config();

const express = require('express');
const cors = require('cors');
const {Pool} = require('pg');

const app = express();
const port = Number(process.env.PORT) || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.json({ 
        status: 'success',
        service: 'API',
        endpoints: ['/api/health', '/api/users', '/api/db-check'], 
    });
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'success',
        message: 'API is healthy',
    });
});

app.get('/api/db-check', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() AS current_time');
        res.json({ 
            status: 'success',
            message: 'Database is accessible',
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error',
            message: 'Database is not accessible',
        });
    }
});


app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nombre, correo, edad FROM usuarios');
        res.json({result: result.rows});

    } catch (error) {
        res.status(500).json({ 
            error: 'Internal server error', });
    }     
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = app;