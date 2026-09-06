import asyncHandler from "express-async-handler"
import Plant from "../models/plant.model.mjs"
import uploadFileOnCloudinary from "../utils/cloudinary.mjs"

const buildFilterQuery = (query) => {
    const filter = {}

    if (query.category) filter.category = query.category
    if (query.search) {
        filter.name = { $regex: query.search, $options: "i" }
    }

    if (query.availability === "in-stock") {
        filter.stock = { $gt: 0 }
    }

    if (query.availability === "out-of-stock") {
        filter.stock = { $lte: 0 }
    }

    if (query.minPrice || query.maxPrice) {
        filter.price = {}

        if (query.minPrice) {
            filter.price.$gte = Number(query.minPrice)
        }

        if (query.maxPrice) {
            filter.price.$lte = Number(query.maxPrice)
        }
    }

    if (query.careLevel) {
        filter.careLevel = query.careLevel
    }

    return filter
}

const buildSort = (sort) => {
    switch (sort) {
        case "price-asc":
            return { price: 1 }
        case "price-desc":
            return { price: -1 }
        case "newest":
            return { createdAt: -1 }
        case "popularity":
            return { sold: -1 }
        default:
            return { createdAt: -1 }
    }
}

const getAllPlants = asyncHandler(async (request, response) => {
    const filter = buildFilterQuery(request.query)
    const sort = buildSort(request.query.sort)

    const plants = await Plant.find(filter)
        .populate("category", "category")
        .sort(sort)

    return response.status(200).json({
        plants,
        success: true,
    })
})

const getPlantById = asyncHandler(async (request, response) => {
    const plant = await Plant.findById(request.params.id)
        .populate("category", "category")

    if (!plant) {
        return response.status(404).json({
            message: "Plant not found.",
            success: false,
        })
    }

    response.status(200).json({
        plant,
        success: true,
    })
})

const addPlant = asyncHandler(async (request, response) => {
    const {
        name,
        price,
        category,
        description,
        discount,
        stock,
        careLevel,
        wateringSchedule,
        sunlight,
        temperature,
        species,
    } = request.body

    if (!name || !price || !category) {
        return response.status(400).json({
            message: "Input all fields.",
            success: false,
        })
    }

    const images = []

    if (request.files && request.files.length > 0) {
        for (const file of request.files) {
            const uploaded = await uploadFileOnCloudinary(file.buffer)

            if (uploaded?.secure_url) {
                images.push(uploaded.secure_url)
            }
        }
    }

    const newPlant = await Plant.create({
        name,
        price,
        category,
        description,
        species,
        discount: discount || 0,
        stock: stock || 0,
        careLevel,
        wateringSchedule,
        sunlight,
        temperature,
        images,
    })

    response.status(201).json({
        message: "New plant added",
        success: true,
        plant: newPlant,
    })
})

const updatePlant = asyncHandler(async (request, response) => {
    const plant = await Plant.findById(request.params.id)

    if (!plant) {
        return response.status(404).json({
            message: "Plant not found.",
            success: false,
        })
    }

    let images = plant.images

    if (request.files && request.files.length > 0) {
        images = []

        for (const file of request.files) {
            const uploaded = await uploadFileOnCloudinary(file.buffer)

            if (uploaded?.secure_url) {
                images.push(uploaded.secure_url)
            }
        }
    }

    const updatedPlant = await Plant.findByIdAndUpdate(
        request.params.id,
        {
            ...request.body,
            images,
        },
        {
            new: true,
        }
    )

    response.status(200).json({
        message: "Plant updated successfully",
        success: true,
        plant: updatedPlant,
    })
})

const deletePlant = asyncHandler(async (request, response) => {
    const plant = await Plant.findById(request.params.id)

    if (!plant) {
        return response.status(404).json({
            message: "Plant not found.",
            success: false,
        })
    }

    await Plant.findByIdAndDelete(request.params.id)

    response.status(200).json({
        message: "Plant deleted successfully.",
        success: true,
    })
})

export {
    getAllPlants,
    getPlantById,
    addPlant,
    deletePlant,
    updatePlant,
}