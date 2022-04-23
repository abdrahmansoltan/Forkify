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

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

/*
// function that do the fetching + convert data to json
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);

    // to prevent fetching from taking forever
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();  // get the body of the response in "json-format"

    // in case of error, return the error-message from the server
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // here we throw error so that the error is handled in the (loadRecipe function in "model.js")
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    // POST Request
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
*/
