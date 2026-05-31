class LocationModel {
    constructor(place) {
        this.place_id         = place.place_id;
        this.name             = place.name;
        this.formatted_address = place.formatted_address;
        this.coordinates      = {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
        };
        this.types            = place.types || [];
    }
}

module.exports = LocationModel;