# IntegerInput

`forsap.IntegerInput` é um controle baseado em `sap.m.Input` para entrada de valores inteiros.

O controle mantém o comportamento visual e de binding do `sap.m.Input`, adicionando validação para permitir somente números inteiros e suporte a valores negativos.

## Uso

```xml
<forsap:IntegerInput
    value="{/quantity}" />
```

Também pode ser utilizado com propriedades padrão do `sap.m.Input`, por exemplo:

```xml
<forsap:IntegerInput
    id="quantityInput"
    width="100%"
    value="{/quantity}"
    placeholder="Informe a quantidade" />
```

## Comportamento

O campo:

- aceita apenas dígitos;
- aceita valor negativo;
- aceita o sinal `-` para alternar o sinal do valor;
- aceita o sinal `+` para remover o sinal negativo;
- utiliza `inputmode="numeric"` no elemento HTML interno;
- preserva o último valor válido quando uma entrada inválida é identificada.

Exemplos de valores válidos:

```text
0
10
250
-10
-250
```

Exemplos de caracteres que não são aceitos como parte do valor:

```text
10.5
10,5
abc
10a
```

## Propriedades

O `IntegerInput` não adiciona propriedades próprias.

Todas as propriedades disponíveis no `sap.m.Input` continuam disponíveis, como `value`, `width`, `placeholder`, `enabled`, `editable`, entre outras.

## Eventos

O `IntegerInput` não adiciona eventos próprios.

Os eventos herdados de `sap.m.Input` continuam disponíveis.

## Binding

O controle pode ser utilizado normalmente com binding de modelo:

```xml
<forsap:IntegerInput
    value="{/quantity}" />
```

## Observações

O controle é destinado a valores inteiros. Não utilize `IntegerInput` para valores que possuam casas decimais; nesses casos, utilize [`DecimalInput`](DecimalInput.md).
