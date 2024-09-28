# SAT COMPARISON LIBRARY

![npm downloads](https://img.shields.io/npm/dm/sat-compare.svg?style=flat-square)

## Content

- [customCheck](#customCheck)
- [stringIncludes](#stringIncludes)
- [stringLowercase](#stringLowercase)
- [stringUppercase](#stringUppercase)
- [checkEmptyStrings](#checkEmptyStrings)
- [checkStringLength](#checkStringLength)
- [ignoreNonStringsTypes](#ignoreNonStringsTypes)
- [dataIncldesPatternPart](#dataIncldesPatternPart)
- [dataIncludesMembers](#dataIncludesMembers)
- [patternIncludesMembers](#patternIncludesMembers)

## customCheck

```js
const { compare } = require('sat-compare');
{
  const data = { prop: ' test ' };
  const check = { prop: text => text.includes('test') };

  const { result, message } = compare(data, check, { customCheck: true });
  // result true
  // message ''
}
{
  const data = { prop: [2, 4, 6] };
  const check = { prop: arr => arr.every(i => i % 2 === 0) };

  const { result, message } = compare(data, check, { customCheck: true });
  // result true
  // message ''
}
```

## stringIncludes

```js
const { compare } = require('sat-compare');
{
  const data = { prop: ' test ' };
  const check = { prop: 't' };

  const { result, message } = compare(data, check, { stringIncludes: true });
  // result true
  // message ''
}
```

## stringLowercase

```js
const { compare } = require('sat-compare');
{
  const data = { prop: 'TEST' };
  const check = { prop: 'test' };

  const { result, message } = compare(data, check, { stringLowercase: true });
  // result true
  // message ''
}
```

## stringUppercase

```js
const { compare } = require('sat-compare');
{
  const data = { prop: 'TEST' };
  const check = { prop: 'test' };

  const { result, message } = compare(data, check, { stringUppercase: true });
  // result true
  // message ''
}
```

## checkEmptyStrings

```js
const { compare } = require('sat-compare');
{
  const data = { prop: 'TEST' };
  const check = {};

  const { result, message } = compare(data, check, { checkEmptyStrings: true });
  // result true
  // message ''
}
```

## checkStringLength

```js
const { compare } = require('sat-compare');
{
  const data = { prop: 'TEST' };
  const check = { prop: { length: '>2' } };

  const { result, message } = compare(data, check, { checkStringLength: true });
  // result true
  // message ''
}
{
  const data = { prop: 'TEST' };
  const check = { prop: { length: 4 } };

  const { result, message } = compare(data, check, { checkStringLength: true });
  // result true
  // message ''
}
```

## ignoreNonStringsTypes

```js
const { compare } = require('sat-compare');
{
  const data = { prop1: '1', prop2: 2 };
  const check = { prop1: '1', prop2: 3 };

  const { result, message } = compare(data, check, { ignoreNonStringsTypes: true });
  // result true
  // message ''
}
```

## dataIncldesPatternPart

```js
const { compare } = require('sat-compare');
{
  const data = { prop1: '1', prop2: 2, prop3: 3 };
  const check = { prop1: '1', prop4: 3, prop5: 5 };

  const { result, message } = compare(data, check, { dataIncldesPatternPart: true });
  // result true
  // message ''
}
```

## dataIncludesMembers

```js
const { compare } = require('sat-compare');
{
  const data = { prop1: { a: [1, 2, 3, 4] } };
  const check = { prop1: { a: [1, 3, 2] } };

  const { result, message } = compare(data, check, { dataIncludesMembers: true });
  // result true
  // message ''
}
```
