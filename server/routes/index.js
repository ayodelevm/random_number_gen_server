import express from 'express';
import * as Controllers from '../controllers';

const routers = express.Router();

routers.post('/api/v1/generate', Controllers.generatePhoneNumbers());

routers.get('/api/v1/read/filenames', Controllers.getAllGeneratedFileNames());

routers.post('/api/v1/read/file', Controllers.getOneFileData());

export default routers;
