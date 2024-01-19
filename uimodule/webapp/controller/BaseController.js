sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "com/apress/openui5/model/formatter",
    "sap/ui/Device",
    "sap/ui/core/Fragment",
    "sap/m/Button",
    "sap/ui/core/routing/History"
], function (Controller, UIComponent, formatter, Device, Fragment, Button, History) {
    "use strict";

    return Controller.extend("com.apress.openui5.controller.BaseController", {
        formatter: formatter,
        fnPageSwitch: function (oEvent) {
            this.navTo(oEvent.getParameter("itemPressed").getTargetSrc());
         },
        fnOpenSwitch: function (oEvent) {
            const oButton = oEvent.getParameter("button");
            if (!this._pPopover) {
                this._pPopover = Fragment.load({
                    id: this.getView().getId(),
                    name: "com.apress.openui5.view.PageSwitchPopover",
                    controller: this
                }).then(function (oPopover) {
                    this.getView().addDependent(oPopover);
                    if (Device.system.phone) {
                        oPopover.setEndButton(new Button({
                            text: "{i18n>close}",
                            type: "Emphasized",
                            press: this.fnCloseSwitch.bind(this)
                        }));
                    }
                    return oPopover;
                }.bind(this));
            }
            this._pPopover.then(function (oPopover) {
                oPopover.openBy(oButton);
            });
        },
        fnCloseSwitch: function () {
            this._pPopover.then(function (oPopover) {
                oPopover.close();
            });
        },
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        navTo: function (psTarget, pmParameters, pbReplace) {
            this.getRouter().navTo(psTarget, pmParameters, pbReplace);
        },

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        onNavBack: function () {
            const sPreviousHash = History.getInstance().getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.back();
            } else {
                this.getRouter().navTo("appHome", {}, true);
            }
        },
    });
});
