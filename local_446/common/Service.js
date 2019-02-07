sap.ui.define([
	"edu/mit/parking/common/Http"
], function (Http) {
	"use strict";

	var Service = function (inController) {
		this.controller = inController;
		//initialization
		this.USER_NAME = "/apis/userapi/currentUser";
		this.URL_AUTHORIZATION = "/apis/mulesoft/pk_parking/initialize/parker";
		this.URL_VEHICLE_LOOKUPS = "/apis/mulesoft/pk_parking/lookups/vehicle-options";
		this.URL_BANNERS = "/apis/mulesoft/pk_parking/banners";
		this.URL_TICKET_COUNT = "/apis/mulesoft/pk_parking/account/ticket-count";
		this.URL_CYBER_SOURCE = "/apis/mulesoft/pk_parking/cybersource/profile";
		this.URL_API_HEALTH = "/apis/mulesoft/pk_parking/api/api-health/ping";

		//status
		this.URL_FINANCE_API_STATUS = "/apis/mulesoft/pk_finance/api/api-health/status";
		this.URL_API_STATUS = "/apis/mulesoft/pk_parking/api/api-health/status";

		//vehicle
		this.URL_VEHICLE_MAKE_MODEL_LOOKUP = "/apis/mulesoft/pk_parking/lookups/vehicle-menus/";

		//people
		this.URL_PEOPLE_LOOKUP = "/apis/mulesoft/pk_parking/lookups/mit-person";

		//permitOptions
		this.URL_PERMIT_OPTIONS = "/apis/mulesoft/pk_parking/account/permit-options?idx=0";
		this.URL_ACCOUNT_PERMIT = "/apis/mulesoft/pk_parking/permits";

		//vehicles
		this.URL_VEHICLE = "/apis/mulesoft/pk_parking/permits/";

		//account
		this.URL_ACCOUNT = "/apis/mulesoft/pk_parking/account";
		this.URL_ACCOUNT_PERIODS = "/apis/mulesoft/pk_parking/account/billing-periods";
		this.URL_ACCOUNT_PERIOD_TRANSACTIONS = "/apis/mulesoft/pk_parking/account/transactions";
		this.URL_ACCOUNT_PARKING_ACTIVITY = "/apis/mulesoft/pk_parking/account/parking-activity";

		//permit grid
		this.URL_PERMIT_GRID = "/apis/mulesoft/pk_parking/lookups/permit-grid";
	};

	//initialization
	Service.prototype.getUserName = function (successCallback, errorCallback) {
		Http.get(this.USER_NAME, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};
	Service.prototype.getAuthorization = function (successCallback, errorCallback) {
		Http.get(this.URL_AUTHORIZATION, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};
	Service.prototype.getVehicleLookups = function (successCallback, errorCallback) {
		Http.get(this.URL_VEHICLE_LOOKUPS, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};
	Service.prototype.getBanners = function (successCallback, errorCallback) {
		Http.get(this.URL_BANNERS, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};
	Service.prototype.getBillingPeriods = function (successCallback, errorCallback) {
		Http.get(this.URL_ACCOUNT_PERIODS, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};
	Service.prototype.getTicketCount = function (successCallback, errorCallback) {
		Http.get(this.URL_TICKET_COUNT, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};
	Service.prototype.getCyberSource = function (successCallback, errorCallback) {
		Http.get(this.URL_CYBER_SOURCE, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};
	Service.prototype.getApiHealth = function (successCallback, errorCallback) {
		Http.get(this.URL_API_HEALTH, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};

	//api status
	Service.prototype.getFinanceApiStatus = function (successCallback, errorCallback) {
		Http.get(this.URL_FINANCE_API_STATUS, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};
	Service.prototype.getApiStatus = function (successCallback, errorCallback) {
		Http.get(this.URL_API_STATUS, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};

	//banner
	Service.prototype.removeBanner = function (sId, successCallback, errorCallback) {
		Http.delete(this.URL_BANNERS + "/" + sId, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};

	//acount
	Service.prototype.saveContactInformation = function (oModel, successCallback, errorCallback) {
		Http.post(this.URL_ACCOUNT + "/contact-info", oModel, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};

	//permit
	Service.prototype.getPermitOptions = function (successCallback, errorCallback) {
		Http.get(this.URL_PERMIT_OPTIONS, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};
	Service.prototype.createPermit = function (oModel, successCallback, errorCallback) {
		Http.post(this.URL_ACCOUNT_PERMIT, oModel, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};
	Service.prototype.getPermits = function (successCallback, errorCallback) {
		Http.get(this.URL_ACCOUNT_PERMIT, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};
	Service.prototype.cancelPermit = function (sPermitId, successCallback, errorCallback) {
		Http.delete(this.URL_ACCOUNT_PERMIT + "/" + sPermitId, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};

	//vehicle
	Service.prototype.saveVehicle = function (sPermitId, oVehicle, successCallback, errorCallback) {
		Http.post(this.URL_VEHICLE + sPermitId + "/vehicles", oVehicle, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};
	Service.prototype.removeVehicle = function (sPermitId, sVehicleId, successCallback, errorCallback) {
		Http.delete(this.URL_VEHICLE + sPermitId + "/vehicles/" + sVehicleId, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};
	Service.prototype.getVehicleMakes = function (sYear, successCallback, errorCallback) {
		Http.get(this.URL_VEHICLE_MAKE_MODEL_LOOKUP + sYear, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};
	Service.prototype.getVehicleModels = function (sYear, sMake, successCallback, errorCallback) {
		Http.get(this.URL_VEHICLE_MAKE_MODEL_LOOKUP + sYear + "/" + sMake, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};
	Service.prototype.updateVehicle = function (sPermitId, sVehicleId, oVehicle, successCallback, errorCallback) {
		Http.put(this.URL_VEHICLE + sPermitId + "/vehicles/" + sVehicleId, oVehicle, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};

	//people search
	Service.prototype.getPeople = function (sKey, successCallback, errorCallback) {
		Http.get(this.URL_PEOPLE_LOOKUP + "?q=" + sKey, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};
	Service.prototype.getPerson = function (sKey, successCallback, errorCallback) {
		Http.get(this.URL_PEOPLE_LOOKUP + "/" + sKey, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};

	//billing
	Service.prototype.getAccountPeriodTransactions = function (successCallback, errorCallback) {
		Http.get(this.URL_ACCOUNT_PERIOD_TRANSACTIONS, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};
	Service.prototype.getAccountParkingActivity = function (successCallback, errorCallback) {
		Http.get(this.URL_ACCOUNT_PARKING_ACTIVITY, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};

	//violations


	//grid
	Service.prototype.getPermitGrid = function (successCallback, errorCallback) {
		Http.get(this.URL_PERMIT_GRID, {
			success: successCallback,
			error: errorCallback
		}, this.controller);
	};

	return new Service();
});