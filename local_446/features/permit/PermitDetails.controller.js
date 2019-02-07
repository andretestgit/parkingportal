sap.ui.define([
	"edu/mit/parking/common/BaseController",
	"edu/mit/parking/common/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (BaseController, formatter, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("edu.mit.parking.features.permit.PermitDetails", {
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
			this.getRouter().getRoute("permitDetails").attachMatched(this._onRouteMatched, this); //triggered every time view is navigated to
			this.viewModel = new JSONModel({
				canRemoveVehicles: false,
				canEditVehicle: true,
				flags: {
					editContactInfo: false,
					contactInfo: false
				}
			})
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
		 * Determins if the remove vehicle link is visible or not
		 * @param {sap.ui.base.Event} oEvent : Button Press
		 * @public
		 */
		setRemoveVehicleVisibility: function (oEvent) {
			if (this.sPermitIndex) {
				var oModel = this._getModel("sessionData").getProperty("/permits/" + this.sPermitIndex);
				if (oModel) {
					if (oModel.minNumberOfVehicles == oModel.vehicles.length) {
						this.viewModel.setProperty("/canRemoveVehicles", false);
					} else {
						this.viewModel.setProperty("/canRemoveVehicles", true);
					}

				}
			}
		},
		/**
		 * Show confirmation message to remove vehicle
		 * @param {sap.ui.base.Event} oEvent : Button Press
		 * @public
		 */
		onPressRemoveVehicle: function (oEvent) {
			var sPath = oEvent.getSource().getBindingContext("sessionData").sPath;
			this.removeVehicle = this._getModel("sessionData").getProperty(sPath);
			this.removeVehicleSPath = sPath;
			this._showRemoveVehicleConfirmation();

			//TO DO : If removing last vehicle, need to change language of the links to add vehicle
		},
		/**
		 * Route to permit request for spouse
		 * @param {sap.ui.base.Event} oEvent : Button Press
		 * @public
		 */
		onPressRequestPermitForSpouse: function (oEvent) {
			this.getRouter().navTo("newPermit");
		},

		onPressEditVehicle: function (oEvent) {
			var sPath = oEvent.getSource().getBindingContext("sessionData").sPath;
			var bTemp = this._getModel("sessionData").getProperty(sPath).temporary;
			var iVehicleNumber = this._getVehicleNumber(bTemp, this._getModel("sessionData").getProperty(sPath).plateNumber, sPath.split("/vehicles")[0] + "/vehicles");

			this.getRouter().navTo("newVehicle", {
				bTempVehicle: bTemp,
				bEdit: true,
				sPath: sPath.substring(1, sPath.length).replace(/\//g, "-"),
				iVehicleNumber: iVehicleNumber
			});

		},
		onPressEditContactInfo: function (oEvent) {
			var oModel = this._getModel("sessionData").getProperty(this.sPath);
			this.viewModel.setProperty("/flags/editContactInfo", true);
			this.viewModel.setProperty("/editContactInfo", {
				email: oModel.contactEmail,
				phoneNumber: oModel.contactWorkPhone
			});
		},
		onPressCancelEditContactInfo: function () {
			this.viewModel.setProperty("/flags/editContactInfo", false);
		},
		onPressSaveContactInfo: function () {
			var oModel = this.viewModel.getProperty("/editContactInfo"),
				oAccount = this._getModel("sessionData").getProperty(this.sPath),
				oData = {
					item: oModel
				};
			if (!oModel.email) {
				this._showValidationError("You must enter a valid email address.")
				this.byId("input_email").setValueState("Error");
			} else if (oModel.phoneNumber.length != 14) {
				this._showValidationError("You must enter a valid phone number.")
				this.byId("input_phone").setValueState("Error");
			} else {
				if (oAccount.contactEmail != oModel.email || oAccount.contactWorkPhone != oModel.phoneNumber) {
					this.viewModel.setProperty("/flags/contactInfo", true);
					this.getService().saveContactInformation(oData, function (oData) {
							this.viewModel.setProperty("/flags/contactInfo", false);
							this.onPressCancelEditContactInfo();
							this._getModel("sessionData").setProperty(this.sPath + "/contactEmail", oData.item.email);
							this._getModel("sessionData").setProperty(this.sPath + "/contactWorkPhone", oData.item.phoneNumber);
						}.bind(this),
						function (oError) {
							this._showValidationErrorMessageItems(oError);
						}.bind(this))
				} else {
					this.onPressCancelEditContactInfo();
				}
			}
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
			this.sPermitIndex = oEvent.getParameter("arguments").sPath;
			this.sPath = "/permits/" + this.sPermitIndex;
			this.getView().bindElement({
				model: "sessionData",
				path: this.sPath
			});


		},
		/**
		 * Show confirmation messagebox to confirm user wants to delete vehicle from permit
		 * @private
		 */
		_showRemoveVehicleConfirmation: function () {
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.warning(
				this.getTranslation("Permit.Text.ConfirmDeleteVehicle"), {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					onClose: function (sAction) {
						if (sAction === "YES") {
							var oVehicle = this._getModel("sessionData").getProperty(this.removeVehicleSPath),
								oPermit = this._getModel("sessionData").getProperty("/permits/" + this.sPermitIndex);
							//this._removeVehicle();
							this._getModel("sessionData").setProperty("/busyFlags/permits", true);
							this.getService().removeVehicle(oPermit.permitId, oVehicle.plateNumber + "-" + oVehicle.plateState, function (oData, sMessage) {
								this._removeVehicle();
							}.bind(this), function (oError) {
								this._getModel("sessionData").setProperty("/busyFlags/permits", false);
								this._showValidationErrorMessageItems(oError);
							}.bind(this));
						}
					}.bind(this)
				}
			);
		},
		/**
		 * Make HTTP call to remove vehicle from permit
		 * @private
		 */
		_removeVehicle: function () {
			//this.removeVehicle;
			//make HTTP delete call with vehicle information
			//success callback, remove vehicle from model
			var sIndex = this.removeVehicleSPath.split("/")[4];
			var sPath = this.removeVehicleSPath.substring(0, this.removeVehicleSPath.length - (sIndex.length + 1));
			var oVehicles = this._getModel("sessionData").getProperty(sPath);
			oVehicles.splice(parseInt(sIndex), 1);
			this._getModel("sessionData").setProperty(sPath, oVehicles);
			this._getModel("sessionData").setProperty("/busyFlags/permits", false);
			//this._updateVehicleRemoveVisibility();
		},
		_getVehicleNumber: function (bTemp, sPlateNumber, sPath) {
			var oVehicles = this._getModel("sessionData").getProperty(sPath),
				iVehicle = 0,
				iTempVehicle = 0;
			for (var x in oVehicles) {
				if (oVehicles[x].temporary) {
					iTempVehicle++;
				} else {
					iVehicle++;
				}
				if (sPlateNumber == oVehicles[x].plateNumber) {
					if (bTemp) {
						return iTempVehicle;
					} else {
						return iVehicle;
					}
				}
			}

		}

	});
});