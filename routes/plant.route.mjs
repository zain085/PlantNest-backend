import express from "express"
import verifyToken from "../middlewares/auth.middleware.mjs"
import checkRole from "../middlewares/role.middleware.mjs"
import upload from "../middlewares/multer.middleware.mjs"
import { addPlant, deletePlant, getAllPlants, getPlantById, updatePlant } from "../controllers/plant.controller.mjs"

const plantRouter = express.Router()

plantRouter.get(`/`, getAllPlants)
plantRouter.get(`/:id`, getPlantById)
plantRouter.post(`/`, verifyToken, checkRole("admin"), upload.array("images", 5), addPlant)
plantRouter.put(`/:id`, verifyToken, checkRole("admin"), upload.array("images", 5), updatePlant)
plantRouter.delete(`/:id`, verifyToken, checkRole("admin"), deletePlant)

export default plantRouter
