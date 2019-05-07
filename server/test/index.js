import 'babel-polyfill';
import supertest from 'supertest';
import should from 'should';
import app from '../app';

const server = supertest.agent(app);

let latestFilename;

describe('Random Number Generator', () => {
  it('allows generation of new unique phone numbers', (done) => {
    server
      .post('/api/v1/generate')
      .send({ numberToGenerate: 200})
      .end((err, res) => {
        res.status.should.equal(201);
        res.body.message.should.equal('200 phonenumbers has been generated successfully!');
        res.body.phoneNumbers.length.should.equal(200);
        done();
      });
  });

  it('allows generation of another set of new unique phone numbers ', (done) => {
    server
      .post('/api/v1/generate')
      .send({ numberToGenerate: 200})
      .end((err, res) => {
        // console.log({ body: res.body })
        latestFilename = res.body.filename;
        res.status.should.equal(201);
        res.body.message.should.equal('200 phonenumbers has been generated successfully!');
        res.body.phoneNumbers.length.should.equal(200);
        done();
      });
  });

  it('prevents sending empty details when generating phone numbers', (done) => {
    server
      .post('/api/v1/generate')
      .send({ numberToGenerate: ''})
      .end((err, res) => {
        res.status.should.equal(422);
        res.body.errors.numberToGenerate.should.equal('This field is required');
        done();
      });
  });

  it('prevents generating more than 10000 phone numbers', (done) => {
    server
      .post('/api/v1/generate')
      .send({ numberToGenerate: '10001'})
      .end((err, res) => {
        res.status.should.equal(422);
        res.body.errors.numberToGenerate.should.equal('Number of phone numbers to be generated cannot be more than 10000');
        done();
      });
  });

  it('allows the retrieval of the names of generated files', (done) => {
    server
      .get('/api/v1/read/filenames')
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.message.should.equal('All phone numbers retrieved successfully!');
        res.body.allFilenames.length.should.equal(2);
        done();
      });
  });

  it('allows retrieving previously generated phone numbers', (done) => {
    server
      .post('/api/v1/read/file')
      .send({ filename: latestFilename})
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.message.should.equal('Phonenumbers retrieved successfully!');
        res.body.phoneNumbers.length.should.equal(200);
        done();
      });
  });

  it('prevents sending empty details reading generated file', (done) => {
    server
      .post('/api/v1/read/file')
      .send({ filename: ''})
      .end((err, res) => {
        res.status.should.equal(422);
        res.body.errors.filename.should.equal('This field is required');
        done();
      });
  });

  it('ensures that filename must be a .txt file', (done) => {
    server
      .post('/api/v1/read/file')
      .send({ filename: '1000153354.jpg'})
      .end((err, res) => {
        res.status.should.equal(422);
        res.body.errors.filename.should.equal('Filename must end with .txt');
        done();
      });
  });

  it('prevents reading a file that doesn\'t exist in the storage directory' , (done) => {
    server
      .post('/api/v1/read/file')
      .send({ filename: '1000153354.txt'})
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.error.should.equal('File with name 1000153354.txt was not found!');
        done();
      });
  });
});

