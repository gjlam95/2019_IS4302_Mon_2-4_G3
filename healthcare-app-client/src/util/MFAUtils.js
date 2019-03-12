export const messageHashLength = 64;
export const signatureLength = 64;
export const writeUid = "00002222";
export const readUid = "00002221";
export const disconUid = "00002223";

export function convertBase64StrToUint8Array(str) {
  var binary_string =  window.atob(str);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++)        {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
}

export function convertUint8ArrayToStr(arr) {
  let base64String = btoa(String.fromCharCode(...arr));
  return base64String;
}


export function getTagSigAndMsg(valueRecArray) {
  let encryptedMsg = new Uint8Array(128);

  for(let i=0; i<messageHashLength+signatureLength; i++) {
     encryptedMsg[i] = valueRecArray[i];
  }
  let encryptedStr = convertUint8ArrayToStr(encryptedMsg);
  return {encryptedString: encryptedStr};
}


export function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}


export function splitByMaxLength(sendMsg, numOfChunks) {
    let chunks = new Array(numOfChunks);
    let i, j, k;
    for (i=0; i<numOfChunks; i++) {
      chunks[i] = new Uint8Array(20);
      for (j=0, k=i*20; j<20 && k<i*20+20; j++, k++) {
          chunks[i][j] = sendMsg[k];
      }
    }
    return chunks;
}

export function dis(disconnectChar) {
    disconnectChar.writeValue(new Uint8Array([1]));
}

export function concatenate(resultConstructor, ...arrays) {
    let totalLength = 0;
    for (let arr of arrays) {
        totalLength += arr.byteLength;
    }
    let result = new resultConstructor(totalLength);
    let offset = 0;
    for (let arr of arrays) {
        result.set(arr, offset);
        offset += arr.byteLength;
    }
    return result;
}
