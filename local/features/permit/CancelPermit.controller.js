sap.ui.define([
	"edu/mit/parking/common/BaseController",
	"sap/ui/model/json/JSONModel",
	"edu/mit/parking/common/formatter"
], function(BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("edu.mit.parking.features.permit.CancelPermit", {
		formatter: formatter,
		/* =========================================================== */
		/* lifecycle methods                                         */
		/* =========================================================== */
		onInit: function() {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass()); //add syling class based on device
			/*this.getView().setBusy(true);
			this.getOwnerComponent().getModel("jcc").attachMetadataLoaded(function(oEvent) { //Set screen to not busy once meta data has been loaded
				this.getView().setBusy(false);
			}.bind(this));*/

			this.getRouter().getRoute("dashboard").attachMatched(this._onRouteMatched, this); //triggered every time view is navigated to

		},

		onBeforeRendering: function() {

		},

		onAfterRendering: function() {
			
		},

		/* =========================================================== */
		/* public methods                                         */
		/* =========================================================== */

		/* =========================================================== */
		/* event handlers                                         */
		/* =========================================================== */
		/**
		 * Make call to cancel permit
		 * @param {sap.ui.base.Event} oEvent : press event
		 * @public
		 */
		onPressCancelPermit: function(oEvent) {
			
		},
		

		/* =========================================================== */
		/* private methods                                         */
		/* =========================================================== */
		/**
		 * Fires every time route is matched to this view
		 * @param {sap.ui.base.Event} oEvent : Routing event
		 * @private
		 */
		_onRouteMatched: function(oEvent) {}

	});
});