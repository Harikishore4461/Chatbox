const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./messages')
const port = 4200
var bodyParser = require('body-parser');
app.use(cors())

app.use(bodyParser.json({ extended: false }));
app.use('/', router)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))