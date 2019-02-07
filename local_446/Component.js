sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"edu/mit/parking/common/models",
	"edu/mit/parking/common/ObjectFormatter"
], function (UIComponent, Device, models, ObjectFormatter) {
	"use strict";

	return UIComponent.extend("edu.mit.parking.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			//set the global model
			this.setModel(models.createSessionDataModel(), "sessionData");

			//set the string model. This will allow you to pass in static values into formatter function 
			this.setModel(models.createStringModel(), "string");

			//set lookup model
			this.setModel(models.createLookupsModel(), "lookups");

			//initialize router
			this.getRouter().initialize();
		},

		/**
		 * Returns class bases on device type
		 * @public
		 */
		getContentDensityClass: function () {
			if (!this._sContentDensityClass) {
				if (!sap.ui.Device.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}
	});
});