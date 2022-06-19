// import { copyFile } from 'fs';
// import * as qdat from './qtools/qdat.js';

const fs = require('fs')
const qdat = require('./qtools/qdat.js')

console.log('backing up .env file...');

const targetFilename = '/home/user/Dokumente/StreamCollection/backups/' + qdat.timeStampifyFileName('.env');


fs.copyFile('.env', targetFilename, (err) => {
	if (err)
		throw err;
	console.log('finished');
});