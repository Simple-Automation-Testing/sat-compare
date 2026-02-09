import {
  isNull,
  isArray,
  isObject,
  isPrimitive,
  isUndefined,
  isNumber,
  getType,
  isEmptyObject,
  isFunction,
  isRegExp,
  execNumberExpression,
  toArray,
  safeHasOwnPropery,
} from 'sat-utils';
import {
  toDataIncludes,
  checkThatDataIncludes,
  removeDataIncludesId,
  toPatternIncludes,
  checkThatPatternIncludes,
  removePatternIncludesId,
  toCheckNumber,
  checkThatCheckNumber,
  removeCheckNumberId,
  dataToLowercase,
  checkThatDataLowercase,
  removeDataLowercase,
  patternToLowercase,
  checkThatPatternLowercase,
  removePatternLowercase,
  dataToUppercase,
  checkThatDataUppercase,
  removeDataUppercase,
  patternToUppercase,
  checkThatPatternUppercase,
  removePatternUppercase,
  comparePrimitives,
} from './compare/result.handlers';
import { rearrangeMessageKeys } from './compare/message.format';

function checkLengthIfRequired(expectedLength, actualLength) {
  if (isUndefined(expectedLength)) {
    return true;
  }
  const expectedLengthExpression = isNumber(expectedLength) ? `===${expectedLength}` : expectedLength;

  return execNumberExpression(expectedLengthExpression, actualLength);
}

export type TCompareOpts = {
  // own check function
  customCheck?: boolean;
  // strings
  stringIncludes?: boolean;
  stringLowercase?: boolean;
  stringUppercase?: boolean;
  checkEmptyStrings?: boolean;
  checkStringLength?: boolean;

  ignoreNonStringsTypes?: boolean;
  // objects
  dataIncldesPatternPart?: boolean;
  // arrays
  dataIncludesMembers?: boolean;
  patternIncludesMembers?: boolean;
  everyArrayItem?: boolean;
  allowEmptyArray?: boolean;
  // typecast
  allowNumberTypecast?: boolean;
  // separator
  separator?: string;
  // to ignore
  ignoreProperties?: string | string[];
};

type Tcompare = ((data: any, patter: any, options?: TCompareOpts) => { result: boolean; message: string }) & {
  toDataIncludes: (arg: string) => string;
  checkThatDataIncludes: (arg: string | any) => boolean;
  removeDataIncludesId: (arg: string) => string;
  toPatternIncludes: (arg: string) => string;
  checkThatPatternIncludes: (arg: string | any) => boolean;
  removePatternIncludesId: (arg: string) => string;
  toCheckNumber: (arg: string) => string;
  checkThatCheckNumber: (arg: string | any) => boolean;
  removeCheckNumberId: (arg: string) => string;
  dataToLowercase: (arg: string) => string;
  checkThatDataLowercase: (arg: string | any) => boolean;
  removeDataLowercase: (arg: string) => string;
  patternToLowercase: (arg: string) => string;
  checkThatPatternLowercase: (arg: string | any) => boolean;
  removePatternLowercase: (arg: string) => string;
  dataToUppercase: (arg: string) => string;
  checkThatDataUppercase: (arg: string | any) => boolean;
  removeDataUppercase: (arg: string) => string;
  patternToUppercase: (arg: string) => string;
  checkThatPatternUppercase: (arg: string | any) => boolean;
  removePatternUppercase: (arg: string) => string;
};

const compare: Tcompare = function (dataToCheck, pattern, options?: TCompareOpts) {
  const {
    separator = '->',
    ignoreProperties,

    everyArrayItem = true,
    allowEmptyArray = true,
    patternIncludesMembers,
    customCheck,
    dataIncludesMembers,
    checkEmptyStrings,
    checkStringLength,
    dataIncldesPatternPart = false,

    ...primitivesOpts
  } = options || {};
  const propertiesWhichWillBeIgnored = toArray(ignoreProperties);
  let message = '';

  function compare(data, piece?, arrayIndex?) {
    if (message.length > 0 && !message.endsWith(' ')) {
      message += ' ';
    }

    function compareArrays(dataArray, patternArray) {
      if (
        !dataIncludesMembers &&
        !patternIncludesMembers &&
        !checkLengthIfRequired(patternArray.length, dataArray.length)
      ) {
        message += `Message: expected length: ${patternArray.length}, actual length: ${dataArray.length}`;
        return false;
      }

      if (dataIncludesMembers && dataArray.length < patternArray.length) {
        message += `Message: data can not include all pattern member because of expected length: ${patternArray.length}, actual length: ${dataArray.length}`;
        return false;
      }

      if (patternIncludesMembers && dataArray.length > patternArray.length) {
        message += `Message: pattern can not include all pattern member because of expected length: ${patternArray.length}, actual length: ${dataArray.length}`;
        return false;
      }

      if (dataIncludesMembers) {
        const result = patternArray.every(patternArrayItem =>
          dataArray.some(dataArrayItem => compare(dataArrayItem, patternArrayItem)),
        );

        if (!result) {
          message += 'Message: data does not include all pattern members';
        }

        return result;
      }

      if (patternIncludesMembers) {
        const result = dataArray.every(dataArrayItem =>
          patternArray.some(patternArrayItem => compare(dataArrayItem, patternArrayItem)),
        );

        if (!result) {
          message += 'Message: pattern does not include all data members';
        }

        return result;
      }

      return dataArray.every((dataArrayItem, index) => compare(dataArrayItem, patternArray[index], index));
    }

    if (isFunction(piece) && customCheck) {
      const customCheckResult = piece(data);

      if (!customCheckResult) {
        message += `Message: expected that custom check result should be true`;
      }

      return customCheckResult;
    }

    if (
      isPrimitive(data) &&
      (isPrimitive(piece) ||
        isRegExp(piece) ||
        (checkStringLength && safeHasOwnPropery(piece, 'length') && Object.keys(piece).length === 1))
    ) {
      const { comparisonMessage, comparisonResult } = comparePrimitives(data, piece, {
        checkEmptyStrings,
        checkStringLength,
        ...primitivesOpts,
      });

      if (!comparisonResult) {
        const indexMessage = isNumber(arrayIndex) ? ` [${arrayIndex}]` : '';

        message += `${indexMessage}Message: ${comparisonMessage}`;
      }

      return comparisonResult;
    }

    if (propertiesWhichWillBeIgnored.length && isObject(piece)) {
      piece = Object.keys(piece)
        .filter(key => !propertiesWhichWillBeIgnored.includes(key))
        .reduce((requiredKeys, key) => {
          requiredKeys[key] = piece[key];

          return requiredKeys;
        }, {});
    }

    if ((isEmptyObject(piece) || isUndefined(piece) || isNull(piece)) && checkEmptyStrings && isObject(data)) {
      return Object.keys(data).every(key => {
        const compareResult = compare(data[key]);
        if (!compareResult) {
          const indexMessage = isNumber(arrayIndex) ? `${key} [${arrayIndex}]` : `${key}`;

          message += ` message key: ${indexMessage}`;
        }

        return compareResult;
      });
    }

    if ((isEmptyObject(piece) || isUndefined(piece) || isNull(piece)) && checkEmptyStrings && isArray(data)) {
      return data.every((dataItem, index) => {
        return compare(dataItem, undefined, index);
      });
    }

    if (isObject(piece) && isObject(data)) {
      const call = dataIncldesPatternPart ? 'some' : 'every';

      return Object.keys(piece)[call](key => {
        const compareResult = compare(data[key], piece[key]);
        if (!compareResult) {
          const indexMessage = isNumber(arrayIndex) ? `${key} [${arrayIndex}]` : `${key}`;

          message += ` message key: ${indexMessage}`;
        }

        return compareResult;
      });
    }

    if (isArray(data) && isArray(piece)) {
      return compareArrays(data, piece);
    }

    if (isArray(data) && isObject(piece)) {
      const { length, toCount, ignoreIndexes, toCompare, ...checkDataPiece } = piece;
      const lengthToCheck = safeHasOwnPropery(piece, 'length') ? length : allowEmptyArray ? undefined : '>0';

      if (
        isEmptyObject(checkDataPiece) &&
        checkLengthIfRequired(lengthToCheck, data.length) &&
        !safeHasOwnPropery(piece, 'toCompare')
      ) {
        return true;
      }

      if (checkLengthIfRequired(lengthToCheck, data.length)) {
        const dataWithoutIndexesThatShouldBeIgnored = data.filter((_dataItem, index) => {
          if (isNumber(ignoreIndexes) || isArray(ignoreIndexes)) {
            const ignore = toArray(ignoreIndexes);
            return !ignore.includes(index);
          }
          return true;
        });

        if (isArray(toCompare)) {
          return compareArrays(dataWithoutIndexesThatShouldBeIgnored, toCompare);
        }

        const result = dataWithoutIndexesThatShouldBeIgnored.filter((dataItem, index) => {
          if (isPrimitive(toCompare) && safeHasOwnPropery(piece, 'toCompare')) {
            return compare(dataItem, toCompare, index);
          }
          return compare(dataItem, checkDataPiece, index);
        });

        if (isNumber(toCount)) {
          return toCount === result.length;
        }

        return everyArrayItem ? result.length === dataWithoutIndexesThatShouldBeIgnored.length : Boolean(result.length);
      } else {
        message += `Message: expected length: ${lengthToCheck}, actual length: ${data.length}`;
        return false;
      }
    }

    if (isArray(data) && data.every(i => isPrimitive(i)) && isPrimitive(piece)) {
      const result = data.filter((dataItem, index) => compare(dataItem, piece, index));

      return everyArrayItem ? result.length === data.length : Boolean(result.length);
    }

    if (getType(data) !== getType(piece)) {
      message += `Message: seems like types are not comparable, expected: ${getType(piece)}, actual: ${getType(data)}`;
    }

    return false;
  }

  const result = compare(dataToCheck, pattern);

  if (result) {
    message = '';
    // clean up message
  } else {
    // TODO message formatting should be improved
    const indexPattern = /(\[\d])/gim;

    function createMessage(notFormattedMessage) {
      const rearrangedMessage = rearrangeMessageKeys(notFormattedMessage.trim().replace(/  /gi, ' '));

      if (!rearrangedMessage.includes('message key: ')) {
        return rearrangedMessage;
      }

      const arr: string[] = rearrangedMessage
        .split('message key: ')
        .map(i => i.trim())
        .filter(Boolean);

      return arr
        .map((item, index) => {
          const [indexFromItem] = item.match(indexPattern) || [''];
          const prefix = index === 0 && arr.length === 1 ? separator + indexFromItem : indexFromItem;

          return item.replace(` ${indexFromItem}`, prefix).trim();
        })
        .join(separator)
        .trim();
    }

    const hasMultipleKeys = message.split(' message key: ').length > 2;
    const messageParts = message.split('Message:').map(m => m.trim()).filter(Boolean);
    const hasMultipleMessages = messageParts.filter(m => !indexPattern.test(m)).length > 1;

    if (hasMultipleKeys && hasMultipleMessages) {
      message = messageParts.map(m => createMessage(`Message: ${m}`)).join('\n');
    } else {
      message = createMessage(message);
    }

    message = message
      .replace(new RegExp(` ${separator}`, 'gmi'), separator)
      .replace(new RegExp(`\\s+Message:`, 'gmi'), `${separator}Message:`);
  }

  return { result, message };
} as Tcompare;

compare.toDataIncludes = toDataIncludes;
compare.checkThatDataIncludes = checkThatDataIncludes;
compare.removeDataIncludesId = removeDataIncludesId;
compare.toPatternIncludes = toPatternIncludes;
compare.checkThatPatternIncludes = checkThatPatternIncludes;
compare.removePatternIncludesId = removePatternIncludesId;
compare.toCheckNumber = toCheckNumber;
compare.checkThatCheckNumber = checkThatCheckNumber;
compare.removeCheckNumberId = removeCheckNumberId;
compare.dataToLowercase = dataToLowercase;
compare.checkThatDataLowercase = checkThatDataLowercase;
compare.removeDataLowercase = removeDataLowercase;
compare.patternToLowercase = patternToLowercase;
compare.checkThatPatternLowercase = checkThatPatternLowercase;
compare.removePatternLowercase = removePatternLowercase;
compare.dataToUppercase = dataToUppercase;
compare.checkThatDataUppercase = checkThatDataUppercase;
compare.removeDataUppercase = removeDataUppercase;
compare.patternToUppercase = patternToUppercase;
compare.checkThatPatternUppercase = checkThatPatternUppercase;
compare.removePatternUppercase = removePatternUppercase;

export { compare };
