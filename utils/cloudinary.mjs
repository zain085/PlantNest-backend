import { v2 as cloudinary } from "cloudinary"
import { PassThrough } from "node:stream"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadFileOnCloudinary = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        if (!buffer) {
            return resolve(null)
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "image",
                ...options,
            },
            (error, result) => {
                if (error) {
                    console.error(
                        "Cloudinary upload failed:",
                        error.message
                    )
                    return reject(error)
                }

                console.log(
                    `File uploaded to Cloudinary: ${result.secure_url}`
                )

                resolve(result)
            }
        )

        const readableStream = new PassThrough()

        readableStream.end(buffer)
        readableStream.pipe(uploadStream)
    })
}

export default uploadFileOnCloudinary