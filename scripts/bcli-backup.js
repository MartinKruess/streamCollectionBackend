import { copyFile } from 'fs';
import * as qdat from './qtools/qdat.js';

console.log('backing up .env file...');

const targetFilename = 'D:\\general-backup\\' + qdat.timeStampifyFileName('.env');


copyFile('.env', targetFilename, (err) => {
	if (err)
		throw err;
	console.log('finished');
});