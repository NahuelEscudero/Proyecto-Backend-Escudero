import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isValidCategory = (category) => {
    const validCategories = ["old school", "cool vibes", "basics"];
    return validCategories.includes(category);
};

const storage = multer.diskStorage({
    
    destination: function(req, file, cb){
        const category = req.body.category;
        if (isValidCategory(category)) {
            const uploadPath = path.resolve(__dirname, '../public/images', category);
            cb(null, uploadPath);
        } else {
            cb(new Error('Categoría no válida'));
        }
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

export const uploader = multer({storage});