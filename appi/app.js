import express from 'express';
const hostname = '127.0.0.1';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});
