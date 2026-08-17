# VendorInput

`forsap.VendorInput` é um controle baseado em `sap.m.Input` que fornece um campo de entrada com **Value Help** para seleção de fornecedores.

O controle abre um diálogo contendo uma tabela de fornecedores e campos de pesquisa para:

- ID do fornecedor;
- Nome;
- Documento.

A implementação utiliza um modelo **OData V2** associado ao controle/aplicação.

## Uso básico

Se a aplicação já possui um `ODataModel` V2 como modelo padrão:

```xml
<forsap:VendorInput
    id="vendorInput"
    width="100%"
    value="{/Supplier}"
    placeholder="Selecione o fornecedor..." />
```

O controle utiliza:

```javascript
this.getModel()
```

Portanto, o `ODataModel` precisa estar disponível como modelo padrão do controle.

## Modelo OData

Exemplo de configuração:

```javascript
const oModel = new sap.ui.model.odata.v2.ODataModel(
    "/sap/opu/odata/sap/API_BUSINESS_PARTNER/"
);

this.getView().setModel(oModel);
```

Também é possível associar o modelo diretamente ao controle:

```javascript
this.byId("vendorInput").setModel(
    new sap.ui.model.odata.v2.ODataModel(
        "/sap/opu/odata/sap/API_BUSINESS_PARTNER/"
    )
);
```

## API utilizada

Por padrão, o controle utiliza a API:

```text
API_BUSINESS_PARTNER
```

com a entidade:

```text
A_Supplier
```

A leitura padrão é equivalente a:

```text
/sap/opu/odata/sap/API_BUSINESS_PARTNER/A_Supplier
```

A leitura inicial solicita:

```text
Supplier
SupplierName
TaxNumber1
```

e limita a carga inicial a 100 registros.

## Propriedades

### `testMode`

Ativa o modo de teste do controle.

Tipo:

```text
boolean
```

Valor padrão:

```text
false
```

Uso:

```xml
<forsap:VendorInput
    value="{/Supplier}"
    testMode="true" />
```

Quando `testMode="true"`, o controle não acessa o backend. Ele utiliza dados internos para permitir testes da interface.

Dados disponibilizados no modo de teste:

| Supplier | SupplierName | TaxNumber1 |
|---|---|---|
| 1000000001 | Apple Inc. | 123456789 |
| 1000000002 | Microsoft Corporation | 987654321 |
| 1000000003 | Amazon.com, Inc. | 456789123 |
| 1000000004 | SAP SE | 789123456 |
| 1000000005 | Toyota Motor Corporation | 321654987 |

Para consumir dados reais, mantenha:

```xml
testMode="false"
```

ou não informe a propriedade, pois `false` é o valor padrão.

### `entitySet`

Define a entidade OData utilizada para carregar os fornecedores.

Tipo:

```text
string
```

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

A entidade informada precisa ser compatível com o modelo OData associado ao controle.

### `servicePath`

Define o caminho padrão do serviço:

```text
/sap/opu/odata/sap/API_BUSINESS_PARTNER/
```

Tipo:

```text
string
```

Valor padrão:

```text
/sap/opu/odata/sap/API_BUSINESS_PARTNER/
```

**Observação:** atualmente a leitura é executada utilizando o `ODataModel` associado ao controle por meio de `getModel()`. A propriedade `servicePath` está disponível na API do controle, mas não é utilizada para criar ou substituir o modelo OData.

## Value Help

Ao clicar no ícone de Value Help, o controle abre um diálogo com três campos de pesquisa:

```text
ID do fornecedor
Nome
Documento
```

A tabela apresenta:

```text
Fornecedor | Nome | Documento
```

A pesquisa utiliza filtros `Contains` sobre:

```text
Supplier
SupplierName
TaxNumber1
```

Depois que o usuário seleciona um fornecedor, o valor do `Input` recebe o número do fornecedor.

Exemplo:

```text
1000000001
```

## Evento `vendorSelected`

O controle dispara o evento `vendorSelected` quando o usuário seleciona um fornecedor.

O evento disponibiliza o objeto completo através do parâmetro:

```text
vendor
```

### XML

```xml
<forsap:VendorInput
    id="vendorInput"
    value="{/Supplier}"
    vendorSelected=".onVendorSelected" />
```

### Controller

```javascript
onVendorSelected: function (oEvent) {
    const oVendor = oEvent.getParameter("vendor");

    console.log(oVendor);
}
```

O objeto recebido contém os campos retornados pela consulta da API.

Exemplo:

```javascript
{
    Supplier: "1000000057",
    SupplierName: "Adidas AG",
    TaxNumber1: "700000057"
}
```

Isso permite acessar diretamente qualquer campo retornado:

```javascript
onVendorSelected: function (oEvent) {
    const oVendor = oEvent.getParameter("vendor");

    console.log(oVendor.Supplier);
    console.log(oVendor.SupplierName);
    console.log(oVendor.TaxNumber1);
}
```

O evento não expõe o `BindingContext` ou a tabela interna do controle. O contrato do componente é o objeto `vendor`.

## Consumo sem `$batch`

O `VendorInput` utiliza um `ODataModel` V2, que normalmente pode executar requisições utilizando `$batch`.

Para o Value Help, a biblioteca executa a consulta sem `$batch`.

Antes da leitura, o controle guarda o estado atual de `useBatch`:

```javascript
const bUseBatch = oModel.bUseBatch;
```

Se o batch estiver habilitado, ele é temporariamente desabilitado:

```javascript
if (bUseBatch) {
    oModel.setUseBatch(false);
}
```

Depois da consulta, o estado original é restaurado somente quando o batch estava habilitado antes da chamada.

Isso significa:

| Estado antes | Durante a consulta | Estado depois |
|---|---|---|
| `true` | `false` | `true` |
| `false` | `false` | `false` |

Essa estratégia permite que o Value Help seja consumido por ambientes que não disponibilizam `$batch`, sem alterar permanentemente a configuração do `ODataModel` da aplicação.

## Fluxo de seleção

O fluxo do controle é:

```text
Usuário abre o Value Help
        ↓
VendorInput consulta A_Supplier
        ↓
Consulta OData executada sem $batch
        ↓
Dados carregados na tabela interna
        ↓
Usuário pesquisa ou seleciona um fornecedor
        ↓
Input recebe o Supplier
        ↓
Evento vendorSelected é disparado
        ↓
oEvent.getParameter("vendor")
        ↓
Objeto completo do fornecedor
```

## Exemplo completo

XML:

```xml
<forsap:VendorInput
    id="vendorInput"
    width="100%"
    value="{/Supplier}"
    placeholder="Selecione o fornecedor..."
    vendorSelected=".onVendorSelected" />
```

Controller:

```javascript
onVendorSelected: function (oEvent) {
    const oVendor = oEvent.getParameter("vendor");

    const oModel = this.getView().getModel();

    oModel.setProperty(
        "/Supplier",
        oVendor.Supplier
    );

    oModel.setProperty(
        "/SupplierName",
        oVendor.SupplierName
    );
}
```

## Modo de teste

Para desenvolver sem depender do backend:

```xml
<forsap:VendorInput
    id="vendorInput"
    testMode="true"
    value="{/Supplier}" />
```

Nesse modo, o controle utiliza os cinco registros internos e mantém o mesmo fluxo visual do Value Help.

## Requisitos para uso com S/4HANA

Para utilizar dados reais:

1. A aplicação deve possuir um `ODataModel` V2.
2. O modelo deve estar disponível como modelo padrão do controle.
3. O serviço `API_BUSINESS_PARTNER` deve estar disponível no ambiente SAP.
4. O usuário deve possuir as autorizações necessárias.
5. O acesso ao serviço deve estar corretamente configurado no ambiente de desenvolvimento ou execução.

## Referência do serviço

```text
Serviço:
API_BUSINESS_PARTNER

Entidade:
A_Supplier
```

O controle depende da estrutura de dados disponibilizada pela entidade utilizada no `entitySet`.
