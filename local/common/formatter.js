sap.ui.define([], function () {
    "use strict";
    return {
        dashboardPermitCostPerDay: function (iCostPerDay) {
            return this.getTranslation("Dashboard.text.CostPerDay", [iCostPerDay]);
        },
        dashboardVehicleNumber: function (sPlateNumber) {
            var oPermits = this._getModel("sessionData").getProperty("/permits"),
                iVehicles,
                iTempVehicles,
                oVehicles;
            for (var x in oPermits) {
                iVehicles = 0;
                iTempVehicles = 0;
                oVehicles = oPermits[x].vehicles;
                for (var i in oVehicles) {
                    if (oVehicles[i].temporary) {
                        iTempVehicles++;
                    } else {
                        iVehicles++;
                    }
                    if (sPlateNumber === oVehicles[i].plateNumber) {
                        if (oVehicles[i].temporary) {
                            return this.getTranslation("Dashboard.text.TempVehicleNumber", iTempVehicles);
                        } else {
                            return this.getTranslation("Dashboard.text.VehicleNumber", iVehicles);
                        }
                    }
                }
            }
        },
        departmentVehicleNumber: function (sPlateNumber, x) {
            var oPermits = this._getModel("sessionData").getProperty("/coordinator/departmentPermits"),
                iVehicles,
                iTempVehicles,
                oVehicles;
            for (var x in oPermits) {
                iVehicles = 0;
                iTempVehicles = 0;
                oVehicles = oPermits[x].vehicles;
                for (var i in oVehicles) {
                    if (oVehicles[i].temporary) {
                        iTempVehicles++;
                    } else {
                        iVehicles++;
                    }
                    if (sPlateNumber === oVehicles[i].plateNumber) {
                        if (oVehicles[i].temporary) {
                            return this.getTranslation("Dashboard.text.TempVehicleNumber", iTempVehicles);
                        } else {
                            return this.getTranslation("Dashboard.text.VehicleNumber", iVehicles);
                        }
                    }
                }
            }
        },
        dashboardPermitTitle: function (sPermitId) {
            var oPermits = this._getModel("sessionData").getProperty("/permits"),
                oVehicles;
            for (var x in oPermits) {
                if (oPermits[x].permitId === sPermitId) {
                    sPermitId = x + 1;
                }
            }
            if (sPermitId > 1) {
                return this.getTranslation("Dashboard.Text.SpousePartnerPermit");
            }
            return this.getTranslation("Dashboard.Text.MyPermit");

        },
        getBillingMonth: function (sStart) {
            var iMonth = sStart.toString().split("-")[1] - 1;
            switch (iMonth) {
                case 1:
                    return this.getTranslation("Month.Text.January");
                    break;
                case 2:
                    return this.getTranslation("Month.Text.February");
                    break;
                case 3:
                    return this.getTranslation("Month.Text.March");
                    break;
                case 4:
                    return this.getTranslation("Month.Text.April");
                    break;
                case 5:
                    return this.getTranslation("Month.Text.May");
                    break;
                case 6:
                    return this.getTranslation("Month.Text.June");
                    break;
                case 7:
                    return this.getTranslation("Month.Text.July");
                    break;
                case 8:
                    return this.getTranslation("Month.Text.August");
                    break;
                case 9:
                    return this.getTranslation("Month.Text.September");
                    break;
                case 10:
                    return this.getTranslation("Month.Text.October");
                    break;
                case 11:
                    return this.getTranslation("Month.Text.November");
                    break;
                case 12:
                    return this.getTranslation("Month.Text.December");
                    break;
            }
        },
        getDateObject: function (inDate) {
            var outDate = inDate;
            if (inDate instanceof Date === false) {
                if (inDate && inDate.toString().indexOf("/") !== -1) { //assume it is mm/dd/yyyy
                    var parts = inDate.split("/");
                    outDate = new Date(parts[2], parts[0] - 1, parts[1]);
                } else if (inDate && inDate.toString().indexOf("-") !== -1 && inDate.toString().indexOf("-") < 10) {
                    var from = inDate.toString().split("-");
                    outDate = new Date(from[0], from[1] - 1, from[2]);
                }
            }
            return outDate;
        },
        getTypeOfVehicle: function (bTempVehicle) {
            if (bTempVehicle) {
                return this.getTranslation("Vehicle.Text.TemporaryVehicle");
            }
            return this.getTranslation("Vehicle.Text.Vehicle");
        },
        getAddVehicleLinkText: function (iVehicleNumber) {
            if (iVehicleNumber > 1) {
                return this.getTranslation("Global.Link.Remove");
            }
            return this.getTranslation("Global.Link.AddAnotherVehicle");
        },
        vehicleTitle: function (bTempVehicle) {
            if (bTempVehicle) {
                return this.getTranslation("Vehicle.Text.AddaTempVehicle");
            }
            return this.getTranslation("Vehicle.Text.AddaVehicle");
        },
        getDateWithYear: function (sDate) {
            if (sDate) {
                if (sDate.indexOf("T") > 0) {
                    sDate = sDate.split("T")[0];
                }
                sDate += "";
                var aDate = sDate.split("-");
                return parseInt(aDate[1]) + "/" + parseInt(aDate[2]) + "/" + parseInt(aDate[0]);
            }
        },
        getDateWithoutYear: function (sDate) {
            if (sDate) {
                if (sDate.indexOf("T") > 0) {
                    sDate = sDate.split("T")[0];
                }
                sDate += "";
                var aDate = sDate.split("-");
                return parseInt(aDate[1]) + "/" + parseInt(aDate[2]);
            }
        },
        getDailyActivity: function (sType, sLprHitTime, sGateEntryTime, sGateExitTime) {
            var sTime;
            if (sType === "GATE") {
                sTime = this.formatter.getStandardTime(sGateEntryTime) + " - " + this.formatter.getStandardTime(sGateExitTime);
                if (sTime !== "Overnight - Overnight") {
                    return sTime;
                }
                return "All Day";
            } else {
                return this.formatter.getStandardTime(sLprHitTime);
            }
        },
        getStandardTime: function (sTime) {
            if (sTime) {
                if (sTime.indexOf("T") > 0) {
                    sTime = sTime.split("T")[1];
                }
                var sPostFix;
                var sHours = parseInt(sTime.split(":")[0]);
                var sMinutes = sTime.split(":")[1];
                if (sHours < 13) {
                    sPostFix = "am";
                } else {
                    sPostFix = "pm";
                    sHours = sHours - 12;
                }
                return sHours + ":" + sMinutes + sPostFix;
            } else {
                return "Overnight"
            }
        },
        getTicketCountText: function (sStatus) {
            if (sStatus === "ISSUED") {
                return this.getTranslation("Dashboard.Text.OpenParkingViolations");
            }
            return this.getTranslation("Dashboard.Text.PendingAppeals");
        },

        getTicketStatus: function (sStatus) {
            switch (sStatus) {
                case "ISSUED":
                    return this.getTranslation("Ticket.Text.Issued");
                    break;
                case "PAID":
                    return this.getTranslation("Ticket.Text.Paid");
                    break;
                case "APPEALED":
                    return this.getTranslation("Ticket.Text.Appealed");
                    break;
                case "ADJUDICATION_APPROVED":
                    return this.getTranslation("Ticket.Text.AdjuicationApproved");
                    break;
            }
        },

        getDeductionType: function (sDeduction) {
            switch (sDeduction) {
                case "PAYROLL":
                    return this.getTranslation("Dashboard.Text.Payroll");
                    break;
                case "BURSAR":
                    return this.getTranslation("Dashboard.Text.Bursar");
                    break;
                case "CREDIT":
                    return this.getTranslation("Dashboard.Text.Credit");
                    break;
                case "NONE":
                    return "";
                    break;
            }
        },
        getLicenseString: function (oVehicles) {
            var sReturn = "";
            if (!oVehicles) {
                return this.getTranslation("Permit.Text.NoPermit");
            }

            for (var x in oVehicles) {
                sReturn += oVehicles[x].plateNumber;
                if (x < oVehicles.length - 1) {
                    sReturn += ", "
                } else {
                    return sReturn;
                }
            }
        },

        getCurrency: function (sValue) {
            if (sValue) {
                if (sValue.toString().indexOf(".") >= 0) {
                    sValue = parseFloat(sValue).toFixed(2)
                }
            }
            return sValue;
        },

        getOpenBilling: function (sStart, sEnd) {
            var oToday = new Date();
            if (sStart.toString().split("-")[1] == oToday.getMonth() + 1) {
                return true;
            }
            return false;
            /*  oToday.setHours(0);
             oToday.setMinutes(0);
             sStart = new Date(sStart.split("-")[0], sStart.split("-")[1] - 1, sStart.split("-")[2]);
             sEnd = new Date(sEnd.split("-")[0], sEnd.split("-")[1] - 1, sEnd.split("-")[2]);
             if (oToday >= sStart && oToday <= sEnd) {
                 return true;
             }
             return false; */
        },
        getBillingPeriodAmount: function (sValue, sStart, sEnd) {
            if (this.formatter.getOpenBilling(sStart, sEnd)) {
                return "TBD";
            }
            return "$" + this.formatter.getCurrency(sValue);
        },
        getNewPermitDetailsTitle: function (sVehicleNumber) {
            return this.getTranslation("NewPermit.Text.VehicleTitle", [sVehicleNumber]);
        },

        getVehicleImage: function (sBodyType) {
            if (sBodyType == "MOTORCYCLE") {
                return "local/images/motorcycle.png";
            }
            return "local/images/car.png";
        },

        //This is how you set up a formatter that will give a refference to the control allowing you to get its binding context
        /*  $.sap.getObject("edu.mit.parking.formatter", 0);
			edu.mit.parking.formatter = {
				departmentVehicleNumber: function(sPlatNumber) {
					var iVehicles = 0,
					 iTempVehicles = 0,
					 sPath = this.getBindingContext("sessionData").sPath.split("vehicles/") + "vehicles",
					 oVehicles = this.getBindingContext("sessionData").oModel.getProperty(sPath),
					 oVehicles;
					 for(var x in oVehicles) {
						if (oVehicles[i].temporary) {
							iTempVehicles++;
						} else {
							iVehicles++;
						}
						if (sPlateNumber === oVehicles[i].plateNumber) {
							if (oVehicles[i].temporary) {
								return this.getTranslation("Dashboard.text.TempVehicleNumber", iTempVehicles);
							} else {
								return this.getTranslation("Dashboard.text.VehicleNumber", iVehicles);
							}
						}
					 }
					 

				}
			}; */
    };
});