sap.ui.define([
	"edu/mit/parking/common/BaseController",
	"sap/ui/model/json/JSONModel",
	"edu/mit/parking/common/formatter",
	"edu/mit/parking/common/CustomTypes"
], function (BaseController, JSONModel, formatter, CustomTypes) {
	"use strict";

	return BaseController.extend("edu.mit.parking.features.vehicle.NewVehicle", {
		formatter: formatter,
		CustomTypes: CustomTypes,
		saveVehicle: false,
		/* =========================================================== */
		/* lifecycle methods                                         */
		/* =========================================================== */
		onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass()); //add syling class based on device
			/*this.getView().setBusy(true);
			this.getOwnerComponent().getModel("jcc").attachMetadataLoaded(function(oEvent) { //Set screen to not busy once meta data has been loaded
				this.getView().setBusy(false);
			}.bind(this));*/

			this.getRouter().getRoute("newVehicle").attachMatched(this._onRouteMatched, this); //triggered every time view is navigated to
			//create view model
			this.viewModel = new JSONModel({
				saveVehicle: false,
				suggestions: [{
						id: "1",
						text: "1"
					},
					{
						id: "2",
						text: "2"
					}
				]
			});
			this.getView().setModel(this.viewModel);
		},

		onBeforeRendering: function () {

		},

		onAfterRendering: function () {
			// this.byId("productInput").setFilterFunction(function(sTerm, oItem) {
			// 	// A case-insensitive 'string contains' style filter
			// 	return oItem.getText().match(new RegExp(sTerm, "i"));
			// });
			var oMake = this.byId("vehicle_container").getItems()[0].getItems()[2].getItems()[0].getItems()[1].getItems()[1],
				oModel = this.byId("vehicle_container").getItems()[0].getItems()[2].getItems()[0].getItems()[2].getItems()[1];
			if (this._getModel("device").getProperty("/system/phone")) {
				oMake.setFilterFunction(function (sTerm, oItem) {
					// A case-insensitive 'string contains' style filter
					return oItem.getText().match(new RegExp(sTerm, "i"));
				});
				oModel.setFilterFunction(function (sTerm, oItem) {
					// A case-insensitive 'string contains' style filter
					return oItem.getText().match(new RegExp(sTerm, "i"));
				});

			}
		},

		/* =========================================================== */
		/* public methods                                         */
		/* =========================================================== */

		/* =========================================================== */
		/* event handlers                                         */
		/* =========================================================== */
		/**
		 * Navigate back to previous screen
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onPressCancel: function () {
			this._resetVehicleModel();
			this.getValidator().validate(this.getView().getContent()[0], true);
			this.onNavBack();
		},

		/**
		 * Perform validation on required fields, then submit vehicles
		 * @param {sap.ui.base.Event} oEvent : Press
		 * @public
		 */
		onPressSubmitVehicles: function (oEvent) {
			var validator = this.getValidator(),
				bValid = validator.validate(this.getView().getContent()[0]),
				oModel = this.viewModel.getProperty("/vehicle");
			if (!this.viewModel.getProperty("/saveVehicle")) {
				this.viewModel.setProperty("/saveVehicle", true);
				if (!bValid) {
					this._showValidationError("Error.Text.RequiredFields");
					this.viewModel.setProperty("/saveVehicle", false);
				} else {
					if (this._getStartDateInPast(oModel.startDate) && this.bTempVehicle) {
						this._showValidationError("Vehicle.Text.TempStartPast");
						this.viewModel.setProperty("/saveVehicle", false);
						this.byId("vehicle_datepicker_startDate").setValueState("Error");
					} else if (this._getDaysDifference(oModel.startDate, oModel.endDate) > 30 && this.bTempVehicle) {
						this._showValidationError("Vehicle.Text.TempVehicleError");
						this.viewModel.setProperty("/saveVehicle", false);
						this.byId("vehicle_datepicker_endDate").setValueState("Error");
					} else {
						if(this.bEdit) {
							this._updateVehicle();
						} else {
							this._saveVehicles();
						}
						
					}
				}
			}
		},

		onChangeState: function (oEvent) {
			var sPath = oEvent.getSource().getSelectedItem().getBindingContext("lookups").sPath,
				oModel = this._getModel("lookups").getProperty(sPath);
			this.viewModel.setProperty("/vehicle/plateCountry", oModel.country);
			this.removeValidationError(oEvent);
		},
		/* =========================================================== */
		/* private methods                                         */
		/* =========================================================== */
		/**
		 * Fires every time route is matched to this view. Changes text based on temp vehicle property passed in
		 * @param {sap.ui.base.Event} oEvent : Routing event
		 * @private
		 */
		_onRouteMatched: function (oEvent) {
			this.bTempVehicle = oEvent.getParameter("arguments").bTempVehicle === "true";
			this.bEdit = oEvent.getParameter("arguments").bEdit === "true";
			this.sPath = "/" + oEvent.getParameter("arguments").sPath.replace(/-/g, "/");
			this.iVehicleNumber = oEvent.getParameter("arguments").iVehicleNumber;
			this.viewModel.setProperty("/vehicleNumber", this.iVehicleNumber);
			this.viewModel.setProperty("/editVehicle", this.bEdit);
			this.viewModel.setProperty("/tempVehicle", this.bTempVehicle);
			this._resetVehicleModel();
			this.viewModel.refresh(true);
			if(!this._getModel("sessionData").getProperty(this.sPath)) {
				this.onNavBack();
			} else {
				if(this.bEdit) {
					this._updateVehicleModelForEdit();
				}
			}
			
		},
		/**
		 * Clears vehicles property from view model
		 * @private
		 */
		_resetVehicleModel: function () {
			//this.viewModel.setProperty("/vehicles", []);
			var oVehicle = this._getNewVehicle(),
				validator = this.getValidator();
			oVehicle.temporary = false;
			oVehicle.startDate = null;
			oVehicle.endDate = null;
			validator.validate(this.getView().getContent()[0], true);

			this.viewModel.setProperty("/vehicle", oVehicle);
			// this.byId("vehicle_datepicker_startDate").setValueState("None");
			// this.byId("vehicle_datepicker_endDate").setValueState("None");

		},
		/**
		 * Sets start and end date for temp vehicles
		 * @private
		 */
		_formatVehiclesForSave: function () {
			var oVehicle = jQuery.extend(true, {}, this.viewModel.getProperty("/vehicle"));
			oVehicle.temporary = this.bTempVehicle;

			oVehicle.startDate ? oVehicle.startDate = this._getFormatterDate(oVehicle.startDate) : delete oVehicle.startDate;
			oVehicle.endDate ? oVehicle.endDate = this._getFormatterDate(oVehicle.endDate) : delete oVehicle.endDate;
			delete oVehicle.lookups;
			delete oVehicle.vehicleNumber;
			return {
				item: oVehicle
			};
		},

		_saveVehicles: function () {
			var oVehicle = jQuery.extend(true, {}, this.viewModel.getProperty("/vehicle")),
				sPermitId = this._getModel("sessionData").getProperty(this.sPath + "/permitId");
			
			// oCurrentVehicles = this._getModel("sessionData").getProperty(this.sPath + "/vehicles");

			oVehicle = this._formatVehiclesForSave();
			this.getService().saveVehicle(sPermitId, oVehicle, function (oData, sMessage) {
					// var oCurrentVehicles = this._getModel("sessionData").getProperty(this.sPath + "/vehicles");
					// oCurrentVehicles.push(oVehicle);
					// this._getModel("sessionData").setProperty(this.sPath + "/vehicles", oCurrentVehicles);
					// this.viewModel.setProperty("/saveVehicle", false);
					this.getService().getPermits(function (oData, sMessage) {
						this._getModel("sessionData").setProperty("/permits", oData.items);
						this.viewModel.setProperty("/saveVehicle", false);
						this.onPressCancel();
					}.bind(this), function (oError) {
						this._showValidationErrorMessageItems(oError);
					}.bind(this));

				}.bind(this),
				function (oError) {
					this.viewModel.setProperty("/saveVehicle", false);
					//this._showValidationError("There was a problem adding your vehicle. Contact the parking office for further assistance.");
					this._showValidationErrorMessageItems(oError);
				}.bind(this));

			//	oVehicle = this.getVehicleMakeAndModel(oVehicle);
		},

		_updateVehicle: function() {
			var sPermitId = this._getModel("sessionData").getProperty(this.sPath.split("/vehicles")[0] + "/permitId"),
				sVehicleId = this._getModel("sessionData").getProperty(this.sPath).vehicleId,				
				oVehicle = this._formatVehiclesForSave();
			this.getService().updateVehicle(sPermitId, sVehicleId, oVehicle, function (oData, sMessage) {
					// var oCurrentVehicles = this._getModel("sessionData").getProperty(this.sPath + "/vehicles");
					// oCurrentVehicles.push(oVehicle);
					// this._getModel("sessionData").setProperty(this.sPath + "/vehicles", oCurrentVehicles);
					// this.viewModel.setProperty("/saveVehicle", false);
					this.getService().getPermits(function (oData, sMessage) {
						this._getModel("sessionData").setProperty("/permits", oData.items);
						this.viewModel.setProperty("/saveVehicle", false);
						this.onPressCancel();
					}.bind(this), function (oError) {
						this._showValidationErrorMessageItems(oError);
					}.bind(this));
				}.bind(this),
				function (oError) {
					this.viewModel.setProperty("/saveVehicle", false);
					//this._showValidationError("There was a problem adding your vehicle. Contact the parking office for further assistance.");
					this._showValidationErrorMessageItems(oError);
				}.bind(this));
		},

		_getFormatterDate: function (oDate) {
			return oDate.toISOString().split("T")[0];
		},

		_getDaysDifference: function (startDate, endDate) {
			return Math.round(endDate - startDate) / (1000 * 60 * 60 * 24);
		},
		_getStartDateInPast: function (startDate) {
			var oToday = new Date().setHours(0, 0, 0, 0);
			if (startDate < oToday) {
				return true;
			}
			return false;
		},
		_updateVehicleModelForEdit: function() {
			var oVehicle = this._getModel("sessionData").getProperty(this.sPath);
			var oEditVehicle = this.viewModel.getProperty("/vehicle");

			oEditVehicle.year = oVehicle.year;
			oEditVehicle.make = oVehicle.make;
			oEditVehicle.model = oVehicle.model;
			oEditVehicle.color = oVehicle.color;
			oEditVehicle.plateNumber = oVehicle.plateNumber;
			oEditVehicle.plateState = oVehicle.plateState;
			oEditVehicle.plateCountry = oVehicle.plateCountry;
			oEditVehicle.temporary = oVehicle.temporary;
			oEditVehicle.bodyType = oVehicle.bodyType;
			if(oVehicle.temporary) {
				oEditVehicle.startDate = this.formatter.parseDateString(oVehicle.startDate);
				oEditVehicle.endDate = this.formatter.parseDateString(oVehicle.endDate);
			}
			this.viewModel.setProperty("/vehicle", oEditVehicle);
			this.onFilterMake(null, "/vehicle");
		}

	});
});