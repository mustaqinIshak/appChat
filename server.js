const express = require('express')
const app = express()
const port = 3000

app.use(express.static(__dirname))
var server = app.listen(port, () => {
    console.log('app listen at', server.address().port)
})