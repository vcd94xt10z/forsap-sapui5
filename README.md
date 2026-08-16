# forsap

Biblioteca de controles reutilizáveis para aplicações SAPUI5 e SAP Fiori.

A `forsap` fornece controles prontos para reutilização em diferentes aplicações SAPUI5.

## Controles disponíveis

- `forsap.IntegerInput`
- `forsap.DecimalInput`

## Requisitos

- Node.js
- UI5 CLI
- SAPUI5 1.120.14 ou compatível

## Instalação

No projeto SAPUI5/Fiori que utilizará a biblioteca, execute:

```bash
npm install forsap
```

Depois da instalação, a biblioteca estará disponível como dependência do projeto.

## Configuração

Ao utilizar a `forsap` em um projeto que utiliza o `fiori-tools-proxy`, é necessário ajustar o `ui5.yaml` da aplicação.

### Configuração padrão

Uma configuração como esta:

```yaml
ui5:
  path:
    - /resources
    - /test-resources
  url: https://ui5.sap.com
```

faz com que as requisições para `/resources` sejam encaminhadas para o servidor do SAPUI5.

Isso também pode afetar os arquivos da `forsap`, por exemplo:

```text
/resources/forsap/library.js
/resources/forsap/IntegerInput.js
/resources/forsap/DecimalInput.js
```

Como a `forsap` é uma biblioteca local do projeto, esses arquivos devem ser carregados pelo próprio UI5 CLI.

### Configuração recomendada

No `ui5.yaml`, altere:

```yaml
- /resources
```

para:

```yaml
- /resources/sap*
```

Exemplo:

```yaml
server:
  customMiddleware:
    - name: fiori-tools-proxy
      afterMiddleware: compression
      configuration:
        ui5:
          path:
            - /resources/sap*
            - /test-resources
          url: https://ui5.sap.com
```

Com essa configuração:

```text
/resources/sap/...        -> SAPUI5
/resources/sap-ui-*.js    -> SAPUI5
/test-resources/...       -> SAPUI5
/resources/forsap/...     -> biblioteca local
```

Essa é a única configuração adicional necessária para utilizar a `forsap` em um novo projeto com `fiori-tools-proxy`.

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
src/forsap/IntegerInput.js
        ↓
/resources/forsap/IntegerInput.js
```

## Licença

Este projeto está disponível sob a licença MIT.
