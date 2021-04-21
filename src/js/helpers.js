import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export const getJSON = async function(url) { // asyncs always fuctions return promises -> handle it with await getJSON()
    try {
        const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]); // returns only one winner promise to handle
        const data = await res.json(); // .json() returns another promise -> ALWATS AWAIT ALL PROMISES
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);

        return data; // promise resolved value -> returned the data for it to be handled

    } catch (err) { throw err; } // throw error to handle it wherever we use the function
}