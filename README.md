# forsap

Biblioteca de recursos reutilizáveis para desenvolvimento de aplicações SAPUI5 e Fiori.

## Controles disponíveis

| Controle | Descrição | Documentação |
|---|---|---|
| `IntegerInput` | Campo de entrada para valores inteiros. | [IntegerInput.md](doc/IntegerInput.md) |
| `DecimalInput` | Campo de entrada para valores decimais com controle de casas decimais. | [DecimalInput.md](doc/DecimalInput.md) |
| `VendorInput` | Campo de entrada com Value Help para seleção de fornecedores. | [VendorInput.md](doc/VendorInput.md) |

A documentação completa de cada controle está disponível no diretório `doc`.

## Instalação

Instale o pacote no projeto SAPUI5/Fiori:

```bash
npm install forsap
```

Após a instalação, são necessárias configurações no `manifest.json` e no `ui5.yaml` para que a biblioteca seja disponibilizada corretamente durante o desenvolvimento.

## Configuração do `manifest.json`

No arquivo `webapp/manifest.json`, localize a seção `sap.ui` e adicione a biblioteca `forsap` em `dependencies.libs`:

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

## Configuração do `ui5.yaml`

No arquivo `ui5.yaml`, localize a configuração do middleware `fiori-tools-proxy`.

Na configuração do `ui5` utilizada pelo middleware, o `path` precisa contemplar os recursos SAPUI5:

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

O ponto importante é utilizar:

```yaml
- /resources/sap*
```

em vez de:

```yaml
- /resources
```

Essa configuração permite que os recursos SAPUI5 necessários pela biblioteca sejam carregados corretamente durante o desenvolvimento.

## Uso

No XML da aplicação, registre o namespace `forsap`:

```xml
<mvc:View
    xmlns:mvc="sap.ui.core.mvc"
    xmlns="sap.m"
    xmlns:forsap="forsap">

    <forsap:IntegerInput value="{/Quantity}" />

    <forsap:DecimalInput value="{/Weight}" decimalPlaces="3" />

    <forsap:VendorInput value="{/Vendor}"/>
</mvc:View>
```

## IntegerInput

Utilize `forsap.IntegerInput` para campos de entrada de valores inteiros.

```xml
<forsap:IntegerInput
    value="{/quantity}" />
```

Consulte a documentação completa:

[Documentação do IntegerInput](doc/IntegerInput.md)

## DecimalInput

Utilize `forsap.DecimalInput` para campos de entrada de valores decimais.

```xml
<forsap:DecimalInput
    value="{/weight}"
    decimalPlaces="2" />
```

Consulte a documentação completa:

[Documentação do DecimalInput](doc/DecimalInput.md)

## VendorInput

O `forsap.VendorInput` é um controle baseado no `sap.m.Input` que fornece um campo para seleção de fornecedor através de Value Help.

A implementação utiliza a API padrão Business Partner (A2X) do SAP S/4HANA, através do serviço OData `API_BUSINESS_PARTNER` e da entidade `A_Supplier`.

Exemplo básico:

```xml
<forsap:VendorInput
    id="vendorInput"
    width="100%"
    value="{/Vendor}"
    placeholder="Selecione o fornecedor..." />
```

Para o funcionamento com dados reais, a aplicação deve possuir um modelo OData V2 associado ao controle.

O `VendorInput` também possui modo de teste, permitindo utilizar dados internos sem depender do backend.

Para detalhes sobre propriedades, Value Help, modelo OData, evento `vendorSelected`, modo de teste e integração com SAP S/4HANA:

[Documentação do VendorInput](doc/VendorInput.md)

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
├── doc/
│   ├── DecimalInput.md
│   ├── IntegerInput.md
│   └── VendorInput.md
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
