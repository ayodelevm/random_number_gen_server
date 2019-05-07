import fs from 'fs';

export const errorFunction = (message, code) => {
  const error = new Error();
  error.code = code;
  error.message = message;
  return error;
};

export const generateRandomNumbers = (size, lastGeneratedNumbers) => {
  const generatedNumbers = new Set();
  
  while (generatedNumbers.size < size) {
    const randomDigits = '0' + (Math.random() * Date.now()).toString().split('.')[0].slice(-9);
    if (lastGeneratedNumbers && !lastGeneratedNumbers.has(randomDigits)) {
      generatedNumbers.add(randomDigits);
    } else {
      generatedNumbers.add(randomDigits);
    }
  }
  return generatedNumbers;
}

export const readFile = (pathTofile, filename = null) => {
  return new Promise((resolve, reject) => fs.readFile(pathTofile, 'utf-8', (error, data) => {
    if (error && error.message.indexOf('no such file or directory') !== -1) {
      return reject(errorFunction(`File with name ${filename} was not found!`, 404));
    }
    if (error) return reject(errorFunction(error, 500));
    const uniqueData = new Set(data.split(','));
    return resolve(uniqueData);
  }))
}

export const renameFiles = (oldFilePath, newFilePath) => {
  return fs.rename(oldFilePath, newFilePath, (err) => {
    if (err) throw errorFunction(err, 500);
  })
}

export const writeToFile = (filePath, generatedNumbers) => {
  return fs.writeFile(filePath, generatedNumbers, (error) => {
    if (error) {
      throw errorFunction(error, 500);
    }
    return true;
  });
}

export const getAllFilenamesInDir = (dirname) => fs.readdirSync(__dirname + dirname);

export const getLastFilename = (dirname) => getAllFilenamesInDir(dirname).filter(fn => fn.endsWith('latest.txt') )[0]