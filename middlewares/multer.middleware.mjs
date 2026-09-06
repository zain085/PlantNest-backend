import multer from "multer";
import path from "node:path"
import fs from "node:fs"

const dir = "uploads/temp"
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null, dir)
    },
    filename: function (request, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage })

export default upload
