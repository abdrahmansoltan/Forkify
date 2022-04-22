import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

// to make a time-limit so that fetching doesn't go forever
const timeout = function (s) {
  // returning a promise that will be rejected after "s" seconds
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    // to prevent fetching from taking forever
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);

    console.log(res);
    const data = await res.json(); // get the body of the response in "json-format"

    // in case of error retern the error-message from the server
    if (!res.ok) throw new Error(`${data.message} (${data.status})`);

    return data;
  } catch (error) {
    throw error;
  }
};
