import express from 'express'
import producsRoute from './routes/products.router.js'
import cartsRoute from './routes/carts.router.js'
import homeRoute from './routes/home.router.js'
import realTimeProducts from './routes/realtimeproducts.router.js'
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'
import {Server} from 'socket.io'
import ProductsManager from './class/productManager.js'

const app = express()
const productManager = new ProductsManager(__dirname + '/bbdd/products.json');

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))
app.use('/api/products', producsRoute)
app.use('/api/carts', cartsRoute)
app.use('/home', homeRoute)
app.use('/realtimeproducts', realTimeProducts)

// ESCHUCHA
const httpServer = app.listen(8080,()=>{
    console.log("Servidor Iniciado")
})

export const socketServer = new Server(httpServer)

socketServer.on('connection', async (socket)=>{
    console.log(`Nuev.Disp.Conect. ID: ${socket.id}`)
    const productsList = await productManager.getAllProducts()
    socket.emit('home', productsList)
    socket.emit('realtime', productsList)
    socket.on('nuevo-producto', async(producto)=>{
        await productManager.addProduct(producto)
        socket.emit('realtime', productsList)
    })
})
