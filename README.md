# forsap

Biblioteca de recursos reutilizáveis para desenvolvimento de aplicações SAPUI5 e Fiori.

## Instalação

Instale o pacote no projeto:

```bash
npm install forsap
```

Após a instalação, são necessárias duas configurações no projeto SAPUI5/Fiori para que a biblioteca seja disponibilizada corretamente durante o desenvolvimento.

### 1. Configurar o `manifest.json`

No arquivo `webapp/manifest.json`, localize a seção `sap.ui` e adicione a dependência `forsap`:

```json
"sap.ui": {
    "dependencies": {
        "minUI5Version": "1.115.0",
        "libs": {
            "sap.m": {},
            "sap.ui.core": {},
            "forsap": {}
        }
    }
}
```

A biblioteca `forsap` deve estar registrada em `sap.ui.dependencies.libs`.

### 2. Configurar o `ui5.yaml`

No arquivo `ui5.yaml`, localize a configuração do `fiori-tools-proxy`.

Na propriedade `path`, altere:

```yaml
path:
    - /resources
```

para:

```yaml
path:
    - /resources/sap*
```

Exemplo:

```yaml
server:
  customMiddleware:
    - name: fiori-tools-proxy
      afterMiddleware: compression
      configuration:
        ignoreCertErrors: false
        ui5:
          path:
            - /resources/sap*
            - /test-resources
          url: https://ui5.sap.com
```

Essa configuração permite que os recursos da biblioteca sejam carregados corretamente junto com os recursos SAPUI5 durante o desenvolvimento.

Após essas duas configurações, a biblioteca pode ser utilizada normalmente na aplicação.

## Uso

No XML da aplicação:

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

## `IntegerInput`

Utilize `forsap.IntegerInput` para campos de entrada de valores inteiros.

```xml
<forsap:IntegerInput
    value="{/quantity}" />
```

## `DecimalInput`

Utilize `forsap.DecimalInput` para campos de entrada de valores decimais.

O atributo `decimalPlaces` define a quantidade de casas decimais:

```xml
<forsap:DecimalInput
    value="{/weight}"
    decimalPlaces="2" />
```

## `VendorInput`

O `forsap.VendorInput` é um controle baseado no `sap.m.Input` que fornece um campo para seleção de fornecedor com **Value Help**.

Ao clicar no ícone de ajuda do campo, o controle abre um diálogo com uma tabela de fornecedores e filtros para:

- ID do fornecedor
- Nome
- Documento

A implementação utiliza a API padrão **Business Partner (A2X)** do SAP S/4HANA, através do serviço OData `API_BUSINESS_PARTNER` e da entidade `A_Supplier`. A API padrão disponibiliza dados de Business Partner, Customer e Supplier por OData. Consulte a documentação oficial da SAP para detalhes sobre a API e suas entidades.

### Exemplo básico

Se a aplicação já possui um modelo OData V2 configurado como modelo padrão, basta utilizar:

```xml
<forsap:VendorInput
    id="vendorInput"
    width="100%"
    value="{/Supplier}"
    placeholder="Selecione o fornecedor..." />
```

O `VendorInput` utiliza o modelo OData associado ao controle para executar a leitura da entidade configurada.

Por padrão, a entidade utilizada é:

```text
A_Supplier
```

Portanto, a leitura padrão é equivalente a:

```text
/sap/opu/odata/sap/API_BUSINESS_PARTNER/A_Supplier
```

A API Business Partner (A2X) é a API padrão da SAP para acesso aos dados de Business Partner, Customer e Supplier. Em SAP S/4HANA, ela pode ser consumida por aplicações OData e respeita as autorizações aplicáveis ao usuário.

### Modelo OData

O controle espera que um modelo OData V2 esteja associado a ele. Por exemplo, em uma aplicação SAPUI5:

```javascript
this.getView().setModel(
    new sap.ui.model.odata.v2.ODataModel(
        "/sap/opu/odata/sap/API_BUSINESS_PARTNER/"
    )
);
```

Como o controle utiliza `getModel()` sem informar o nome do modelo, o `ODataModel` precisa estar disponível como **modelo padrão**.

Também é possível configurar o modelo no próprio controle:

```javascript
this.byId("vendorInput").setModel(
    new sap.ui.model.odata.v2.ODataModel(
        "/sap/opu/odata/sap/API_BUSINESS_PARTNER/"
    )
);
```

### Propriedades

#### `testMode`

Ativa o modo de teste do `VendorInput`.

```xml
<forsap:VendorInput
    value="{/Supplier}"
    testMode="true" />
```

Quando `testMode` está habilitado, o controle **não acessa o SAP S/4HANA**. Em vez disso, utiliza uma lista interna de fornecedores para permitir o desenvolvimento e os testes da interface sem depender do backend.

Dados disponibilizados no modo de teste:

| Supplier | SupplierName | TaxNumber1 |
|---|---|---|
| 1000000001 | Apple Inc. | 123456789 |
| 1000000002 | Microsoft Corporation | 987654321 |
| 1000000003 | Amazon.com, Inc. | 456789123 |
| 1000000004 | SAP SE | 789123456 |
| 1000000005 | Toyota Motor Corporation | 321654987 |

Para utilização em ambiente real, mantenha:

```xml
testMode="false"
```

ou simplesmente não informe a propriedade, pois `false` é o valor padrão.

#### `entitySet`

Permite alterar a entidade utilizada para carregar os fornecedores.

Valor padrão:

```text
A_Supplier
```

Exemplo:

```xml
<forsap:VendorInput
    value="{/Supplier}"
    entitySet="A_Supplier" />
```

A propriedade é útil quando a aplicação precisa trabalhar com uma entidade compatível disponibilizada pelo modelo OData.

### Value Help

O diálogo de seleção apresenta três campos de pesquisa:

```text
ID do fornecedor
Nome
Documento
```

A tabela apresenta:

```text
Fornecedor | Nome | Documento
```

Depois que o usuário seleciona um fornecedor, o valor do `Input` recebe o número do fornecedor.

Por exemplo:

```text
1000000001
```

A pesquisa realizada sobre os dados carregados utiliza filtros `Contains` para:

- `Supplier`
- `SupplierName`
- `TaxNumber1`

A leitura inicial solicita os campos:

```text
Supplier
SupplierName
TaxNumber1
```

e limita a carga inicial a 100 registros.

### Evento `vendorSelected`

Além de preencher o valor do `Input`, o controle dispara o evento `vendorSelected` quando um fornecedor é selecionado.

O evento disponibiliza:

```text
supplier
supplierName
taxNumber1
```

Exemplo no XML:

```xml
<forsap:VendorInput
    id="vendorInput"
    value="{/Supplier}"
    vendorSelected=".onVendorSelected" />
```

No controller:

```javascript
onVendorSelected: function (oEvent) {
    const sSupplier = oEvent.getParameter("supplier");
    const sSupplierName = oEvent.getParameter("supplierName");
    const sTaxNumber1 = oEvent.getParameter("taxNumber1");

    console.log(sSupplier);
    console.log(sSupplierName);
    console.log(sTaxNumber1);
}
```

Também é possível utilizar o evento diretamente para atualizar propriedades do modelo:

```javascript
onVendorSelected: function (oEvent) {
    const oModel = this.getView().getModel();

    oModel.setProperty(
        "/Supplier",
        oEvent.getParameter("supplier")
    );

    oModel.setProperty(
        "/SupplierName",
        oEvent.getParameter("supplierName")
    );
}
```

### Exemplo completo com modo de teste

O projeto de demonstração da biblioteca utiliza o seguinte controle:

```xml
<forsap:VendorInput
    id="vendorInput"
    width="100%"
    testMode="true"
    value="{/Supplier}"
    placeholder="Selecione o fornecedor..." />
```

Com:

```javascript
this.getView().setModel(new JSONModel({
    Supplier: ""
}));
```

Ao abrir o Value Help, os cinco fornecedores de teste são exibidos.

### Exemplo completo com SAP S/4HANA

Para utilizar os dados reais do S/4HANA, remova o `testMode` ou defina-o como `false`:

```xml
<forsap:VendorInput
    id="vendorInput"
    width="100%"
    value="{/Supplier}"
    placeholder="Selecione o fornecedor..." />
```

Configure o `ODataModel` padrão apontando para a API:

```javascript
const oModel = new sap.ui.model.odata.v2.ODataModel(
    "/sap/opu/odata/sap/API_BUSINESS_PARTNER/"
);

this.getView().setModel(oModel);
```

O controle então executará a leitura da entidade:

```text
/sap/opu/odata/sap/API_BUSINESS_PARTNER/A_Supplier
```

A disponibilidade dos dados depende da configuração do serviço, autenticação e autorizações do usuário no SAP S/4HANA.

### API utilizada

O controle utiliza a API padrão:

```text
API_BUSINESS_PARTNER
```

Serviço OData:

```text
/sap/opu/odata/sap/API_BUSINESS_PARTNER/
```

Entidade:

```text
A_Supplier
```

A documentação oficial da SAP descreve a Business Partner (A2X) como uma API OData para acesso a dados de Business Partner, Customer e Supplier.

Referência:

https://help.sap.com/docs/SAP_S4HANA_CLOUD/3c916ef10fc240c9afc594b346ffaf77/85043858ea0f9244e10000000a4450e5.html

## Desenvolvimento

Clone o repositório e instale as dependências:

```bash
npm install
```

Inicie a aplicação de demonstração:

```bash
npm start
```

Gere o build da biblioteca:

```bash
npm run build
```

Execute os testes QUnit:

```bash
npm test
```

## Estrutura

```text
forsap/
├── src/
│   └── forsap/
│       ├── DecimalInput.js
│       ├── IntegerInput.js
│       ├── VendorInput.js
│       └── library.js
├── test/
├── package.json
├── ui5.yaml
└── README.md
```

Os arquivos da biblioteca são disponibilizados pelo UI5 como recursos em:

```text
/resources/forsap/
```

Por exemplo:

```text
src/forsap/VendorInput.js
        ↓
/resources/forsap/VendorInput.js
```

## Licença

Este projeto está disponível sob a licença MIT.