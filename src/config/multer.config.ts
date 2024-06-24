import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './src/uploads',
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
};
