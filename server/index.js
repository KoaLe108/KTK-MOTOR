//CLI: npm install express body-parser --save
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
//middlewares
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
//apis
app.get('/hello', (req, res) => {
    res.json({ message: 'Hello from the server!' });
});
app.use('/api/admin', require('./api/admin.js'));