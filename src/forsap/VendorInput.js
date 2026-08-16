sap.ui.define([
    "sap/m/Input",
    "sap/m/InputRenderer",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Label",
    "sap/m/SearchField",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/m/Text",
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/ui/layout/Grid",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
], function (
    Input,
    InputRenderer,
    Dialog,
    Button,
    Label,
    SearchField,
    Table,
    Column,
    ColumnListItem,
    Text,
    VBox,
    HBox,
    Grid,
    JSONModel,
    Filter,
    FilterOperator,
    MessageBox
) {
    "use strict";

    const TEST_DATA = {
        d: {
            results: [
                {
                    Supplier: "1000000001",
                    SupplierName: "Apple Inc.",
                    TaxNumber1: "123456789"
                },
                {
                    Supplier: "1000000002",
                    SupplierName: "Microsoft Corporation",
                    TaxNumber1: "987654321"
                },
                {
                    Supplier: "1000000003",
                    SupplierName: "Amazon.com, Inc.",
                    TaxNumber1: "456789123"
                },
                {
                    Supplier: "1000000004",
                    SupplierName: "SAP SE",
                    TaxNumber1: "789123456"
                },
                {
                    Supplier: "1000000005",
                    SupplierName: "Toyota Motor Corporation",
                    TaxNumber1: "321654987"
                }
            ]
        }
    };

    const VendorInput = Input.extend("forsap.VendorInput", {
        metadata: {
            properties: {
                testMode: {
                    type: "boolean",
                    defaultValue: false
                },
                servicePath: {
                    type: "string",
                    defaultValue: "/sap/opu/odata/sap/API_BUSINESS_PARTNER/"
                },
                entitySet: {
                    type: "string",
                    defaultValue: "A_Supplier"
                }
            },
            events: {
                vendorSelected: {
                    parameters: {
                        supplier: {
                            type: "string"
                        },
                        supplierName: {
                            type: "string"
                        },
                        taxNumber1: {
                            type: "string"
                        }
                    }
                }
            }
        },

        renderer: InputRenderer,

        init: function () {
            Input.prototype.init.apply(this, arguments);

            this.setShowValueHelp(true);

            this.attachValueHelpRequest(
                this._onValueHelpRequest,
                this
            );
        },

        exit: function () {
            if (this._oValueHelpDialog) {
                this._oValueHelpDialog.destroy();
                this._oValueHelpDialog = null;
            }

            Input.prototype.exit.apply(this, arguments);
        },

        _onValueHelpRequest: function () {
            if (!this._oValueHelpDialog) {
                this._createValueHelpDialog();
            }

            this._loadValueHelpData();
            this._oValueHelpDialog.open();
        },

        _createValueHelpDialog: function () {
            this._oSearchSupplier = new SearchField({
                width: "100%",
                placeholder: "ID do fornecedor"
            });

            this._oSearchName = new SearchField({
                width: "100%",
                placeholder: "Nome"
            });

            this._oSearchTax = new SearchField({
                width: "100%",
                placeholder: "Documento"
            });

            this._oSearchSupplier.attachSearch(
                this._onSearch,
                this
            );

            this._oSearchName.attachSearch(
                this._onSearch,
                this
            );

            this._oSearchTax.attachSearch(
                this._onSearch,
                this
            );

            const createFilterBox = function (sLabel, oSearch) {
                return new VBox({
                    width: "100%",
                    items: [
                        new Label({
                            text: sLabel,
                            width: "100%"
                        }).addStyleClass("sapUiTinyMarginBottom"),
                        oSearch
                    ]
                });
            };

            const oFilters = new Grid({
                width: "100%",
                defaultSpan: "XL4 L4 M4 S12",
                hSpacing: 1,
                vSpacing: 1,
                content: [
                    createFilterBox(
                        "ID do fornecedor",
                        this._oSearchSupplier
                    ),
                    createFilterBox(
                        "Nome",
                        this._oSearchName
                    ),
                    createFilterBox(
                        "Documento",
                        this._oSearchTax
                    )
                ]
            });

            this._oSupplierTable = new Table({
                width: "100%",
                mode: "SingleSelectMaster",
                growing: true,
                growingThreshold: 50,
                columns: [
                    new Column({
                        header: new Text({
                            text: "Fornecedor"
                        })
                    }),
                    new Column({
                        demandPopin: true,
                        minScreenWidth: "Tablet",
                        header: new Text({
                            text: "Nome"
                        })
                    }),
                    new Column({
                        demandPopin: true,
                        minScreenWidth: "Tablet",
                        header: new Text({
                            text: "Documento"
                        })
                    })
                ]
            });

            this._oSupplierTable.attachSelectionChange(
                this._onSupplierSelected,
                this
            );

            const oModel = new JSONModel({
                d: {
                    results: []
                }
            });

            this._oSupplierTable.setModel(oModel);

            this._oSupplierTable.bindItems({
                path: "/d/results",
                template: new ColumnListItem({
                    type: "Active",
                    cells: [
                        new Text({
                            text: "{Supplier}"
                        }),
                        new Text({
                            text: "{SupplierName}"
                        }),
                        new Text({
                            text: "{TaxNumber1}"
                        })
                    ]
                })
            });

            this._oValueHelpDialog = new Dialog({
                title: "Selecionar fornecedor",
                contentWidth: "90vw",
                contentHeight: "70vh",
                stretchOnPhone: true,
                horizontalScrolling: false,
                verticalScrolling: false,
                content: [
                    new VBox({
                        width: "100%",
                        fitContainer: true,
                        items: [
                            oFilters,
                            this._oSupplierTable
                        ]
                    }).addStyleClass("sapUiSmallMargin")
                ],
                beginButton: new Button({
                    text: "Fechar",
                    press: function () {
                        this._oValueHelpDialog.close();
                    }.bind(this)
                }),
                afterClose: function () {
                    this._oSupplierTable.removeSelections(true);
                }.bind(this)
            });
        },

        _loadValueHelpData: function () {
            if (this.getTestMode()) {
                this._setValueHelpData(TEST_DATA.d.results);
                return;
            }

            const oModel = this.getModel();

            if (!oModel) {
                this._setValueHelpData([]);

                MessageBox.error(
                    "Nenhum modelo OData foi encontrado na aplicação."
                );

                return;
            }

            const sPath =
                "/" + this.getEntitySet();

            oModel.read(sPath, {
                urlParameters: {
                    "$select":
                        "Supplier,SupplierName,TaxNumber1",
                    "$top": "100"
                },
                success: function (oData) {
                    this._setValueHelpData(
                        oData.results || []
                    );
                }.bind(this),
                error: function () {
                    this._setValueHelpData([]);

                    MessageBox.error(
                        "Não foi possível carregar os fornecedores."
                    );
                }.bind(this)
            });
        },

        _setValueHelpData: function (aSuppliers) {
            this._oSupplierTable
                .getModel()
                .setData({
                    d: {
                        results: aSuppliers || []
                    }
                });
        },

        _onSearch: function () {
            const aFilters = [];

            const sSupplier =
                this._oSearchSupplier.getValue().trim();

            const sName =
                this._oSearchName.getValue().trim();

            const sTax =
                this._oSearchTax.getValue().trim();

            if (sSupplier) {
                aFilters.push(
                    new Filter(
                        "Supplier",
                        FilterOperator.Contains,
                        sSupplier
                    )
                );
            }

            if (sName) {
                aFilters.push(
                    new Filter(
                        "SupplierName",
                        FilterOperator.Contains,
                        sName
                    )
                );
            }

            if (sTax) {
                aFilters.push(
                    new Filter(
                        "TaxNumber1",
                        FilterOperator.Contains,
                        sTax
                    )
                );
            }

            this._oSupplierTable
                .getBinding("items")
                .filter(aFilters);
        },

        _onSupplierSelected: function (oEvent) {
            const oItem =
                oEvent.getParameter("listItem");

            if (!oItem) {
                return;
            }

            const oContext =
                oItem.getBindingContext();

            if (!oContext) {
                return;
            }

            const oSupplier =
                oContext.getObject();

            if (!oSupplier) {
                return;
            }

            this.setValue(
                oSupplier.Supplier || ""
            );

            this.fireVendorSelected({
                supplier:
                    oSupplier.Supplier || "",
                supplierName:
                    oSupplier.SupplierName || "",
                taxNumber1:
                    oSupplier.TaxNumber1 || ""
            });

            this._oValueHelpDialog.close();
        }
    });

    return VendorInput;
});
