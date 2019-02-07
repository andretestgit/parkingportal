sap.ui.define([
	"edu/mit/parking/common/BaseController",
	"sap/ui/model/json/JSONModel",
	"edu/mit/parking/common/formatter"
], function (BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("edu.mit.parking.features.permit.NewPermit", {
		formatter: formatter,
		/* =========================================================== */
		/* lifecycle methods                                         */
		/* =========================================================== */
		onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass()); //add syling class based on device
			/*this.getView().setBusy(true);
			this.getOwnerComponent().getModel("jcc").attachMetadataLoaded(function(oEvent) { //Set screen to not busy once meta data has been loaded
				this.getView().setBusy(false);
			}.bind(this));*/

			this.getRouter().getRoute("newPermit").attachMatched(this._onRouteMatched, this); //triggered every time view is navigated to
			//create view model
			//create view model
			this.viewModel = new JSONModel({
				showComment: false,
				permit: {
					title: "EMPLOYEE",
					type: "employee",
					permitType: [{
						id: "PERSONAL",
						text: "Personal"
					}, {
						id: "CARPOOL",
						text: "Carpool"
					}],
					economy: true,
					paymentSchedule: "MONTHLY",
					paymentOptions: [{
						id: "PAYROLL",
						text: "Payroll Deduction"
					}, {
						id: "CREDIT",
						text: "Credt/Debit Card"
					}]
				},
				newPermit: {
					permitType: "",
					paymentMethod: ""
				}

			});
			this.getView().setModel(this.viewModel);
		},

		onBeforeRendering: function () {

		},

		onAfterRendering: function () {

		},

		/* =========================================================== */
		/* public methods                                         */
		/* =========================================================== */

		/* =========================================================== */
		/* event handlers                                         */
		/* =========================================================== */
		/**
		 * Adds a blank new vehicle object to the vehicles array
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onPressAddAnotherVehicle: function (oEvent) {
			var oVehicles = this.viewModel.getProperty("/vehicles");
			if (oVehicles.length < 3) {
				var newVehicle = {
					vehicleNumber: oVehicles[oVehicles.length - 1].vehicleNumber + 1,
					make: "",
					bodyType: "VEHICLE",
					model: "",
					color: "",
					licensePlate: "",
					state: "",
					startDate: null,
					endDate: null
				};
				oVehicles.push(newVehicle);
				this.viewModel.setProperty("/vehicles", oVehicles);
			} else {
				this._showValidationError("Error.Text.MaximumVehicles");
			}
		},
		/**
		 * Remove vehicle from list. Renumber vehicle numbers if vehicle is a middle vehicle
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onPressRemoveVehicle: function (oEvent) {
			var sIndex = oEvent.getSource().getBindingContext().sPath.split("/")[2];
			var oVehicles = this.viewModel.getProperty("/vehicles");
			var bRenumberVehicles = false;
			//Check to see if vehicle to be removed is a middle vehicle which would require renumbering vehicles
			if (sIndex != oVehicles.length - 1) {
				bRenumberVehicles = true;
			}
			oVehicles.splice(parseInt(sIndex), 1);
			if (bRenumberVehicles) {
				for (var x = 1; x < oVehicles.length; x++) {
					oVehicles[x].vehicleNumber = oVehicles[x - 1].vehicleNumber + 1;
				}
			}
			this.viewModel.setProperty("/vehicles", oVehicles);
		},
		/**
		 * Shows and hides comment section
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onPressComment: function (oEvent) {
			this.viewModel.setProperty("/showComment", !this.viewModel.getProperty("/showComment"));
			this.viewModel.setProperty("/newPermit/comment", "");
		},
		/* =========================================================== */
		/* private methods                                         */
		/* =========================================================== */
		/**
		 * Fires every time route is matched to this view
		 * @param {sap.ui.base.Event} oEvent : Routing event
		 * @private
		 */
		_onRouteMatched: function (oEvent) {
			this._resetVehicleModel();
		},
		/**
		 * Clears vehicles property from view model
		 * @private
		 */
		_resetVehicleModel: function () {
			var oVehicles = [{
				vehicleNumber: 1,
				bodyType: "VEHICLE",
				make: "",
				model: "",
				color: "",
				licensePlate: "",
				state: "",
				startDate: null,
				endDate: null
			}];
			this.viewModel.setProperty("/vehicles", oVehicles);
		}

	});
});