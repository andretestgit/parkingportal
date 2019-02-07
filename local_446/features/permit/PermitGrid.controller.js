sap.ui.define([
	"edu/mit/parking/common/BaseController",
	"edu/mit/parking/common/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (BaseController, formatter, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("edu.mit.parking.features.permit.PermitGrid", {
		formatter: formatter,
		firstLoad: true,
		/* =========================================================== */
		/* lifecycle methods                                         */
		/* =========================================================== */
		onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass()); //add syling class based on device
			/*this.getView().setBusy(true);
			this.getOwnerComponent().getModel("jcc").attachMetadataLoaded(function(oEvent) { //Set screen to not busy once meta data has been loaded
				this.getView().setBusy(false);
			}.bind(this));*/
			this.getRouter().getRoute("permitGrid").attachMatched(this._onRouteMatched, this); //triggered every time view is navigated to
			this.viewModel = new JSONModel({
				permitGrid: []
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


		/* =========================================================== */
		/* private methods                                         */
		/* =========================================================== */
		/**
		 * Fires every time route is matched to this view
		 * @param {sap.ui.base.Event} oEvent : Routing event
		 * @private
		 */
		_onRouteMatched: function (oEvent) {
			if (this.firstLoad) {
				this.firstLoad = false;
				this.getService().getPermitGrid(function (oData) {
						this.viewModel.setProperty("/permitGrid", oData.items);

					}.bind(this),
					function (oError) {

					}.bind(this))
			}


		},

	});
});