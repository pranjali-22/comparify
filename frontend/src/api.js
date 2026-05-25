import axios from "axios";
import { API } from "./socket";

const http = axios.create({ baseURL: API });

export const compareRides   = (pickup, dropoff) => http.post("/compare", { pickup, dropoff }).then(r => r.data);
export const startTrip      = (data)             => http.post("/trips/start", data).then(r => r.data);
export const cancelTrip     = (tripId)            => http.post("/trips/cancel", { tripId }).then(r => r.data);
export const endTrip        = (tripId)            => http.post("/trips/end",    { tripId }).then(r => r.data);
export const getActiveTrips = ()                  => http.get("/trips/active").then(r => r.data);
