#!/usr/bin/env node

const request = require('request-promise-native');
const publicIp = require('public-ip');

// Configure these
const apiToken = '0000000000000000000000000abcdefghijklmnopqrstuvwxyz';
const domain = 'mydomain.com';
const recordId = '00000000';
const requestStandardInterval = 10000;
const requestErroredInterval = 30000;

let mappedIP;
let currentIP;
let lastQueryError;
let lastUpdateError;
let queryErrorCount = 0;
let updateErrorCount = 0;

function run() {
  if (mappedIP === currentIP) {
    request({
        method: 'GET',
        uri: `https://api.digitalocean.com/v2/domains/${domain}/records/${recordId}`,
        headers: {
          'Authorization': `Bearer ${apiToken}`
        },
        json: true
    })
    .then(parsedBody => {
      mappedIP = parsedBody.domain_record.data;
      return publicIp.v4();
    })
    .then(ip => {
      currentIP = ip;
    })
    .then(() => {
      lastQueryError = undefined;
      // Continue infinite loop
      setTimeout(run, requestStandardInterval);
    })
    .catch(error => {
      if (lastQueryError !== error.message) {
        lastQueryError = error.message;
        console.error(`Query Error ${queryErrorCount++}:`, error);
      }
      // Continue infinite loop
      setTimeout(run, requestErroredInterval);
    });
  }

  else {
    console.log('Record:', mappedIP, '|', 'Current:', currentIP);
    console.log('Updating DigitalOcean...');
    request({
      method: 'PUT',
      uri: `https://api.digitalocean.com/v2/domains/${domain}/records/${recordId}`,
      headers: {
        'Authorization': `Bearer ${apiToken}`
      },
      body: {
        data: currentIP
      },
      json: true
    })
    .then(() => {
      console.log('Updated DigitalOcean record from', mappedIP, 'to', currentIP);
      mappedIP = currentIP;
      lastUpdateError = undefined;
      // Continue infinite loop
      setTimeout(run, requestStandardInterval);
    })
    .catch(error => {
      mappedIP = undefined;
      currentIP = undefined;
      if (lastUpdateError !== error.message) {
        lastUpdateError = error.message;
        console.error(`Update Error ${updateErrorCount++}:`, error);
      }
      // Continue infinite loop
      setTimeout(run, requestErroredInterval);
    });
  }
}

// Begin the infinite loop
run();
