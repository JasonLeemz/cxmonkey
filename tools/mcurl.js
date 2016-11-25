/**
 * Created by jason on 2016/11/23.
 */
let https = require('https'),
    util = require('util'),
    readChunk = require('read-chunk'),
    fileType = require('file-type')

let mcurl = {
    getContent: function (url) {
        // return new pending promise
        return new Promise((resolve, reject) => {
            // select http or https module, depending on reqested url
            const lib = url.startsWith('https') ? require('https') : require('http');
            const request = lib.get(url, (response) => {
                // handle http errors
                if (response.statusCode < 200 || response.statusCode > 299) {
                    reject(new Error('Failed to load page, status code: ' + response.statusCode));
                }
                // temporary data holder
                const body = [];
                // on every content chunk, push it to the data array
                response.on('data', (chunk) => body.push(chunk));
                // we are done, resolve promise with those joined chunks
                response.on('end', () => resolve(body.join('')));
            });
            // handle connection errors of the request
            request.on('error', (err) => reject(err))
        })
    },
    getImage: function (url) {
        // return new pending promise
        return new Promise((resolve, reject) => {
            // select http or https module, depending on reqested url
            const lib = url.startsWith('https') ? require('https') : require('http');
            const request = lib.get(url, (response) => {
                response.setEncoding('binary');//二进制（binary）
                // handle http errors
                if (response.statusCode < 200 || response.statusCode > 299) {
                    reject(new Error('Failed to load page, status code: ' + response.statusCode));
                }
                // temporary data holder
                const body = [];
                // response.once('data', (chunk) => {
                //     response.destroy();
                //     console.log("fileType(chunk)");
                //     console.log(fileType(chunk));
                //     //=> {ext: 'gif', mime: 'image/gif'}
                // });
                // on every content chunk, push it to the data array
                response.on('data', (chunk) => {
                    body.push(chunk);
                });
                // we are done, resolve promise with those joined chunks
                response.on('end', () => {
                    resolve(body.join(''));
                });
            });
            // handle connection errors of the request
            request.on('error', (err) => reject(err))
        })
    },
};

module.exports = mcurl;