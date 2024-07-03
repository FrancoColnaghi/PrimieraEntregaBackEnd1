import express from 'express'
import producsRoute from './routes/products.router.js'
import cartsRoute from './routes/carts.router.js'
import { __dirname } from './utils.js'

const app = express()

// MIDDLEWARES
app.use(express.json()) //para indicar que podemos aceptar .JSON x Body
app.use(express.urlencoded({extended:true}))
app.use('/api/products', producsRoute)
app.use('/api/carts', cartsRoute)

// ESCHUCHA
app.listen(8080,()=>{
    console.log("Servidor Iniciado")
})