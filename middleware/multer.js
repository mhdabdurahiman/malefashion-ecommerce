const multer = require( 'multer' )
const path = require('path')

const allowedFileExtensions = ['.jpg', '.jpeg', '.png']

const storage = multer.diskStorage({
    destination : ( req, file, cb ) => {
        cb( null, path.join( __dirname, '../public/images/product-images' ))
    },
    filename : ( req, file, cb ) => {
        const uniqueName = Date.now() + '-' + file.originalname
        cb( null, uniqueName )
    }
})

const fileFilter = (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedFileExtensions.includes(fileExt)) {
        cb(null, true)
    } else {
        cb(new Error('Only .jpg, .jpeg, and .png files are allowed'));
    }
};


module.exports  = multer({
    storage : storage,
    fileFilter: fileFilter
});