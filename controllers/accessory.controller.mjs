import asyncHandler from "express-async-handler";
import Accessory from "../models/accessories.model.mjs";
import uploadFileOnCloudinary from "../utils/cloudinary.mjs";

const buildFilterQuery = (query) => {
    const filter = {}
    if (query.category) filter.category = query.category
    if (query.search) filter.name = { $regex: query.search, $options: "i" }
    if (query.availability === "in-stock") filter.stock = { $gt: 0 }
    if (query.availability === "out-of-stock") filter.stock = { $lte: 0 }
    if (query.minPrice || query.maxPrice) {
        filter.price = {}
        if (query.minPrice) filter.price.$gte = Number(query.minPrice)
        if (query.maxPrice) filter.price.$lte = Number(query.maxPrice)
    }
    return filter
}

const buildSort = (sort) => {
    switch (sort) {
        case "price-asc": return { price: 1 }
        case "price-desc": return { price: -1 }
        case "newest": return { createdAt: -1 }
        case "popularity": return { sold: -1 }
        default: return { createdAt: -1 }
    }
}

const getAllAccessories = asyncHandler(async (request, response) => {
    const filter = buildFilterQuery(request.query)
    const sort = buildSort(request.query.sort)
    const accessories = await Accessory.find(filter).populate("category", "category").sort(sort)
    response.status(200).json({ accessories, success: true })
})

const getAccessoryById = asyncHandler(async (request, response) => {
    const accessory = await Accessory.findById(request.params.id).populate("category", "category")
    if (!accessory) {
        return response.status(404).json({ message: "Accessory not found.", success: false })
    }
    response.status(200).json({ accessory, success: true })
})

const addAccessory = asyncHandler(async (request, response) => {
    const { name, price, category, description, discount, stock } = request.body

    if (!name || !price || !category || !description) {
        return response.status(400).json({ message: "Input all fields.", success: false })
    }

    let images = []
    if (request.files && request.files.length > 0) {
        for (const file of request.files) {
            const uploaded = await uploadFileOnCloudinary(file.path)
            if (uploaded?.url) images.push(uploaded.url)
        }
    }

    const newAccessory = await Accessory.create({
        name, price, category, description,
        discount: discount || 0,
        stock: stock || 0,
        images
    })

    response.status(201).json({ message: "New accessory added", success: true, accessory: newAccessory })
})

const updateAccessory = asyncHandler(async (request, response) => {
    const accessory = await Accessory.findById(request.params.id)
    if (!accessory) {
        return response.status(404).json({ message: "Accessory not found.", success: false })
    }

    let images = accessory.images
    if (request.files && request.files.length > 0) {
        images = []
        for (const file of request.files) {
            const uploaded = await uploadFileOnCloudinary(file.path)
            if (uploaded?.url) images.push(uploaded.url)
        }
    }

    const updatedAccessory = await Accessory.findByIdAndUpdate(
        request.params.id,
        { ...request.body, images },
        { new: true }
    )

    response.status(200).json({ message: "Accessory updated successfully", success: true, accessory: updatedAccessory })
})

const deleteAccessory = asyncHandler(async (request, response) => {
    const accessory = await Accessory.findById(request.params.id)
    if (!accessory) {
        return response.status(404).json({ message: "Accessory not found.", success: false })
    }
    await Accessory.findByIdAndDelete(request.params.id)
    response.status(200).json({ message: "Accessory deleted successfully.", success: true })
})

export {
    getAllAccessories,
    getAccessoryById,
    addAccessory,
    updateAccessory,
    deleteAccessory
}
