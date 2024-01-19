function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function postpone(fn, ms, ...args) {
  await timeout(ms);
  let ret = await fn(...args);
  return ret;
}

async function tryRequest(url, body) {
  let tryRes = {};
  try {
    let response = await fetch (
      url, 
      {
        method: 'post',
        body: body,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    let responseJson = await response.json();
    tryRes = {'status': 'OK', 'data': responseJson};
  } catch (err) {
    tryRes = {'status': 'ERROR', 'error': err};
  }
  return tryRes;
}


export async function webappRequest(url, body, retryIntervals) {
  retryIntervals = retryIntervals || [];
  let reqRes = await tryRequest(url, body);
  for (const ri of retryIntervals) {
    if (reqRes.status == 'OK') {
      break;
    } else {
      reqRes = await postpone(tryRequest, ri*1000, url, body);
    }
  }    
  return reqRes;
}
