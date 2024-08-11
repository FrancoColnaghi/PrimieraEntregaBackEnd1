import { Router } from "express";

const router = Router()

router.get('/products', (req,res)=>{
    res.render('home')
})

router.get('/cart', (req,res)=>{
    res.render('cart')
})

router.get('/realtimeproducts', (req,res)=>{
    res.render('realtimeproducts')
})


export default router