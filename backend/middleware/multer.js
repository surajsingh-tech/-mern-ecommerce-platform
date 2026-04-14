import multer from 'multer';
const storage = multer.memoryStorage();

//Single upload 
export const singleUpload = multer({storage}).single('file')

//Multiple uploads upto 5 images 
export const multiUpload = multer({storage}).array('files',5)
