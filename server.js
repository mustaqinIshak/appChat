const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const port = 3000
const mongoose = require('mongoose')


const message = new mongoose.Schema({
    name: String,
    message: String
})
const model = mongoose.model('Message', message)

app.use(express.static(__dirname))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/messages', async(req, res) => {
    try {
        const allMessage = await model.find()
        res.send(allMessage)
    } catch (error) {
        res.sendStatus(500)
    }
})

app.post('/messages', async(req, res) => {
   try {
        const message = await model.create(req.body)
        const saveMessage = await message.save()
        console.log("save")
        const censored = await model.findOne({message: 'fuck'})
        if(censored){ 
            await model.remove({_id: censored.id})
            io.emit('message', {name: 'admin',  message:'badwords'})
        } else {
            io.emit('message', req.body)
            res.sendStatus(200)   
        }
   } catch (error) {
        res.sendStatus(500)
   }
    
})

io.on('connection', (socket)=> {
    console.log('user connected')
})

mongoose.connect('mongodb+srv://takin:takin230793@cluster0.pf2iw.mongodb.net/<dbname>?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('database connect')
})
.catch(err => {
    console.error(err)
})
var server = http.listen(port, () => {
    console.log('app listen at', server.address().port)
})