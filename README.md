# forsap

Reusable SAPUI5 controls.

## Controls

- `forsap.IntegerInput`
- `forsap.DecimalInput`

## Requirements

- Node.js
- UI5 CLI
- SAPUI5 1.120.14 or compatible

## Development

Install dependencies:

```bash
npm install
```

Start the demo application:

```bash
npm start
```

Build the library:

```bash
npm run build
```

Run the QUnit test page:

```bash
npm test
```

## Usage

```xml
<mvc:View
    xmlns:mvc="sap.ui.core.mvc"
    xmlns="sap.m"
    xmlns:forsap="forsap">

    <forsap:IntegerInput
        value="{/quantity}" />

    <forsap:DecimalInput
        value="{/weight}"
        decimalPlaces="2" />

</mvc:View>
```
