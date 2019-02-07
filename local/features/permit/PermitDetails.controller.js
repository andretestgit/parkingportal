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
			//nav to partner permit view

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
			this.getView().bindElement({
				model: "sessionData",
				path: "/permits/" + this.sPermitIndex
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
							this._removeVehicle();
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
		}
	});
});