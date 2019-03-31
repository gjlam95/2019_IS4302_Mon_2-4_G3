import { API, AUTH_TOKEN } from "../constants";

const request = options => {
  const headers = new Headers({
    "Content-Type": "application/json"
  });

  if (localStorage.getItem(AUTH_TOKEN)) {
    headers.append("x-auth-token", localStorage.getItem(AUTH_TOKEN));
  }

  const defaults = { headers: headers };
  const cred = { credentials: "include" };
  options = Object.assign({}, defaults, options, cred);

  return fetch(options.url, options).then(response =>
    response.json().then(json => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

const requestLogs = options => {
  const headers = new Headers({
    "Content-Type": "text/plain"
  });

  if (localStorage.getItem(AUTH_TOKEN)) {
    headers.append("SessionId", localStorage.getItem(AUTH_TOKEN));
  }

  const defaults = { headers: headers };
  const cred = { credentials: "include" };
  options = Object.assign({}, defaults, options, cred);

  return fetch(options.url, options).then(response =>
    response.arrayBuffer().then(buffer => {
      var txtStr = arrayBufferToBase64(buffer);

      return txtStr;
    })
  );
};

const create = options => {
  const headers = new Headers({});

  if (localStorage.getItem(AUTH_TOKEN)) {
    headers.append("SessionId", localStorage.getItem(AUTH_TOKEN));
  }

  const defaults = { headers: headers };
  const cred = { credentials: "include" };
  options = Object.assign({}, defaults, options, cred);

  return fetch(options.url, options).then(response =>
    response.json().then(json => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

const requestFile = options => {
  const headers = new Headers({
    "Content-Type": "text/plain"
  });

  if (localStorage.getItem(AUTH_TOKEN)) {
    headers.append("SessionId", localStorage.getItem(AUTH_TOKEN));
  }

  const defaults = { headers: headers };
  const cred = { credentials: "include" };
  options = Object.assign({}, defaults, options, cred);

  return fetch(options.url, options).then(response =>
    response.arrayBuffer().then(buffer => {
      var txtStr = arrayBufferToBase64(buffer);

      return txtStr;
    })
  );
};

const requestImg = options => {
  const headers = new Headers({
    "Content-Type": "image"
  });

  if (localStorage.getItem(AUTH_TOKEN)) {
    headers.append("SessionId", localStorage.getItem(AUTH_TOKEN));
  }

  const defaults = { headers: headers };
  const cred = { credentials: "include" };
  options = Object.assign({}, defaults, options, cred);

  return fetch(options.url, options).then(response =>
    response.arrayBuffer().then(buffer => {
      var base64Flag = "data:image;base64,";
      var imageStr = arrayBufferToBase64(buffer);

      return base64Flag + imageStr;
    })
  );
};

const requestVideo = options => {
  const headers = new Headers({
    "Content-Type": "video/mp4"
  });

  if (localStorage.getItem(AUTH_TOKEN)) {
    headers.append("SessionId", localStorage.getItem(AUTH_TOKEN));
  }

  const defaults = { headers: headers };
  const cred = { credentials: "include" };
  options = Object.assign({}, defaults, options, cred);

  return fetch(options.url, options).then(response =>
    response.arrayBuffer().then(buffer => {
      var videoStr = buffer;

      return videoStr;
    })
  );
};

const sendFile = options => {
  const headers = new Headers({
    enctype: "multipart/form-data"
  });

  if (localStorage.getItem(AUTH_TOKEN)) {
    headers.append("SessionId", localStorage.getItem(AUTH_TOKEN));
  }

  const defaults = { headers: headers };
  const cred = { credentials: "include" };
  options = Object.assign({}, defaults, options, cred);

  return fetch(options.url, options).then(response =>
    response.json().then(json => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

function arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = [].slice.call(new Uint8Array(buffer));

  bytes.forEach(b => (binary += String.fromCharCode(b)));

  return window.btoa(binary);
}

export function balanceAmt(role1, role2) {
  return request({
    url: role1 + "/api/org.equiv.participants.assets." + role2,
    method: "GET"
  });
}

export function dealerGetHighestBid(bid) {
  return request({
    url: "dealer/api/org.equiv.participants.assets.Bid/" + bid,
    method: "GET"
  });
}

export function dealerIncludeOffers(offers) {
  return request({
    url: "dealer/api/org.equiv.transactions.IncludeDealerOffers",
    method: "POST",
    body: JSON.stringify(offers)
  });
}

export function dealerViewListings() {
  return request({
    url: "dealer/api/org.equiv.participants.assets.Listing",
    method: "GET"
  });
}

export function dealerSubmitBid(bid) {
  return request({
    url: "dealer/api/org.equiv.transactions.SubmitBid",
    method: "POST",
    body: JSON.stringify(bid)
  });
}

export function dealerUpdateBid(bid) {
  return request({
    url: "dealer/api/org.equiv.transactions.UpdateBid",
    method: "POST",
    body: JSON.stringify(bid)
  });
}

export function dealerGetAssets() {
  return request({
    url: "dealer/api/org.equiv.participants.assets.Vehicle",
    method: "GET"
  });
}

export function dealerMakePayment(payment) {
  return request({
    url: "dealer/api/org.equiv.transactions.MakePayment",
    method: "POST",
    body: JSON.stringify(payment)
  });
}

export function buyerMakePayment(payment) {
  return request({
    url: "buyer/api/org.equiv.transactions.MakePayment",
    method: "POST",
    body: JSON.stringify(payment)
  });
}

export function buyerGetAssets() {
  return request({
    url: "buyer/api/org.equiv.participants.assets.Vehicle",
    method: "GET"
  });
}

export function middlemanGetAssets() {
  return request({
    url: "middleman/api/org.equiv.participants.assets.Vehicle",
    method: "GET",
  });
}

export function middlemanViewListings() {
  return request({
    url: "middleman/api/org.equiv.participants.assets.Listing",
    method: "GET",
  });
}

export function middlemanCreateListing(listing) {
  return request({
    url: "middleman/api/org.equiv.transactions.CreateListing",
    method: "POST",
    body: JSON.stringify(listing)
  });
}

export function middlemanDeleteListing(listingId) {
  return request({
    url: "middleman/api/org.equiv.transactions.DeleteListing",
    method: "POST",
    body: JSON.stringify(listingId)
  });
}

export function middlemanCloseListing(listingId) {
  return request({
    url: "middleman/api/org.equiv.transactions.CloseListing",
    method: "POST",
    body: JSON.stringify(listingId)
  });
}

export function middlemanUpdateListingExpiry(listingId) {
  return request({
    url: "middleman/api/org.equiv.transactions.UpdateListingExpiry",
    method: "POST",
    body: JSON.stringify(listingId)
  });
}

export function login(loginRequest) {
  return request({
    url: API + "/auth",
    method: "POST",
    body: JSON.stringify(loginRequest)
  });
}

export function getServerSignature(loginRequest) {
  return request({
    url: API + "/auth/firstAuthorization",
    method: "POST",
    body: JSON.stringify(loginRequest)
  });
}

export function verifyTagSignature(loginRequest) {
  return request({
    url: API + "/auth/secondAuthorization",
    method: "POST",
    body: JSON.stringify(loginRequest)
  });
}

export function getServerFileDataSignature(file) {
  return sendFile({
    url: API + "/file/getSignature",
    method: "POST",
    body: file
  });
}

export function logout() {
  //   return request({
  //     url: API + "/user/logout",
  //     method: "GET"
  //   });
  return;
}

export function getCurrentUser() {
  if (!localStorage.getItem(AUTH_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API + "/auth/user",
    method: "GET"
  });
}

// Seller API calls
export function getAllMyBuyers() {
  return request({
    url: API + "/treatments/getBuyers/",
    method: "GET"
  });
}

export function getAllRecords() {
  return request({
    url: API + "/records/",
    method: "GET"
  });
}

export function getMyRecords() {
  return request({
    url: API + "/records/seller/",
    method: "GET"
  });
}

export function giveBuyerPermission(req) {
  return request({
    url: API + "/permissions/permit/",
    method: "POST",
    body: JSON.stringify(req)
  });
}

export function createRecordSignature(newRecord, file) {
  const formData = new FormData();
  formData.append("recordRequest", JSON.stringify(newRecord));
  formData.append("file", file, file.name);
  return create({
    url: API + "/records/create/signature",
    method: "POST",
    body: formData
  });
}

export function verifyCreateRecordTagSignature(newRecord, file, reqToSend) {
  const formData = new FormData();
  formData.append("recordRequest", JSON.stringify(newRecord));
  formData.append("signatureRequest", JSON.stringify(reqToSend));
  formData.append("file", file, file.name);
  return create({
    url: API + "/records/create/signature/verify",
    method: "POST",
    body: formData
  });
}

export function getGivenPermissions() {
  return request({
    url: API + "/permissions/seller/given/",
    method: "GET"
  });
}

export function removeBuyerPermission(req) {
  return request({
    url: API + "/permissions/revoke/",
    method: "POST",
    body: JSON.stringify(req)
  });
}

export function getMyNotes() {
  return request({
    url: API + "/notes/getOwn/",
    method: "GET"
  });
}

export function getBuyerNotes() {
  return request({
    url: API + "/notes/getPermitted/",
    method: "GET"
  });
}

// Buyer API calls
export function getSellerProfile(nric) {
  return request({
    url: API + "/treatments/getUserSummary/" + nric,
    method: "GET"
  });
}

export function createRecord(newRecord, file) {
  const formData = new FormData();
  formData.append("recordRequest", JSON.stringify(newRecord));
  formData.append("file", file, file.name);
  return create({
    url: API + "/records/create/",
    method: "POST",
    body: formData
  });
}

export function getSellerPermittedRecords(pat_nric) {
  return request({
    url: API + "/records/buyer/seller/" + pat_nric,
    method: "GET"
  });
}

export function getAllBuyerNotes(pat_nric) {
  return request({
    url: API + "/notes/getSeller/" + pat_nric + "/",
    method: "GET"
  });
}

export function setNotePermission(req) {
  return request({
    url: API + "/notes/notePermission/",
    method: "POST",
    body: JSON.stringify(req)
  });
}

export function checkNotePermission(note_id) {
  return request({
    url: API + "/notes/checkNoteIdConsent/" + note_id + "/",
    method: "GET"
  });
}

export function getSellers() {
  return request({
    url: API + "/treatments/getSellers/",
    method: "GET"
  });
}

// Buyer and Seller API calls
export function createNote(req) {
  return request({
    url: API + "/notes/create/",
    method: "POST",
    body: JSON.stringify(req)
  });
}

export function updateNote(req) {
  return request({
    url: API + "/notes/update/",
    method: "POST",
    body: JSON.stringify(req)
  });
}

export function downloadFile(filename) {
  return requestFile({
    url: API + "/file/download/" + filename,
    method: "GET"
  });
}

export function downloadVideo(filename) {
  return requestVideo({
    url: API + "/file/download/" + filename,
    method: "GET"
  });
}

export function downloadImg(filename) {
  return requestImg({
    url: API + "/file/download/" + filename,
    method: "GET"
  });
}

// Admin API calls
export function signup(signupRequest) {
  return request({
    url: API + "/auth/signup",
    method: "POST",
    body: JSON.stringify(signupRequest)
  });
}

export function getAllUsers() {
  return request({
    url: API + "/admin/showAllUsers",
    method: "GET"
  });
}

export function getLogs() {
  return requestLogs({
    url: API + "/admin/logs/",
    method: "GET"
  });
}

export function deleteUser(nric) {
  return request({
    url: API + "/admin/delete/" + nric,
    method: "GET"
  });
}

export function assign(nrics) {
  return request({
    url: API + "/treatments/start/",
    method: "POST",
    body: JSON.stringify(nrics)
  });
}

export function unassign(nrics) {
  return request({
    url: API + "/treatments/stop/",
    method: "POST",
    body: JSON.stringify(nrics)
  });
}

export function getAnonymousData(data) {
  return request({
    url: API + "/evaluator/getAnonymousData",
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function externalUpload(type, file) {
  return request({
    url: API + "/external/upload/csv",
    method: "POST",
    body: JSON.stringify(file)
  });
}
