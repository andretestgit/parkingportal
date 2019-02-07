sap.ui.define([
	"edu/mit/parking/common/BaseController",
	"sap/ui/model/json/JSONModel",
	"edu/mit/parking/common/formatter",
	"edu/mit/parking/common/CustomTypes"
], function (BaseController, JSONModel, formatter, CustomTypes) {
	"use strict";

	return BaseController.extend("edu.mit.parking.features.permit.CancelPermit", {
		formatter: formatter,
		customTypes: CustomTypes,
		/* =========================================================== */
		/* lifecycle methods                                         */
		/* =========================================================== */
		onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass()); //add syling class based on device
			/*this.getView().setBusy(true);
			this.getOwnerComponent().getModel("jcc").attachMetadataLoaded(function(oEvent) { //Set screen to not busy once meta data has been loaded
				this.getView().setBusy(false);
			}.bind(this));*/

			this.getRouter().getRoute("cancelPermit").attachMatched(this._onRouteMatched, this); //triggered every time view is navigated to
			this.viewModel = new sap.ui.model.json.JSONModel({
				flags: {
					busy: false
				}});
			this.getView().setModel( this.viewModel);

			// sap.ui.getCore().attachFormatError(function (oEvent) {
			// 	oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.Error);
			// 	debugger;
			// });
			// sap.ui.getCore().attachValidationError(function (oEvent) {
			// 	oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.Error);
			// 	debugger;
			// });
			// sap.ui.getCore().attachValidationSuccess(function (oEvent) {
			// 	oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.None);
			// 	debugger;
			// });

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
		 * Make call to cancel permit
		 * @param {sap.ui.base.Event} oEvent : press event
		 * @public
		 */
		onPressCancelPermit: function (oEvent) {
			this.viewModel.setProperty("/flags/busy", true);
			this.getService().cancelPermit(this.sPermitId, function(oData,sMessage){
				this.viewModel.setProperty("/flags/busy", false);
				this._reInitializeData();
				this.getRouter().navTo("dashboard");
			}.bind(this),
			function(oError) {
				this._showValidationErrorMessageItems(oError);
			}.bind(this));

		},

		onTestValidator: function (oEvent) {

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
			var sPath = oEvent.getParameter("arguments").sId !== '0' ? sPath = "/"+ oEvent.getParameter("arguments").sId.replace("-", "/") : sPath = 0,
				oModel	= this._getModel("sessionData").getProperty(sPath);
				if(oModel) {
					this.sPermitId = oModel.permitId;
					this.getView().bindElement({model: "sessionData", path: sPath});		
				} else {
					if(sPath != 0)
						this.getRouter().navTo("dashboard");
				}
			
		}

	});
});