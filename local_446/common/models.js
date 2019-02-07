sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createLookupsModel: function() {
			var oModel = new JSONModel({
				vehicle: {

				},
				busyFlags: {
					vehicle: true
				},
				carpool: [{
					id: "AMHERST",
					text: "Amherst Street"
				}, {
					id: "HAYWARD",
					text: "Hayward Lot"
				}, {
					id: "MAIN",
					text: "Main Lot"
				}, {
					id: "NORTHEAST",
					text: "Northeast Area"
				}, {
					id: "NORTHWEST",
					text: "Northwest Area"
				}, {
					id: "SLOAN",
					text: "Sloan Area"
				}, {
					id: "WESTGATE",
					text: "Westgate Area"
				}]
			});
			return oModel;
		},

		createStringModel: function() {
			var oModel = new JSONModel({});
			oModel.getProperty = function(sPath) {
				return sPath;
			};
			return oModel;
		},

		createSessionDataModel: function() {
			var oModel = new JSONModel({
				environment: "",
				busyFlags: {
					billing: true,
					ticketCount: true,
					permits: true,
					carpool: true,
					auth: true
				},
				test: {
					x : true,
					y: true,
					v : true
				},
				auth: {
					BILLING_FEATURE_ENABLED: false,
					CAN_REQUEST_PERMIT: false,
					CAN_REQUEST_SPOUSE_PERMIT: false,
					TICKETS_FEATURE_ENABLED: false,
					CAN_SWITCH_TO_CARPOOL: false
				},
				showRequestParkingButton: false,
				callBackBanners: [],
				banners: [
					// {
					// 	id: "1",
					// 	type: "I",
					// 	header: "Information",
					// 	message: "This is information text This is information textThis is information textThis is information textThis is information textThis is information textThis is information textThis is information textThis is information textThis is information textThis is information textThis is information textThis is information textThis is information textThis is information textThis is information textThis is information textThis is information text",
					// 	cancel: true
					// }
					// {
					// 	id: "2",
					// 	type: "S",
					// 	header: "Request Submitted",
					// 	message: "Please note that you cannot park on campus until you recive an email confirming your permit is active",
					// 	cancel: true
					// },
					// {
					// 	id: "3",
					// 	type: "P",
					// 	header: "Pending Permit Request",
					// 	message: "You will receive a notification when your request has been processed and a lot has been assigned",
					// 	cancel: false
					// }
				],
				permits: [
					// {
				// 	permitId: 1,
				// 	location: "East Gate",
				// 	permitFee: 100,
				// 	type: "MONTHLY",
				// 	cost: 158,
				// 	costCap: 0,
				// 	runningBalance: 0,
				// 	startDate: "2017-09-12",
				// 	endDate: "2018-08-30",
				// 	email: "",
				// 	phone: "",
				// 	paymentInformation: {
				// 		text: "Payroll Deduction",
				// 		type: "PAYROLL"
				// 	},
				// 	maxNumberOfVehicles: 1,
				// 	maxNumberOfTempVehicles: 1,
				// 	vehicles: [{
				// 		vehicleId: "xxxx",
				// 		makeText: "Nissan",
				// 		modelText: "350z",
				// 		year: "2015",
				// 		colorText: "Grey",
				// 		plateNumber: "PK785Y",
				// 		plateState: "MA",
				// 		bodyType: "VEHICLE",
				// 		temporary: false,
				// 		startDate: "",
				// 		endDate: ""
				// 	}]
				// }, {
				// 	permitId: 2,
				// 	type: "Occasional",
				// 	permitFee: 100,
				// 	type: "MONTHLY",
				// 	cost: 158,
				// 	costCap: 0,
				// 	runningBalance: 0,
				// 	startDate: "2017-09-12",
				// 	endDate: "2018-08-30",
				// 	email: "test@mit.edu",
				// 	phone: "770-825-0687",
				// 	paymentInformation: {
				// 		text: "Payroll Deduction",
				// 		type: "PAYROLL"
				// 	},
				// 	maxNumberOfVehicles: 1,
				// 	maxNumberOfTempVehicles: 1,
				// 	vehicles: [{
				// 		makeText: "Honda",
				// 		modelText: "Accord",
				// 		year: "2018",
				// 		colorText: "Grey",
				// 		plateNumber: "GH598K",
				// 		plateState: "MA",
				// 		bodyType: "VEHICLE",
				// 		temporary: false,
				// 		startDate: "",
				// 		endDate: ""
				// 	}]
				// }
				],
				tickets: [
				// 	{
				// 	"ticketId": "123",
				// 	"accountId": "321",
				// 	"ticketNumber": "A123",
				// 	"violationDate": "2018-04-05T11:05:16",
				// 	"description": "Double parked",
				// 	"amount": 30,
				// 	"status": "ADJUDICATION_APPROVED",
				// 	"location": "Riverside",
				// 	"canAppeal": false,
				// 	"vehicle": {
				// 		"make": "Nissan",
				// 		"model": "Versa",
				// 		"year": 2015,
				// 		"color": "White",
				// 		"plateNumber": "ABC-85K",
				// 		"plateState": "MA",
				// 		"bodyType": "VEHICLE"
				// 	},
				// 	"attachments": [{
				// 		"attachmentId": "123667",
				// 		"mimeType": "image/jpeg",
				// 		"filename": "test.jpg"
				// 	}]
				// }, {
				// 	"ticketId": "123",
				// 	"accountId": "321",
				// 	"ticketNumber": "A123",
				// 	"violationDate": "2018-04-01T09:30:16",
				// 	"description": "Parked in front of fire hydrant",
				// 	"amount": 300,
				// 	"status": "PAID",
				// 	"location": "Riverside",
				// 	"canAppeal": false,
				// 	"vehicle": {
				// 		"make": "Nissan",
				// 		"model": "Versa",
				// 		"year": 2015,
				// 		"color": "White",
				// 		"plateNumber": "ABC-85K",
				// 		"plateState": "MA",
				// 		"bodyType": "VEHICLE"
				// 	},
				// 	"attachments": [{
				// 		"attachmentId": "123667",
				// 		"mimeType": "image/jpeg",
				// 		"filename": "test.jpg"
				// 	}]
				// }, {
				// 	"ticketId": "123",
				// 	"accountId": "321",
				// 	"ticketNumber": "A123",
				// 	"violationDate": "2018-01-07T13:30:16",
				// 	"description": "Not parked in parking spot",
				// 	"amount": 50,
				// 	"status": "APPEALED",
				// 	"location": "Riverside",
				// 	"canAppeal": false,
				// 	"vehicle": {
				// 		"make": "Nissan",
				// 		"model": "Versa",
				// 		"year": 2015,
				// 		"color": "White",
				// 		"plateNumber": "ABC-85K",
				// 		"plateState": "MA",
				// 		"bodyType": "VEHICLE"
				// 	},
				// 	"attachments": [{
				// 		"attachmentId": "123667",
				// 		"mimeType": "image/jpeg",
				// 		"filename": "test.jpg"
				// 	}]
				// }, {
				// 	"ticketId": "123",
				// 	"accountId": "321",
				// 	"ticketNumber": "A123",
				// 	"violationDate": "2018-04-23T08:45:16",
				// 	"description": "No permit for lot",
				// 	"amount": 150,
				// 	"status": "ISSUED",
				// 	"location": "W92",
				// 	"canAppeal": true,
				// 	"vehicle": {
				// 		"make": "Nissan",
				// 		"model": "Versa",
				// 		"year": 2015,
				// 		"color": "White",
				// 		"plateNumber": "ABC-85K",
				// 		"plateState": "MA",
				// 		"bodyType": "VEHICLE"
				// 	},
				// 	"attachments": [{
				// 		"attachmentId": "123667",
				// 		"mimeType": "image/jpeg",
				// 		"filename": "test.jpg"
				// 	}]
				// }
				],
				ticketCount: [
				// 	{
				// 	state: "ISSUED",
				// 	count: 0
				// }, {
				// 	state: "APPEALED",
				// 	count: 0
				// }
				],
				user: {
					kerb: "",
					firstName: "",
					lastName: "",
					livesOnCampus: false,
					graduateStudent: false,
					type: "USER",
					vip: false,
					activePermit: true
				},
				billing: {
					deductionType: "PAYROLL",
					items: [
					// 	{
					// 	"periodStartDate": "2018-10-15",
					// 	"periodEndDate": "2018-10-31",
					// 	"billingDate": "2018-11-15",
					// 	"amount": 30.00,
					// 	"billingFrequency": "DAILY",
					// 	"deductionType": "PAYROLL",
					// 	"isOpen": true,
					// 	"isPaid": false,
					// 	"status": "FAILURE",
					// 	transactions: [{
					// 		"type": "PAYMENT",
					// 		"date": "2018-09-30",
					// 		"description": "Payroll deduction (paycheck 10/15/2018)",
					// 		"amount": 100.00,
					// 	}, {
					// 		"type": "ADJUSTMENT",
					// 		"date": "2018-09-23",
					// 		"description": "Overcharged last month",
					// 		"amount": -250.00
					// 	}, {
					// 		"type": "PARKING_FEE",
					// 		"date": "2018-09-22",
					// 		"description": "Daily Parking Fee",
					// 		"amount": 10.00,
					// 		parkingActivity: [{
					// 			"date": "2018-09-21",
					// 			"lotName": "Riverside",
					// 			"type": "GATE",
					// 			"gateEntryTime": "08:45:00",
					// 			"gateExitTime": "11:35:00",
					// 			"lprHitTime": null
					// 		}, {
					// 			"date": "2018-09-21",
					// 			"lotName": "Riverside",
					// 			"type": "GATE",
					// 			"gateEntryTime": "13:30:00",
					// 			"gateExitTime": "14:30:00",
					// 			"lprHitTime": null
					// 		}, {
					// 			"date": "2018-09-21",
					// 			"lotName": "Riverside",
					// 			"type": "LPR",
					// 			"gateEntryTime": null,
					// 			"gateExitTime": null,
					// 			"lprHitTime": "15:24:00"
					// 		}]
					// 	}, {
					// 		"type": "PERMIT_FEE",
					// 		"date": "2018-09-21",
					// 		"description": "Annual Permit Fee",
					// 		"amount": 100.00
					// 	}]
					// }, {
					// 	"periodStartDate": "2018-10-01",
					// 	"periodEndDate": "2018-10-14",
					// 	"billingDate": "2018-11-01",
					// 	"amount": 110.00,
					// 	"billingFrequency": "DAILY",
					// 	"deductionType": "PAYROLL",
					// 	"isOpen": false,
					// 	"isPaid": false,
					// 	"status": "PENDING"
					// }, {
					// 	"periodStartDate": "2018-09-15",
					// 	"periodEndDate": "2018-09-30",
					// 	"billingDate": "2018-10-15",
					// 	"amount": 140.00,
					// 	"billingFrequency": "DAILY",
					// 	"deductionType": "PAYROLL",
					// 	"isOpen": false,
					// 	"isPaid": true,
					// 	"status": "SUCCESS"
					// }, {
					// 	"periodStartDate": "2018-09-01",
					// 	"periodEndDate": "2018-09-14",
					// 	"billingDate": "2018-10-01",
					// 	"amount": 90.00,
					// 	"billingFrequency": "DAILY",
					// 	"deductionType": "PAYROLL",
					// 	"isOpen": false,
					// 	"isPaid": true,
					// 	"status": "SUCCESS"
					// }
					]
				},
				dashboard: {
					billing: {
						items: []
					}
				},
				helperSets: {
					ticketType: [{
						id: "ALL",
						text: "All"
					}, {
						id: "ISSUED",
						text: "Issued"
					}, {
						id: "Paid",
						text: "Paid"
					}, {
						id: "APPEALED",
						text: "Appealed"
					}, {
						id: "ADJUDICATION_APPROVED",
						text: "Appeal Approved"
					}],
					accountHistoryType: [{
						id: "ALL",
						text: "All"
					}, {
						id: "PERMIT_FEE",
						text: "Permit Fee"
					}, {
						id: "PARKING_FEE",
						text: "Parking Fee"
					}, {
						id: "ADJUSTMENT",
						text: "Adjustment"
					}, {
						id: "PAYMENT",
						text: "Payment"
					}],
					accountTimeframe: [{
						id: "ALL",
						text: "All"
					}]
				},
				permitsModel: [{
						"id": "EMPLOYEE",
						"title": "Request Parking: Employee",
						"paymentOptions": {
							"payroll": true,
							"studentAccount": false,
							"creditCardCard": true,
							"journalVoucher": false
						},
						"permitType": [{
							"permitTypeId": "PERSONAL",
							"text": "Personal",
							"headerText": "",
							"locationHeaderText": "I work in",
							"location": "W92",
							"showLocation": true,
							"locationUrl": "",
							"editLocation": true,
							"defaultValidity": "U",
							"economyPermitTypeId": "",
							"economyFeeDetails": {
								"dailyFee": 5,
								"recurringFee": 0,
								"recurringFrequency": "Y",
								"annualCap": 950,
							},
							"permitFeeDetails": {
								"dailyFee": 10,
								"recurringFee": 0,
								"recurringFrequency": "Y",
								"annualCap": 1900
							},
							"requirePhoneNumber": false,
							"requireEmail": false,
							"minNumberOfVehicles": 1,
							"maxNumberOfVehicles": 3,
							"electricVehicleDiscount": true,
							"freeOffHours": true,
							"carpool": false,
							"carpoolInvitation": false,
							"carpoolMembers": []
						}, {
							"permitTypeId": "CARPOOL",
							"text": "Carpool",
							"headerText": "",
							"locationHeaderText": "I would like to park close to",
							"location": "",
							"locationUrl": "",
							"showLocation": true,
							"editLocation": true,
							"defaultValidity": "U",
							"economyPermitTypeId": "",
							"economyFeeDetails": {},
							"permitFeeDetails": {
								"dailyFee": 0,
								"recurringFee": 950,
								"recurringFrequency": "M",
								"annualCap": 0
							},
							"requirePhoneNumber": false,
							"requireEmail": false,
							"minNumberOfVehicles": 0,
							"maxNumberOfVehicles": 3,
							"electricVehicleDiscount": false,
							"freeOffHours": true,
							"carpool": true,
							"carpoolInvitation": false,
							"carpoolMemebers": []
						}]
					}, {
						"id": "STUDENT_COMMUTER",
						"title": "Request Parking: Student Commuter",
						"paymentOptions": {
							"payroll": false,
							"studentAccount": true,
							"creditCardCard": true,
							"journalVoucher": false
						},
						"permitType": [{
							"permitTypeId": "PERSONAL",
							"text": "Personal",
							"headerText": "",
							"locationHeaderText": "Assigned Lot",
							"location": "Westgate",
							"locationUrl": "https://whereis.mit.edu/?zoom=18&lat=42.35555513653314&lng=-71.10191344451903&maptype=mit&q=westgate%20parking&open=-1",
							"showLocation": true,
							"editLocation": false,
							"defaultValidity": "U",
							"economyPermitTypeId": "",
							"economyFeeDetails": {},
							"permitFeeDetails": {
								"dailyFee": 10,
								"recurringFee": 0,
								"recurringFrequency": "Y",
								"annualCap": 1240
							},
							"requirePhoneNumber": false,
							"requireEmail": false,
							"minNumberOfVehicles": 1,
							"maxNumberOfVehicles": 3,
							"maxNumberOfVehicles": 3,
							"electricVehicleDiscount": true,
							"freeOffHours": true,
							"carpool": false,
							"carpoolInvitation": false,
							"carpoolMembers": []
						}, {
							"permitTypeId": "CARPOOL",
							"text": "Carpool",
							"headerText": "",
							"locationHeaderText": "I would like to park close to",
							"location": "",
							"locationUrl": "",
							"showLocation": true,
							"editLocation": true,
							"defaultValidity": "U",
							"economyPermitTypeId": "",
							"economyFeeDetails": {},
							"permitFeeDetails": {
								"dailyFee": 0,
								"recurringFee": 950,
								"recurringFrequency": "M",
								"annualCap": 0
							},
							"requirePhoneNumber": false,
							"requireEmail": false,
							"minNumberOfVehicles": 0,
							"maxNumberOfVehicles": 3,
							"electricVehicleDiscount": false,
							"freeOffHours": true,
							"carpool": true,
							"carpoolInvitation": false,
							"carpoolMembers": []
						}]
					}, {
						"id": "RESIDENT",
						"title": "Request Parking: Resident",
						"paymentOptions": {
							"payroll": false,
							"studentAccount": true,
							"creditCardCard": true,
							"journalVoucher": false
						},
						"permitType": [{
								"permitTypeId": "RESIDENT",
								"text": "",
								"headerText": "",
								"locationHeaderText": "Assigned Lot",
								"location": "Your resident lot",
								"locationUrl": "",
								"showLocation": true,
								"editLocation": false,
								"defaultValidity": "U",
								"economyPermitTypeId": "",
								"economyFeeDetails": {
									"dailyFee": 0,
									"recurringFee": 85,
									"recurringFrequency": "M",
									"annualCap": 0,
								},
								"permitFeeDetails": {
									"dailyFee": 0,
									"recurringFee": 158,
									"recurringFrequency": "M",
									"annualCap": 0
								},
								"requirePhoneNumber": false,
								"requireEmail": false,
								"minNumberOfVehicles": 1,
								"maxNumberOfVehicles": 1,
								"electricVehicleDiscount": false,
								"freeOffHours": true,
								"carpool": false,
								"carpoolInvitation": false,
								"carpoolMembers": []
							},
							// {
							// 	"id": "WESTGATE",
							// 	"text": "West Gate($85 monthly)",
							// 	"headerText": "",
							// 	"locationHeaderText": "",
							// 	"location": "",
							// 	"locationUrl": "",
							// 	"showLocation": false,
							// 	"editLocation": false,
							// 	"canAddComment": false,
							// 	"canChooseEconomy": false,
							// 	"economyFeeDetails": {},
							// 	"permitDetails": {
							// 		"type": "MONTHLY",
							// 		"cost": 85,
							// 		"annualCap": 0,
							// 		"permitFee": 0,
							// 		"permitLength": "YEARLY"
							// 	},
							// 	"requirePhoneNumber": false,
							// 	"minNumberOfVehicles": 1,
							// 	"maxNumberOfVehicles": 1,
							// 	"electricVehicleDiscount": false,
							// 	"freeOffHours": true,
							// 	"autoRenew": true,
							// 	"carpool": false,
							// 	"carpoolInvitation": false,
							// 	"carpoolMembers": []
							// }
						]
					}, {
						"id": "RESIDENT_SPOUSE",
						"title": "Request Parking: Resident Spouse",
						"paymentOptions": {
							"payroll": false,
							"studentAccount": true,
							"creditCard": true,
							"journalVoucher": false
						},
						"permitType": [{
							"permitTypeId": "RESIDENT",
							"text": "",
							"headerText": "",
							"locationHeaderText": "Assigned Lot",
							"location": "Your resident lot",
							"locationUrl": "",
							"showLocation": true,
							"editLocation": false,
							"defaultValidity": "U",
							"economyPermitTypeId": "",
							"economyFeeDetails": {
								"dailyFee": 0,
								"recurringFee": 85,
								"recurringFrequency": "M",
								"annualCap": 0,
							},
							"permitFeeDetails": {
								"dailyFee": 0,
								"recurringFee": 158,
								"recurringFrequency": "M",
								"annualCap": 0
							},
							"requirePhoneNumber": false,
							"requireEmail": false,
							"minNumberOfVehicles": 1,
							"maxNumberOfVehicles": 1,
							"electricVehicleDiscount": false,
							"freeOffHours": true,
							"carpool": false,
							"carpoolInvitation": false,
							"carpoolMembers": []
						}]
					}, {
						"id": "PROFESSOR_EMERITUS",
						"title": "Request Parking: Professor Emeritus without Compensation",
						"paymentOptions": {
							"payroll": false,
							"studentAccount": false,
							"creditCard": true,
							"journalVoucher": false
						},
						"permitType": [{
							"permitTypeId": "PERSONAL",
							"text": "",
							"headerText": "",
							"locationHeaderText": "I work in",
							"location": "NW12",
							"locationUrl": "",
							"showLocation": true,
							"editLocation": true,
							"defaultValidity": "U",
							"economyPermitTypeId": "",
							"economyFeeDetails": {},
							"permitFeeDetails": {
								"dailyFee": 10,
								"recurringFee": 0,
								"recurringFrequency": "Y",
								"annualCap": 320
							},
							"requirePhoneNumber": false,
							"requireEmail": false,
							"minNumberOfVehicles": 1,
							"maxNumberOfVehicles": 3,
							"electricVehicleDiscount": true,
							"freeOffHours": true,
							"carpool": false,
							"carpoolInvitation": false,
							"carpoolMembers": []
						}]
					},
					// {
					// 	"id": "SHORT_TERM_30",
					// 	"title": "Request Parking: $30 Short-Term Parking",
					// 	"paymentOptions": {
					// 		"payroll": false,
					// 		"studentAccount": false,
					// 		"creditCard": true,
					// 		"journalVoucher": false
					// 	},
					// 	"permitType": [{
					// 		"permitTypeId": "PERSONAL",
					// 		"text": "",
					// 		"headerText": "Please note that you might qualify for a discounted parking rate (e.g. cross registered students, volunteers, Daper members, student spouses, consultants, etc.). Contact the Parking Office or your Parking Coordinator for more information.",
					// 		"locationHeaderText": "",
					// 		"location": "",
					// 		"locationUrl": "",
					// 		"showLocation": false,
					// 		"editLocation": false,
					// 		"defaultValidity": "T",
					// 		"economyPermitTypeId": "",
					// 		"economyFeeDetails": {},
					// 		"permitFeeDetails": {
					// 			"dailyFee": 30,
					// 			"recurringFee": 25,
					// 			"recurringFrequency": "Q",
					// 			"annualCap": 0
					// 		},
					// 		"requirePhoneNumber": true,
					// 		"minNumberOfVehicles": 1,
					// 		"maxNumberOfVehicles": 3,
					// 		"electricVehicleDiscount": false,
					// 		"freeOffHours": false,
					// 		"carpool": false,
					// 		"carpoolInvitation": false,
					// 		"carpoolMembers": []
					// 	}]
					// },
					// {
					// 	"id": "SHORT_TERM_10",
					// 	"title": "Request Parking: $10 Short-Term Parking",
					// 	"paymentOptions": {
					// 		"payroll": false,
					// 		"studentAccount": false,
					// 		"creditCard": true,
					// 		"journalVoucher": false
					// 	},
					// 	"permitType": [{
					// 		"permitTypeId": "PERSONAL",
					// 		"text": "",
					// 		"headerText": "Please note that affiliates/consultants who have longer arrangements with MIT might be eligible for longer parking. Please contact your Parking Coordinator or the Parking and Transportation Office for more information.",
					// 		"locationHeaderText": "",
					// 		"location": "",
					// 		"locationUrl": "",
					// 		"showLocation": false,
					// 		"editLocation": false,
					// 		"defaultValidity": "T",
					// 		"economyPermitTypeId": "",
					// 		"economyFeeDetails": {},
					// 		"permitFeeDetails": {
					// 			"dailyFee": 10,
					// 			"recurringFee": 25,
					// 			"recurringFrequency": "Q",
					// 			"annualCap": 0
					// 		},
					// 		"requirePhoneNumber": true,
					// 		"minNumberOfVehicles": 1,
					// 		"maxNumberOfVehicles": 3,
					// 		"electricVehicleDiscount": false,
					// 		"freeOffHours": false,
					// 		"carpool": false,
					// 		"carpoolInvitation": false,
					// 		"carpoolMembers": []
					// 	}]
					// },
					{
						"id": "AFFILIATE",
						"title": "Request Parking: Affiliate",
						"paymentOptions": {
							"payroll": false,
							"studentAccount": false,
							"creditCard": true,
							"journalVoucher": false
						},
						"permitType": [{
							"permitTypeId": "PERSONAL",
							"text": "",
							"headerText": "",
							"locationHeaderText": "I work in",
							"location": "",
							"locationUrl": "",
							"showLocation": true,
							"editLocation": true,
							"defaultValidity": "U",
							"economyPermitTypeId": "",
							"economyFeeDetails": {},
							"permitFeeDetails": {
								"dailyFee": 10,
								"recurringFee": 10,
								"recurringFrequency": "M",
								"annualCap": 0
							},
							"requirePhoneNumber": true,
							"requireEmail": true,
							"minNumberOfVehicles": 1,
							"maxNumberOfVehicles": 3,
							"electricVehicleDiscount": false,
							"freeOffHours": false,
							"carpool": false,
							"carpoolInvitation": false,
							"carpoolMembers": []
						}]
					}, {
						"id": "DEPARTMENT_VEHICLE",
						"title": "Request Parking: Department Vehicle",
						"paymentOptions": {
							"payroll": false,
							"studentAccount": false,
							"creditCard": false,
							"journalVoucher": true
						},
						"permitType": [{
							"permitTypeId": "PERSONAL",
							"text": "",
							"headerText": "",
							"locationHeaderText": "",
							"location": "",
							"locationUrl": "",
							"showLocation": false,
							"editLocation": false,
							"defaultValidity": "Y",
							"economyPermitTypeId": "",
							"economyFeeDetails": {},
							"permitDetails": {
								"type": "YEARLY",
								"cost": 2275,
								"annualCap": 0,
								"permitFee": 0,
								"permitLength": "YEARLY"
							},
							"permitFeeDetails": {
								"dailyFee": 0,
								"recurringFee": 2275,
								"recurringFrequency": "Y",
								"annualCap": 0
							},
							"requirePhoneNumber": false,
							"requireEmail": false,
							"minNumberOfVehicles": 1,
							"maxNumberOfVehicles": 1,
							"electricVehicleDiscount": false,
							"freeOffHours": true,
							"carpool": false,
							"carpoolInvitation": false,
							"carpoolMembers": []
						}]
					}, {
						"id": "JOIN_CARPOOL",
						"title": "Join a Carpool",
						"paymentOptions": {
							"payroll": true,
							"studentAccount": false,
							"creditCard": true,
							"journalVoucher": false
						},
						"permitType": [{
							"permitTypeId": "PERSONAL",
							"text": "",
							"headerText": "",
							"locationHeaderText": "",
							"location": "",
							"locationUrl": "",
							"showLocation": false,
							"editLocation": false,
							"defaultValidity": "U",
							"economyPermitTypeId": "",
							"economyFeeDetails": {},
							"permitFeeDetails": {
								"dailyFee": 0,
								"recurringFee": 950,
								"recurringFrequency": "Y",
								"annualCap": 0
							},
							"requirePhoneNumber": false,
							"requireEmail": false,
							"minNumberOfVehicles": 1,
							"maxNumberOfVehicles": 3,
							"electricVehicleDiscount": false,
							"freeOffHours": true,
							"carpool": true,
							"carpoolInvitation": true,
							"carpoolMembers": [{
								"name": "Jenny Smith",
								"email": "jsmith@mit.edu"
							}, {
								"name": "Mike Hay",
								"email": "mikehay@mit.edu"
							}, {
								"name": "Josef Martinez",
								"email": "josefmart@mit.edu"
							}]
						}]
					}, {
						"id": "EMPLOYEE_RENEW",
						"title": "Renew Permit",
						"paymentOptions": {
							"payroll": true,
							"studentAccount": false,
							"creditCard": true,
							"journalVoucher": false
						},
						"permitType": [{
							"permitTypeId": "PERSONAL",
							"text": "",
							"headerText": "We have identified that you currently have <strong>Riverside</strong> assigned to you. To renew this parking, please submit the form below.<span class='permit-renew-text'> Please note that you will no longer receive a physical sticker and lot permission will be based on your MIT ID and/or license plate. You can cancel at any time by contacting the Parking and Transportation Office. </span>",
							"locationHeaderText": "",
							"location": "",
							"locationUrl": "",
							"showLocation": false,
							"editLocation": false,
							"defaultValidity": "U",
							"economyPermitTypeId": "",
							"economyFeeDetails": {},
							"permitDetails": {
								"type": "DAILY",
								"cost": 10,
								"annualCap": 1900,
								"permitFee": 0,
								"permitLength": "YEARLY"
							},
							"permitFeeDetails": {
								"dailyFee": 10,
								"recurringFee": 0,
								"recurringFrequency": "Y",
								"annualCap": 1900
							},
							"requirePhoneNumber": false,
							"requireEmail": false,
							"minNumberOfVehicles": 1,
							"maxNumberOfVehicles": 3,
							"electricVehicleDiscount": true,
							"freeOffHours": true,
							"carpool": false,
							"carpoolInvitation": false,
							"carpoolMembers": []
						}, ]
					}, {
						"id": "RENEW_CARPOOL",
						"title": "Renew a Carpool",
						"paymentOptions": {
							"payroll": true,
							"studentAccount": false,
							"creditCard": true,
							"journalVoucher": false
						},
						"permitType": [{
							"permitTypeId": "PERSONAL",
							"text": "",
							"headerText": "We have identified that you currently have <strong>Sloan</strong> assigned to you. To renew this parking, please submit the form below.<span class='permit-renew-text'> Please note that you will no longer receive a physical sticker and lot permission will be based on your MIT ID and/or license plate. You can cancel at any time by contacting the Parking and Transportation Office. </span>",
							"locationHeaderText": "",
							"location": "",
							"locationUrl": "",
							"showLocation": false,
							"editLocation": false,
							"defaultValidity": "U",
							"economyPermitTypeId": "",
							"economyFeeDetails": {},
							"permitFeeDetails": {
								"dailyFee": 0,
								"recurringFee": 950,
								"recurringFrequency": "Y",
								"annualCap": 0
							},
							"requirePhoneNumber": false,
							"requireEmail": false,
							"minNumberOfVehicles": 1,
							"maxNumberOfVehicles": 3,
							"electricVehicleDiscount": false,
							"freeOffHours": true,
							"carpool": true,
							"carpoolInvitation": true,
							"carpoolMembers": [{
								"name": "Jenny Smith",
								"email": "jsmith@mit.edu"
							}, {
								"name": "Mike Hay",
								"email": "mikehay@mit.edu"
							}, {
								"name": "Josef Martinez",
								"email": "josefmart@mit.edu"
							}]
						}]
					},
				]
			});
			return oModel;
		}

	};
});