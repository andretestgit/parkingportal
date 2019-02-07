sap.ui.define([
	"edu/mit/parking/common/Http"
], function(Http) {
	"use strict";

	var Service = function(inController) {
		this.controller = inController;

		this.URL_VEHICLE_MAKE = "/lookups/vehicle-makes?expand=true";
		this.URL_VEHICLE_MODEL = "/lookups/vehicle-makes/59/models";
		this.URL_VEHICLE_STATE = "/lookups/vehicle-states";
		this.URL_VEHICLE_COLOR = "/lookups/vehicle-colors";
	};

	Service.prototype.getVehicleMakeModel = function(successCallback, errorCallback) {
		Http.ajax("GET", this.controller, successCallback, errorCallback, this.URL_VEHICLE_MAKE);
	};
	Service.prototype.getVehicleState = function(successCallback, errorCallback) {
		Http.ajax("GET", this.controller, successCallback, errorCallback, this.URL_VEHICLE_STATE);
	};
	Service.prototype.getVehicleColor = function(successCallback, errorCallback) {
		Http.ajax("GET", this.controller, successCallback, errorCallback, this.URL_VEHICLE_COLOR);
	};

	return new Service();
});