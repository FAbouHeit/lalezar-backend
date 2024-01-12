import { addOrder } from '../controllers/OrderController.js'
import express from 'express'

const orderRouter = express.Router()

orderRouter.post('/', addOrder)
// orderRouter.post('/', addClient)
// orderRouter.patch('/', editClient)
// orderRouter.delete('/', deleteClient)

export default orderRouter