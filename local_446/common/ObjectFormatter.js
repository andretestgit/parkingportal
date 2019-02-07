sap.ui.define([], function () {
    "use strict";
    $.sap.getObject("edu.mit.parking.formatter", 0);
    edu.mit.parking.formatter = {
        getName: function (value) {
            var sPath = this.getBindingContext("sessionData").sPath;
            var oEntry = this.oModel.getProperty(sPath);
        },
        getLotSelected: function (sSelected) {
            return this.getBindingContext().oModel.getProperty(this.getBindingContext().sPath).id == sSelected;
        },
        getVehicleTitle: function (sPlateNumber) {
            var sPath = this.getBindingContext("sessionData").getPath().split("/vehicles")[0],
                oModel = this.getBindingContext("sessionData").getModel().getProperty(sPath),
                oVehicles = oModel.vehicles,
                iVehicles = 0,
                iTempVehicles = 0;

            // if(oModel.maxNumberOfVehicles > 1) {
            for (var i in oVehicles) {
                if (oVehicles[i].temporary) {
                    iTempVehicles++;
                } else {
                    iVehicles++;
                }
                if (sPlateNumber === oVehicles[i].plateNumber) {
                    if (oVehicles[i].temporary) {
                        return "Temporary Vehicle " + iTempVehicles;
                    } else {
                        return "Vehicle " + iVehicles;
                    }
                }
            }
            // }
            // return "";
        },
        getRemoveVehicleVisibility: function (sPlateNumber, bCanRemove) {
            var sPath = this.getBindingContext("sessionData").getPath().split("/vehicles")[0],
                oModel = this.getBindingContext("sessionData").getModel().getProperty(sPath),
                oVehicles = oModel.vehicles,
                iVehicles = 0,
                iTempVehicles = 0;
            if (!bCanRemove) {
                return false;
            } else {
                // for (var i in oVehicles) {
                //     if (oVehicles[i].temporary) {
                //         iTempVehicles++;
                //     } else {
                //         iVehicles++;
                //     }
                //     if (sPlateNumber === oVehicles[i].plateNumber) {
                //         if (oVehicles[i].temporary) {
                //             return true;
                //         } else if (oModel.maxNumberOfVehicles === 1) {
                //             return false;
                //         }
                //     }
                // }
                return true;
            }
        },
        getPermitValidityText: function (sPermitTypeId, sStartDate, sEndDate) {
            if (this.getBindingContext("sessionData") !== undefined) {
                var sPath = this.getBindingContext("sessionData").getPath(),
                    oModel = this.getBindingContext("sessionData").getModel().getProperty(sPath),
                    aDate, sPermitId, sMonthEnd, sReturn="", bCanCancel=false;
                if (oModel) {
                    //sPermitId = oModel.permitId;     
                    sPath = sPath.substring(1).replace("/", "-")
                    if (sStartDate) {
                        sStartDate += "";
                        aDate = sStartDate.split("-");
                        sStartDate = parseInt(aDate[1]) + "/" + parseInt(aDate[2]) + "/" + parseInt(aDate[0]);
                    }
                    if (sEndDate) {
                        sEndDate += "";
                        aDate = sEndDate.split("-");
                        sEndDate = parseInt(aDate[1]) + "/" + parseInt(aDate[2]) + "/" + parseInt(aDate[0]);
                        sMonthEnd = new Date();
                        sMonthEnd = sMonthEnd.getMonth() + 2; // Check if end dates month is >= to this
                        bCanCancel = sEndDate.split("/")[0] >= sMonthEnd;

                    }

                   

                    if (sEndDate == "12/31/2099") {
                        if(sPermitTypeId == 13) {
                            return "<span class='list-content-text'>Valid from " + sStartDate + ". To cancel, contact the Parking & Transportation Office.</span>";
                        } else {
                            return "<span class='list-content-text'>Valid from " + sStartDate + " until you </span><a href='#cancelPermit/" + sPath + "' target='_self'>cancel</a>";
                        }
                        
                        // return this.getTranslation("Permit.Text.ValidFromCancel", [this.formatter.getDateWithYear(sStartDate), sPermitId]);
                    } else if(bCanCancel) {
                        if(sPermitTypeId == 13) {
                            return "<span class='list-content-text'>Valid from " + sStartDate + " to " + sEndDate + ". To cancel sooner, contact the Parking & Transportation Office.</span>";
                        } else {
                            return "<span class='list-content-text'>Valid from " + sStartDate + " to " + sEndDate + ". </span><a href='#cancelPermit/" + sPath + "' target='_self'>Cancel</a> sooner.";
                        }
                    }                     
                    else if (sStartDate && sEndDate) {
                        return " <span class='list-content-text'>Valid from " + sStartDate + " until " + sEndDate + " </span>";
                        // return this.getTranslation("Permit.Text.ValidFromTo", [this.formatter.getDateWithYear(sStartDate),this.formatter.getDateWithYear(sEndDate)]);
                    } else {
                        if(sPermitTypeId == 13) {
                            return "<span class='list-content-text'>To cancel, contact the Parking & Transportation Office.</span>";
                        } else {
                            return "<a href='#cancelPermit/" + sPath + "' target='_self'>Cancel</a><span class='list-content-text'> permit request</span>";
                        }
                        
                    }
                }
            }
        },
    };
});