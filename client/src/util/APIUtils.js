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

export function EvaluatorCreateVehicle(vehicle) {
  return request({
    url: "evaluator/api/org.equiv.transactions.EvaluateVehicle",
    method: "POST",
    body: JSON.stringify(vehicle)
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

export function buyerViewRating() {
  return request({
    url: "buyer/api/org.equiv.participants.assets.Rating",
    method: "GET"
  });
}

export function buyerRateDealer(rating) {
  return request({
    url: "buyer/api/org.equiv.transactions.RateDealer",
    method: "POST",
    body: JSON.stringify(rating)
  });
}

export function buyerUpdateRatings(rating) {
  return request({
    url: "buyer/api/org.equiv.transactions.UpdateRatings",
    method: "POST",
    body: JSON.stringify(rating)
  });
}

export function sellerGetAssets() {
  return request({
    url: "seller/api/org.equiv.participants.assets.Vehicle",
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

export function getCurrentUser() {
  if (!localStorage.getItem(AUTH_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API + "/auth/user",
    method: "GET"
  });
}
