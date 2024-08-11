import { Router } from "express";
import { ProductModel } from "../models/product.model.js";
import { __dirname } from '../utils.js'
import { socketServer } from "../index.js";

const router = Router()

router.get('/', async (req,res)=>{
    const { limit = 10, page = 1, sort = '', ...query } = req.query;
    const limitN = parseInt(limit);
    const pageN = parseInt(page);

    const sortManager = {
        'asc': 1,
        'desc': -1
      }
    const productos = await ProductModel.paginate(
        { ...query },
        { 
          limit: limitN,
          page: pageN,
          ...(sort && { sort: { price: sortManager[sort]} }),
          customLabels: { docs: 'Productos' }
        })

    res.status(200).json({mensaje:'Productos Encontrados', payload: productos})
})

router.get('/:pid', async (req,res)=>{
    const id = req.params.pid
    const producto = await ProductModel.findById(id)
    res.status(200).json({mensaje:'Producto Encontrado', payload: producto})
})

router.post('/', async (req,res)=>{
    const newProduct = req.body
    await ProductModel.create(newProduct)
    const productsList = await ProductModel.find()
    socketServer.emit('realtime', productsList)
    res.status(201).json({mensaje:'Producto Agregado', payload: {newProduct}})

})

router.put('/:pid', async (req,res)=>{
    const id = req.params.pid
    const newProduct = req.body
    const updateProduct = await ProductModel.findByIdAndUpdate(id, {...newProduct}, {new:true})
    const productsList = await ProductModel.find()
    socketServer.emit('realtime', productsList)
    res.status(200).json({mensaje:'Producto Modificado', payload: {updateProduct}})
})

router.delete('/:pid', async (req,res)=>{
    const id = req.params.pid
    await ProductModel.findByIdAndDelete(id)
    const productsList = await ProductModel.find()
    socketServer.emit('realtime', productsList)
    res.status(200).json({"mensaje": `Producto eliminado`, payload: {id}})
})

export default router