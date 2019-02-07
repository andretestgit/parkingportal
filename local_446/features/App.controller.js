sap.ui.define([
	"edu/mit/parking/common/BaseController",
	"sap/ui/model/json/JSONModel",
	"edu/mit/parking/common/formatter"
], function(BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("edu.mit.parking.features.App", {
		formatter: formatter,
		iTicketsSelected: 0,
		iTicketTotal: 0,
		viewModel: null,
		firstLoad: true,
		/* =========================================================== */
		/* lifecycle methods                                         */
		/* =========================================================== */
		onInit: function() {

		},

		onBeforeRendering: function() {
			this._initializeData();
		},

		onAfterRendering: function() {
			// var sType = this._getModel("sessionData").getProperty("/user/type"),
			//     oPage = this.getView().getContent()[0],
			//     oFragment;
			// if (window.location.href.indexOf("coordinator") > 0) {
			//     this._getModel("sessionData").setProperty("/user/type", "COORDINATOR");
			//     sType = "COORDINATOR";
			// }

			// if (sType === "COORDINATOR") {
			//     oFragment = sap.ui.xmlfragment("edu.mit.parking.features.fragments.CoordinatorHeader", this);
			//     this._getModel("sessionData").setProperty("/coordinator-header", oFragment);
			// } else {
			//     oFragment = sap.ui.xmlfragment("edu.mit.parking.features.fragments.Header", this);
			// }
			// oPage.setCustomHeader(oFragment);
			// //this.byId("page").setBusy(true);
		},

		/* =========================================================== */
		/* public methods                                         */
		/* =========================================================== */

		/* =========================================================== */
		/* event handlers                                         */
		/* =========================================================== */
		/**
		 * Switch between user and coordinator views
		 * @param {sap.ui.base.Event} oEvent : Button Press
		 * @public
		 */
		topHeaderActionPressed: function(oEvent) {
			var sOption = oEvent.getParameters().item.getText(),
				oPage = this.getView().getContent()[0],
				oFragment;
			if (sOption == "User") {
				oFragment = sap.ui.xmlfragment("edu.mit.parking.features.fragments.Header", this);
				this._getModel("sessionData").setProperty("/user/type", "USER");
			} else {
				oFragment = sap.ui.xmlfragment("edu.mit.parking.features.fragments.CoordinatorHeader", this);
				this._getModel("sessionData").setProperty("/user/type", "COORDINATOR");
			}
			oPage.setCustomHeader(oFragment);
			this.getRouter().navTo("dashboard");
		},

		/* =========================================================== */
		/* private methods                                         */
		/* =========================================================== */
		/**
		 * If first time loading view, select first item
		 * @param {sap.ui.base.Event} oEvent : Routing event
		 * @private
		 */
		_onRouteMatched: function(oEvent) {

		},

		// _initializeData: function() {
		

		// }

	});
});