sap.ui.define([], function () {
    "use strict";

    var Http = function () {
        this.CONTENT_TYPE_UPLOAD = "binary/octet-stream";
        this.CONTENT_TYPE_JSON = "application/json";
        this.URL_BASE = "/apis";
    };

    var handleErrorFn = Http.prototype.handleErrorFn = function (context, errorCallback) {
        return function (jqXHR, textStatus, errorThrown) {
            // Skipping these will be handled by code in session ajaxComplete
            if (jqXHR.status === "403") {
                return;
            }
            if (jqXHR.getResponseHeader("com.sap.cloud.security.login")) {
                return;
            }

            // Call error callback if defined
            if (errorCallback) {
                errorCallback.call(context, "An Error Occurred", errorThrown, jqXHR);
            }
        };
    };

    var loadCsrfToken = function () {
        // We cannot do any HTTP mutating requests unless we have a CSRF token
        var CSRF_SESSION_TOKEN = "TOKEN NOT SET";
        jQuery.ajax({
            method: "GET",
            url: URL_CSRF_API,
            async: false,
            success: function (response, textStatus, jqXHR) {
                if (jqXHR.getResponseHeader("com.sap.cloud.security.login")) {
                    return;
                }
                CSRF_SESSION_TOKEN = response;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.getResponseHeader("com.sap.cloud.security.login")) {
                    return;
                }
                console.error("Could not load CSRF token.");
            }
        });

        return CSRF_SESSION_TOKEN;
    };

    Http.prototype.ajax = function (method, context, successCallback, errorCallback, url, data, headers, contentType, sync) {
        contentType = contentType || this.CONTENT_TYPE_JSON;
        var submitData, sUrl;
        var processData = true;
        var dataType = "json";
        if (contentType === this.CONTENT_TYPE_JSON) {
            submitData = JSON.stringify(data);
        } else if (contentType === this.CONTENT_TYPE_UPLOAD) {
            submitData = data;
            processData = false;
        } else {
            submitData = data;
        }
        if (method === "DELETE") {
            dataType = "html";
        }
        if (!headers) {
            headers = {};
        }
        if (method === "POST" || method === "PUT" || method === "DELETE") {
            headers['X-CSRF-Token'] = loadCsrfToken();
        }
        if (typeof sync === "undefined") {
            sync = false;
        }
        if (APP_BUILD_NUMBER === "local") {
            headers['Authorization'] = APP_LOCAL_AUTH['Authorization'];
            headers['X-Referred-User'] = APP_LOCAL_AUTH['X-Referred-User'];
            sUrl = "https://localhost:8082/api" + url;
        } else {
            sUrl = this.URL_BASE + url;
        }

        jQuery.ajax({
            url: sUrl,
            method: method,
            data: submitData,
            dataType: dataType,
            contentType: method === "GET" ? undefined : contentType,
            headers: headers,
            processData: processData,
            async: !sync,
            success: function (res, textStatus, jqXHR) {
                if (jqXHR.getResponseHeader("com.sap.cloud.security.login")) {
                    return;
                }

                if ((typeof res.success === "undefined" || res.success === true) &&
                    (typeof res.errors === "undefined" || (res.errors.length <= 0))) {
                    if (successCallback) {
                        successCallback.call(context, res, textStatus, jqXHR);
                    }
                } else {
                    if (errorCallback) {
                        var errorMessages = res.messages;
                        if (typeof errorMessages === "undefined") {
                            errorMessages = [];
                        }
                        if (errorMessages.length === 0 && res.errorMessage) {

                            var stringText = "" + res.errorMessage;

                            if (res.errorMessageDetail) {
                                stringText += " (" + res.errorMessageDetail.trim() + ")";
                            }
                            if (stringText.charAt(stringText.length - 1) !== ".") {
                                stringText += ".";
                            }
                            errorMessages = [stringText];
                        }
                        errorMessages.push("Please contact parking-support@mit.edu.");
                        errorCallback.call(context, "An error occurred.", errorMessages, jqXHR);
                    }
                }
            },
            error: handleErrorFn(context, errorCallback)
        });
    };

    return new Http();
});