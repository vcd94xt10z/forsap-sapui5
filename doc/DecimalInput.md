# DecimalInput

`forsap.DecimalInput` é um controle baseado em `sap.m.Input` para entrada de valores decimais.

O controle permite configurar a quantidade de casas decimais e aplica formatação no padrão utilizado pelo projeto, com ponto como separador de milhares e vírgula como separador decimal.

## Uso

```xml
<forsap:DecimalInput
    value="{/weight}"
    decimalPlaces="2" />
```

Exemplo com três casas decimais:

```xml
<forsap:DecimalInput
    id="weightInput"
    width="100%"
    value="{/weight}"
    decimalPlaces="3"
    placeholder="Informe o peso" />
```

## Propriedades

### `decimalPlaces`

Define a quantidade de casas decimais utilizadas na formatação.

Tipo:

```text
int
```

Valor padrão:

```text
2
```

Exemplo:

```xml
<forsap:DecimalInput
    value="{/weight}"
    decimalPlaces="2" />
```

Com `decimalPlaces="2"`:

```text
1234 → 12,34
```

Com `decimalPlaces="3"`:

```text
1234 → 1,234
```

A formatação também utiliza separador de milhares:

```text
123456 → 1.234,56
```

## Comportamento

O campo:

- aceita números;
- aceita valores negativos;
- aceita `.` e `,` como entrada decimal;
- utiliza `inputmode="decimal"` no elemento HTML interno;
- formata o valor conforme a quantidade configurada em `decimalPlaces`;
- utiliza `.` como separador de milhares;
- utiliza `,` como separador decimal;
- preserva o último valor válido quando uma entrada inválida é identificada.

Exemplos:

```text
10,50
1.234,56
-25,00
-1.234,567
```

## Propriedades herdadas

O `DecimalInput` herda as propriedades do `sap.m.Input`, além da propriedade própria `decimalPlaces`.

Podem ser utilizadas propriedades como:

```text
value
width
placeholder
enabled
editable
visible
```

## Eventos

O `DecimalInput` não adiciona eventos próprios.

Os eventos herdados de `sap.m.Input` continuam disponíveis.

## Binding

Exemplo:

```xml
<forsap:DecimalInput
    value="{/weight}"
    decimalPlaces="2" />
```

## Observações

A formatação é aplicada durante a edição do campo. A quantidade de casas decimais deve ser definida de acordo com a necessidade do valor que está sendo informado.
