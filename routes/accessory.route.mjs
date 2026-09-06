import express from "express"
import verifyToken from "../middlewares/auth.middleware.mjs"
import checkRole from "../middlewares/role.middleware.mjs"
import upload from "../middlewares/multer.middleware.mjs"
import { addAccessory, deleteAccessory, getAllAccessories, getAccessoryById, updateAccessory } from "../controllers/accessory.controller.mjs"

const accessoryRouter = express.Router()

accessoryRouter.get(`/`, getAllAccessories)
accessoryRouter.get(`/:id`, getAccessoryById)
accessoryRouter.post(`/`, verifyToken, checkRole("admin"), upload.array("images", 5), addAccessory)
accessoryRouter.put(`/:id`, verifyToken, checkRole("admin"), upload.array("images", 5), updateAccessory)
accessoryRouter.delete(`/:id`, verifyToken, checkRole("admin"), deleteAccessory)

export default accessoryRouter
