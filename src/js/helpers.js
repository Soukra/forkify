import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};
// ignore uploadData on getJSON and pass data on sendJSON
export const AJAX = async function(url, uploadData = undefined){

    try {
        const fetchPro = uploadData ? fetch(url, { // if theres uploadData -> set uploadData to sendJSON POST req
            method: 'POST', // method -> POST request
            headers: { // snippets of text -> info of the request
                'Content-type': 'application/json' // telling API the data we sending is json format
            },
            body: JSON.stringify(uploadData) // payload -> data we will send in JSON format
        }) : fetch(url); // if uploadData is undefined -> just GET req data

        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // returns only one winner promise to handle
        const data = await res.json(); // .json() returns another promise -> ALWATS AWAIT ALL PROMISES

        if (!res.ok) throw new Error(`${data.message} (${res.status})`);

        return data; // promise resolved value -> returned the data for it to be handled

    } catch (err) { throw err; } // throw error to handle it wherever we use the function

}