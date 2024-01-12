import {
    addClient, 
    editClient ,
    deleteClient , 
    getAllClients
} from '../controllers/ClientController.js'
import express from 'express'

const clientRouter = express.Router()

clientRouter.get('/', getAllClients)
clientRouter.post('/', addClient)
clientRouter.patch('/', editClient)
clientRouter.delete('/', deleteClient)

export default clientRouter