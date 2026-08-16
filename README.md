# forsap

Biblioteca de controles reutilizáveis para aplicações SAPUI5 e SAP Fiori.

A `forsap` fornece controles prontos para reutilização em diferentes aplicações SAPUI5, evitando a necessidade de recriar componentes comuns em cada projeto.

## Controles disponíveis

- `forsap.IntegerInput`
- `forsap.DecimalInput`

## Requisitos

- Node.js
- UI5 CLI
- SAPUI5 1.120.14 ou compatível
- SAP Fiori tools / UI5 Tooling, quando a biblioteca for consumida por uma aplicação Fiori

## Instalação

No projeto SAPUI5/Fiori que utilizará a biblioteca, instale a `forsap` como dependência:

```bash
npm install forsap
```

Depois da instalação, confirme que ela aparece no `package.json`:

```json
{
  "dependencies": {
    "forsap": "^0.1.0"
  }
}
```

## Configuração da aplicação

### 1. Declarar a biblioteca no `manifest.json`

No `webapp/manifest.json`, adicione `forsap` às bibliotecas utilizadas pela aplicação:

```json
{
  "sap.ui5": {
    "dependencies": {
      "libs": {
        "sap.m": {},
        "sap.ui.core": {},
        "forsap": {}
      }
    }
  }
}
```

### 2. Configurar o `fiori-tools-proxy`

Este passo é importante quando a aplicação utiliza o `fiori-tools-proxy`.

Por padrão, uma configuração como esta:

```yaml
ui5:
  path:
    - /resources
    - /test-resources
  url: https://ui5.sap.com
```

faz com que todas as requisições iniciadas por `/resources` sejam encaminhadas para o servidor do SAPUI5.

Isso também pode incluir a `forsap`:

```text
/resources/forsap/library.js
/resources/forsap/IntegerInput.js
/resources/forsap/DecimalInput.js
```

Como a `forsap` é uma biblioteca local do projeto, essas requisições devem ser atendidas pelo próprio UI5 CLI, e não pelo servidor `ui5.sap.com`.

Por isso, no `ui5.yaml` da aplicação, restrinja o proxy aos recursos oficiais do SAPUI5:

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

A diferença principal é:

```yaml
- /resources
```

deve ser substituído por:

```yaml
- /resources/sap*
```

Com essa configuração:

```text
/resources/sap/...        -> SAPUI5
/resources/sap-ui-*.js    -> SAPUI5
/test-resources/...       -> SAPUI5
/resources/forsap/...     -> biblioteca local
```

Essa configuração é necessária em aplicações que utilizam o `fiori-tools-proxy` dessa forma.

## Uso

No XML da aplicação, declare o namespace:

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

## Exemplo com `IntegerInput`

```xml
<forsap:IntegerInput
    value="{/quantity}" />
```

O controle pode ser utilizado como um campo de entrada para valores inteiros.

## Exemplo com `DecimalInput`

```xml
<forsap:DecimalInput
    value="{/weight}"
    decimalPlaces="2" />
```

O atributo `decimalPlaces` define a quantidade de casas decimais permitidas.

## Desenvolvimento da biblioteca

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

Execute a página de testes QUnit:

```bash
npm test
```

## Estrutura da biblioteca

A estrutura principal do projeto é:

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

Os arquivos dentro de `src/forsap` são disponibilizados pelo UI5 como recursos da biblioteca:

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
