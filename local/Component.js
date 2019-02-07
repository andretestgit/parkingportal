sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"edu/mit/parking/common/models"
], function(UIComponent, Device, models) {
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
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			//set the global model
			this.setModel(models.createSessionDataModel(), "sessionData");
			
			//set lookup model
			this.setModel(models.createLookupsModel(), "lookups");
            
            //initialize router
			this.getRouter().initialize();
		},
		
		/**
		 * Returns class bases on device type
		 * @public
		 */
		getContentDensityClass : function() {
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