import { Router } from "express";
import CartsManager from "../class/cartsManager.js";
import { __dirname } from '../utils.js'
import { CartModel } from "../models/cart.model.js";


const router = Router()
const cartsManager = new CartsManager(__dirname + '/bbdd/carts.json');

// Buscar Todos Los Carritos Existentes.
router.get('/', async (req,res)=>{
    const cartList = await CartModel.find().populate("products.product")
    res.status(200).json(cartList)
})

// Buscar un carrito por ID
router.get('/:cid', async (req,res)=>{
    const cid = req.params.cid
    const cart = await CartModel.findById(cid).populate("products.product")
    res.status(200).json(cart)
}
)

// Crear un nuevo carrito vacio
router.post('/', async (req,res)=>{
    await CartModel.create({products:[]})
    res.status(201).json({"mensaje": "carrito creado", "payload": {products:[]}})
})

// Agregar un Producto a un Carrito
router.put('/:cid/products/:pid', async (req,res)=>{
    const { cid, pid } = req.params;
    const cartSelect =  await CartModel.findById(cid);
    const indexProd = cartSelect.products.findIndex(prod => prod.product.toString() === pid);
    if(indexProd === -1){
        cartSelect.products.push({ product: pid, quantity: 1 })
    } else {
        cartSelect.products[indexProd] = { product: cartSelect.products[indexProd].product, quantity: cartSelect.products[indexProd].quantity + 1 }

    }
    const cartUpdated = await CartModel.findByIdAndUpdate(cid,cartSelect, {new: true}).populate('products.product')
    res.status(200).json({"mensaje": "Producto agregado al carrito", "payload": {cartUpdated}})
})

// Eliminar un carrito
router.delete('/:cid', async (req, res) => {
    const {cid} = req.params;

    await CartModel.findByIdAndDelete(cid)

    res.status(200).json({ message: 'Carrito Eliminado'})
});

// Eliminar un producto de un carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    const carrito = await CartModel.findById(cid).lean();

    const cartFiltered = {
        ...carrito,
        products:  carrito.products.filter(prod => prod.product.toString() !== pid)
    }

    const cartUpdated = await CartModel.findByIdAndUpdate(cid,cartFiltered, {new: true}).populate('products.product')

    res.status(200).json({ message: 'Producto Eliminado del carrito', cart: cartUpdated})
});

export default router