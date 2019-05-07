import ValidatorClass from '../utils/validator';
import {
  errorFunction,
  readFile,
  generateRandomNumbers,
  getLastFilename,
  renameFiles,
  writeToFile,
  getAllFilenamesInDir
} from '../utils'

const storageName = process.env.NODE_ENV === 'test' ? 'test-storage' : 'storage';

export const generatePhoneNumbers = () => {
  return async (req, res, next) => {
    const enums = ['numberToGenerate'];
    const { isValid, errors } = ValidatorClass.validateFieldsSync(enums, req.body);

    if(!isValid) return next(errors);

    try {
      const size = Number(req.body.numberToGenerate);
      const lastCreatedFilename = getLastFilename(`/../${storageName}`);
      const lastCreatedFilepath = `${__dirname}/../${storageName}/${lastCreatedFilename}`;
      const previousData = lastCreatedFilename ? await readFile(lastCreatedFilepath) : null;
  
      const phoneNumbers = Array.from(generateRandomNumbers(size, previousData));
      const latestFilename = `${new Date().getTime()}.latest.txt`;
      const latestFilePath = `${__dirname}/../${storageName}/${latestFilename}`;

      if (lastCreatedFilename) {
        const newFilepath = `${__dirname}/../${storageName}/${lastCreatedFilename.split('.')[0]}.txt`;
        renameFiles(lastCreatedFilepath, newFilepath);
      }

      writeToFile(latestFilePath, phoneNumbers.join(','));

      return res.status(201).json({
        filename: latestFilename,
        phoneNumbers,
        message: `${size} phonenumbers has been generated successfully!`,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export const getAllGeneratedFileNames = () => {
  return (req, res, next) => {
    
    try {
      const allFilenames = getAllFilenamesInDir(`/../${storageName}`)
      return res.status(200).json({
        allFilenames,
        message: 'All phone numbers retrieved successfully!',
      });
    } catch (error) {
      return next(error);
    }
  }
}

export const getOneFileData = () => {
  return async (req, res, next) => {
    const enums = ['filename'];
    const { isValid, errors } = ValidatorClass.validateFieldsSync(enums, req.body);

    if(!isValid) return next(errors);

    try {
      const filename = req.body.filename;
      const filePath = `${__dirname}/../${storageName}/${filename}`;
      const phoneNumbers = await readFile(filePath, filename);

      return res.status(200).json({
        filename,
        phoneNumbers,
        message: 'Phonenumbers retrieved successfully!',
      });
    } catch (error) {
      return next(error);
    }
  }
}