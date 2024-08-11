import express from 'express'
import producsRoute from './routes/products.router.js'
import cartsRoute from './routes/carts.router.js'
import views from './routes/views.router.js'
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'
import {Server} from 'socket.io'
import mongoose from 'mongoose';
import { ProductModel } from "./models/product.model.js";
import { CartModel } from "./models/cart.model.js";


const app = express()

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// MIDDLEWARES
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'))
app.use('/api/products', producsRoute)
app.use('/api/carts', cartsRoute)
app.use('/', views)

// ESCHUCHA
const httpServer = app.listen(8080,()=>{
    console.log("Servidor Iniciado")
})

export const socketServer = new Server(httpServer)

socketServer.on('connection', async (socket)=>{
    console.log(`Nuev.Disp.Conect. ID: ${socket.id}`)
    const productsList = await ProductModel.find()
    socket.emit('home', productsList)
    socket.emit('realtime', productsList)
    const cid = "66b4b785c2436e2a44eb0554" //carrito estatico de ejemplo
    const newCart = await CartModel.findById(cid).populate('products.product')
    socketServer.emit('cart', newCart)
    socket.on('nuevo-producto', async(producto)=>{
        await ProductModel.create(producto)
        const productsList = await ProductModel.find()
        socket.emit('realtime', productsList)
    })
    socket.on('modificar-producto', async({id,info})=>{
        await ProductModel.findByIdAndUpdate(id, {...info})
        const productsList = await ProductModel.find()
        socket.emit('realtime', productsList)
    })
    socket.on('eliminar-producto', async(id)=>{
        await ProductModel.findByIdAndDelete(id)
        const productsList = await ProductModel.find()
        socket.emit('realtime', productsList)
    })
    socket.on('agregar-a-carrito', async(pid)=>{
        const cid = "66b4b785c2436e2a44eb0554" //carrito estatico de ejemplo
        const cartSelect =  await CartModel.findById(cid);
        const indexProd = cartSelect.products.findIndex(prod => prod.product.toString() === pid);
        if(indexProd === -1){
            cartSelect.products.push({ product: pid, quantity: 1 })
        } else {
            cartSelect.products[indexProd] = { product: cartSelect.products[indexProd].product, quantity: cartSelect.products[indexProd].quantity + 1 }
        }
        const newCart = await CartModel.findByIdAndUpdate(cid,cartSelect,{new: true}).populate('products.product')

        socketServer.emit('cart', newCart)
    })
})

mongoose.connect("mongodb+srv://colnaghifr:h7XUS9x8h8nFSXGf@cluster1.vpvpt8q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1",
    {dbName: 'Tienda'})
    .then(()=>{
        console.log('Conectado a BBDD')
    })