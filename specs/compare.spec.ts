import { deepStrictEqual } from 'assert';
import { compare } from '../lib';

describe('compare', function () {
  it('[P] compare array includes pattern', function () {
    {
      const data = [1, 2, 3, 4];
      const pattern = 1;

      const { result, message } = compare(data, pattern, { everyArrayItem: false });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[P] compare every array item is a pattern', function () {
    {
      const data = [1, 1, 1, 1];
      const pattern = 1;

      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compare every array item is a pattern', function () {
    {
      const data = [{ t: 1 }, { t: 2 }, { t: 3 }];
      const pattern = { t: 1 };

      const { result, message } = compare(data, pattern);

      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        't[2]->Message: expected: 1, actual: 3->t[1]->Message: expected: 1, actual: 2',
        'Message should be empty',
      );
    }
  });

  it('[N] compare every array item is a pattern', function () {
    {
      const data = [2, 1, 3, 4];
      const pattern = 1;

      const { result, message } = compare(data, pattern);

      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        '[0]Message: expected: 1, actual: 2 [2]Message: expected: 1, actual: 3 [3]Message: expected: 1, actual: 4',
        'Message should be empty',
      );
    }
  });

  it('[N] compare every array item is a pattern', function () {
    {
      const data = { a: [2, 1, 3, 4] };
      const pattern = { a: 1 };

      const { result, message } = compare(data, pattern);

      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'a->[0]Message: expected: 1, actual: 2 [2]Message: expected: 1, actual: 3 [3]Message: expected: 1, actual: 4',
        'Message should be empty',
      );
    }
  });

  it('[P] compare dataIncldesPatternPart', function () {
    {
      const data = { a: { text: 'a' }, b: { text: 'b' }, c: { text: 'c' } };
      const pattern = { a: { text: '' }, b: { text: 'b' } };

      const { result, message } = compare(data, pattern, {
        dataIncldesPatternPart: true,
      });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const data = { a: { text: 'a' }, b: { text: 'b' }, c: { text: 'c' } };
      const pattern = { a: { text: '' }, b: { text: 'b' }, x: { text: 'x' } };

      const { result, message } = compare(data, pattern, {
        dataIncldesPatternPart: true,
      });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compare dataIncldesPatternPart', function () {
    {
      const data = { a: { text: 'a' }, b: { text: 'b' }, c: { text: 'c' } };
      const pattern = { a: { text: '' }, b: { text: '' } };

      const { result, message } = compare(data, pattern, {
        dataIncldesPatternPart: true,
      });
      deepStrictEqual(result, false, 'Should be same');

      deepStrictEqual(
        message,
        'a->text->Message: expected: , actual: a' + '\n' + 'b->text->Message: expected: , actual: b',
        'Message should be empty',
      );
    }
  });

  it('[P] compare custom check', function () {
    {
      const pattern = (item: string) => item.includes(' ');
      const data = '       ';

      const { result, message } = compare(data, pattern, {
        customCheck: true,
      });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = (item: string) => item.includes('');
      const data = ['', ''];

      const { result, message } = compare(data, pattern, {
        customCheck: true,
      });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = { a: { b: (item: string) => item.includes('') } };
      const data = { a: { b: ['', ''] } };

      const { result, message } = compare(data, pattern, {
        customCheck: true,
      });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compare custom check', function () {
    {
      const pattern = (item: string) => item.includes(' ');
      const data = '       ';

      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'Message: seems like types are not comparable, expected: function, actual: string',
        'Message should be empty',
      );
    }
    {
      const pattern = (item: string) => item.includes('x');
      const data = '       ';

      const { result, message } = compare(data, pattern, { customCheck: true });
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(message, 'Message: expected that custom check result should be true', 'Message should be empty');
    }
    {
      const pattern = { a: { b: (item: string) => item.includes('x') } };
      const data = { a: { b: ['', ''] } };

      const { result, message } = compare(data, pattern, {
        customCheck: true,
      });
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'a->b->Message: expected that custom check result should be true',
        'Message should be empty',
      );
    }
  });

  it('[P] compare check string length', function () {
    {
      const pattern = { length: '>1' };
      const data = '       ';

      const { result, message } = compare(data, pattern, {
        checkStringLength: true,
      });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = { length: '>=1' };
      const data = '       ';

      const { result, message } = compare(data, pattern, {
        checkStringLength: true,
      });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = { length: 0 };
      const data = '';

      const { result, message } = compare(data, pattern, {
        checkStringLength: true,
      });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = { length: '<=25' };
      const data = '1';

      const { result, message } = compare(data, pattern, {
        checkStringLength: true,
      });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compare check string length', function () {
    {
      const pattern = { length: '>1' };
      const data = '';

      const { result, message } = compare(data, pattern, {
        checkStringLength: true,
      });
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'Message: expected: string has >1 length, actual: string has 0 length',
        'Message should not be empty',
      );
    }
    {
      const pattern = { a: { length: '<1' } };
      const data = { a: '1' };

      const { result, message } = compare(data, pattern, {
        checkStringLength: true,
      });
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'a->Message: expected: string has <1 length, actual: string has 1 length',
        'Message should not be empty',
      );
    }
  });

  it('[P] compare ignoreNonStringsTypes', function () {
    {
      const pattern = {
        field: { b: '1', x: 77 },
      };

      const data = {
        field: { b: '1', x: 2 },
      };

      const { result, message } = compare(data, pattern, { ignoreNonStringsTypes: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[P] compare checkEmptyStrings', function () {
    {
      const pattern = {};

      const data = {
        field: { b: '1', x: {} },
      };

      const { result, message } = compare(data, pattern, {
        checkEmptyStrings: true,
        ignoreNonStringsTypes: true,
      });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {};

      const data = {
        field: { b: '1', x: {}, y: [] },
      };

      const { result, message } = compare(data, pattern, {
        checkEmptyStrings: true,
        ignoreNonStringsTypes: true,
      });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {};

      const data = {
        field: { b: '1', x: {}, y: [{ x: {}, y: { x: [] } }] },
      };

      const { result, message } = compare(data, pattern, {
        checkEmptyStrings: true,
        ignoreNonStringsTypes: true,
      });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {};

      const data = {
        field: { a: [{ b: true, a: 'a' }, { a: 'a' }, { a: 'a' }, { a: '2' }] },
      };

      const { result, message } = compare(data, pattern, {
        checkEmptyStrings: true,
        ignoreNonStringsTypes: true,
      });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {};

      const data = {
        field: { a: [{ a: 'a' }, { a: 'a' }, { a: 'a' }, { a: '2' }] },
      };

      const { result, message } = compare(data, pattern, { checkEmptyStrings: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const data = {
        field: { a: [{ a: 'a' }, { a: 'a' }, { a: 'a' }, { a: '2' }] },
        field1: { a: [{ a: 'a' }, { a: 'a' }, { a: 'a' }, { a: { a: { b: { c: ['test'] } } } }] },
      };

      const { result, message } = compare(data, undefined, { checkEmptyStrings: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field1: { a: { action: 1 } },
      };
      const data = {
        field: { a: [{ a: 'a' }, { a: 'a' }, { a: 'a' }, { a: '2' }] },
        field1: { a: [{ a: 'a' }, { a: 'a' }, { a: 'a' }, { a: { a: { b: { c: ['test'] } } } }] },
      };

      const { result, message } = compare(data, pattern, {
        checkEmptyStrings: true,
        ignoreProperties: ['action'],
      });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compare checkEmptyStrings', function () {
    {
      const pattern = {};

      const data = {
        field: '',
      };

      const { result, message } = compare(data, pattern, { checkEmptyStrings: true });
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(message, 'field->Message: expected: should not be empty string', 'Message should not be empty');
    }
    {
      const pattern = {};

      const data = {
        field: { a: { b: { c: '' } } },
      };

      const { result, message } = compare(data, pattern, { checkEmptyStrings: true });
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field->a->b->c->Message: expected: should not be empty string',
        'Message should not be empty',
      );
    }
    {
      const pattern = {};

      const data = {
        field: { a: [{ a: 'a' }, { a: 'a' }, { a: 'a' }, { a: '' }] },
      };

      const { result, message } = compare(data, pattern, { checkEmptyStrings: true });
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field->a[3]->a->Message: expected: should not be empty string',
        'Message should not be empty',
      );
    }
    {
      const data = {
        field: { a: [{ a: 'a' }, { a: 'a' }, { a: 'a' }, { a: '2' }] },
        field1: { a: [{ a: 'a' }, { a: 'a' }, { a: 'a' }, { a: { a: { b: { c: ['test', 'test', ''] } } } }] },
      };

      const { result, message } = compare(data, undefined, { checkEmptyStrings: true });
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field1->a[3]->a->a->b->c[2]->Message: expected: should not be empty string',
        'Message should be empty',
      );
    }
  });

  it('[P] compare toCount', function () {
    {
      const pattern = {
        field: { a: { toCount: 3, a: 'a' } },
      };
      const data = {
        field: { a: [{ a: 'a' }, { a: 'a' }, { a: 'a' }, { a: '2' }] },
      };
      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compare toCount', function () {
    {
      const pattern = {
        field: { a: { toCount: 2, a: 'a' } },
      };
      const data = {
        field: { a: [{ a: 'a' }, { a: 'a' }, { a: 'a' }, { a: '2' }] },
      };
      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(message, 'field->a[3]->a->Message: expected: a, actual: 2', 'Message should be empty');
    }
  });

  it('[P] compare compare arrays', function () {
    {
      const pattern = {
        field: { a: [] },
      };
      const data = {
        field: { a: [] },
      };
      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: [1, 2, 3, 4] },
      };
      const data = {
        field: { a: [1, 2, 3, 4] },
      };
      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compare compare arrays', function () {
    {
      const pattern = {
        field: { a: [1] },
      };
      const data = {
        field: { a: [] },
      };
      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(message, 'field->a->Message: expected length: 1, actual lenght: 0', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: [] },
      };
      const data = {
        field: { a: [1] },
      };
      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(message, 'field->a->Message: expected length: 0, actual lenght: 1', 'Message should be empty');
    }
  });

  it('[P] compare dataIncludesMembers', function () {
    {
      const pattern = {
        field: { a: [1, 3, 2] },
      };
      const data = {
        field: { a: [1, 2, 3, 4] },
      };
      const { result, message } = compare(data, pattern, { dataIncludesMembers: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: [] },
      };
      const data = {
        field: { a: [1, 2, 3, 4] },
      };
      const { result, message } = compare(data, pattern, { dataIncludesMembers: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: [] },
      };
      const data = {
        field: { a: [] },
      };
      const { result, message } = compare(data, pattern, { dataIncludesMembers: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compare dataIncludesMembers', function () {
    {
      const pattern = {
        field: { a: [1, 3, 5] },
      };
      const data = {
        field: { a: [1, 2, 3, 4] },
      };
      const { result, message } = compare(data, pattern, { dataIncludesMembers: true });

      const expectedComparisonMessage =
        'Message: expected: 3, actual: 1->Message: expected: 3, actual: 2->Message: expected: 5, actual: 1->Message: expected: 5, actual: 2->Message: expected: 5, actual: 3->Message: expected: 5, actual: 4\n' +
        'field->a->Message: data does not include all pattern members';
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(message, expectedComparisonMessage, 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: [1, 2, 3, 4] },
      };
      const data = {
        field: { a: [] },
      };
      const { result, message } = compare(data, pattern, { dataIncludesMembers: true });
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field->a->Message: data does not include all pattern members',
        'Message should be empty',
      );
    }
    {
      const pattern = {
        field: { a: [] },
      };
      const data = {
        field: { a: [] },
      };
      const { result, message } = compare(data, pattern, { dataIncludesMembers: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[P] compare patternIncludesMembers', function () {
    {
      const pattern = {
        field: { a: [1, 2, 3, 4] },
      };
      const data = {
        field: { a: [1, 3, 2] },
      };
      const { result, message } = compare(data, pattern, { patternIncludesMembers: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: [1, 2, 3, 4] },
      };
      const data = {
        field: { a: [] },
      };
      const { result, message } = compare(data, pattern, { patternIncludesMembers: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: [] },
      };
      const data = {
        field: { a: [] },
      };
      const { result, message } = compare(data, pattern, { patternIncludesMembers: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compare patternIncludesMembers', function () {
    {
      const pattern = {
        field: { a: [1, 2, 3, 4] },
      };
      const data = {
        field: { a: [1, 3, 5] },
      };
      const { result, message } = compare(data, pattern, { patternIncludesMembers: true });
      deepStrictEqual(result, false, 'Should be same');
      const expectedComparisonMessage =
        'Message: expected: 1, actual: 3->Message: expected: 2, actual: 3->Message: expected: 1, actual: 5->Message: expected: 2, actual: 5->Message: expected: 3, actual: 5->Message: expected: 4, actual: 5\n' +
        'field->a->Message: pattern does not include all data members';

      deepStrictEqual(message, expectedComparisonMessage, 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: [] },
      };
      const data = {
        field: { a: [1, 2, 3, 4] },
      };
      const { result, message } = compare(data, pattern, { patternIncludesMembers: true });
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field->a->Message: pattern does not include all data members',
        'Message should be empty',
      );
    }
    {
      const pattern = {
        field: { a: [] },
      };
      const data = {
        field: { a: [] },
      };
      const { result, message } = compare(data, pattern, { patternIncludesMembers: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[P] compare patternToLowercase', function () {
    {
      const pattern = {
        field: { a: compare.patternToLowercase('12ADS') },
      };
      const data = {
        field: { a: '12ads' },
      };
      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: compare.patternToLowercase('12ADS') },
      };
      const data = {
        field: { a: '12ads12342121' },
      };
      const { result, message } = compare(data, pattern, { stringIncludes: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compare patternToLowercase', function () {
    {
      const pattern = {
        field: { a: compare.patternToLowercase('12ADS') },
      };
      const data = {
        field: { a: '12ads222' },
      };
      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field->a->Message: expected: 12ads, actual: 12ads222 pattern is lowercased',
        'Message should be empty',
      );
    }
  });

  it('[P] compare patternToUppercase', function () {
    {
      const pattern = {
        field: { a: compare.patternToUppercase('12ads') },
      };
      const data = {
        field: { a: '12ADS' },
      };
      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: compare.patternToUppercase('12ads') },
      };
      const data = {
        field: { a: '12ADS12342121' },
      };
      const { result, message } = compare(data, pattern, { stringIncludes: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compare patternToUppercase', function () {
    {
      const pattern = {
        field: { a: compare.patternToUppercase('12ads') },
      };
      const data = {
        field: { a: '12ADS121' },
      };
      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field->a->Message: expected: 12ADS, actual: 12ADS121 pattern is uppercased',
        'Message should be empty',
      );
    }
  });

  it('[P] compare dataToLowercase', function () {
    {
      const pattern = {
        field: { a: compare.dataToLowercase('12ads') },
      };
      const data = {
        field: { a: '12ADS' },
      };
      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: compare.dataToLowercase('12ads') },
      };
      const data = {
        field: { a: '12ADS12342121' },
      };
      const { result, message } = compare(data, pattern, { stringIncludes: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compare dataToLowercase', function () {
    {
      const pattern = {
        field: { a: compare.dataToLowercase('12ads111') },
      };
      const data = {
        field: { a: '12ADS' },
      };
      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field->a->Message: expected: 12ads111, actual: 12ads data is lowercased',
        'Message should be empty',
      );
    }
  });

  it('[P] compare dataToUppercase', function () {
    {
      const pattern = {
        field: { a: compare.dataToUppercase('12ADS') },
      };
      const data = {
        field: { a: '12ads' },
      };
      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: compare.dataToUppercase('12ADS') },
      };
      const data = {
        field: { a: '12ads12342121' },
      };
      const { result, message } = compare(data, pattern, { stringIncludes: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compare dataToUppercase', function () {
    {
      const pattern = {
        field: { a: compare.dataToUppercase('12ADS') },
      };
      const data = {
        field: { a: '12adsaaa' },
      };
      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field->a->Message: expected: 12ADS, actual: 12ADSAAA data is uppercased',
        'Message should be empty',
      );
    }
  });

  it('[P] compare stringLowercase', function () {
    {
      const pattern = {
        field: { a: '12ADS' },
      };
      const data = {
        field: { a: '12ads' },
      };
      const { result, message } = compare(data, pattern, { stringLowercase: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: '12ads' },
      };
      const data = {
        field: { a: '12ADS' },
      };
      const { result, message } = compare(data, pattern, { stringLowercase: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compare stringLowercase', function () {
    {
      const pattern = {
        field: { a: '12ADSa' },
      };
      const data = {
        field: { a: '12asd' },
      };
      const { result, message } = compare(data, pattern, { stringLowercase: true });
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field->a->Message: expected: 12adsa, actual: 12asd data and pattern are lowercased',
        'Message should be empty',
      );
    }
    {
      const pattern = {
        field: { a: '12asd' },
      };
      const data = {
        field: { a: '12ADSa' },
      };
      const { result, message } = compare(data, pattern, { stringLowercase: true });
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field->a->Message: expected: 12asd, actual: 12adsa data and pattern are lowercased',
        'Message should be empty',
      );
    }
  });

  it('[P] compare stringUppercase', function () {
    {
      const pattern = {
        field: { a: '12ADS' },
      };
      const data = {
        field: { a: '12ads' },
      };
      const { result, message } = compare(data, pattern, { stringUppercase: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: '12ads' },
      };
      const data = {
        field: { a: '12ADS' },
      };
      const { result, message } = compare(data, pattern, { stringUppercase: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compare stringLowercase', function () {
    {
      const pattern = {
        field: { a: '12ADSa' },
      };
      const data = {
        field: { a: '12asd' },
      };
      const { result, message } = compare(data, pattern, { stringUppercase: true });
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field->a->Message: expected: 12ADSA, actual: 12ASD data and pattern are uppercased',
        'Message should be empty',
      );
    }
    {
      const pattern = {
        field: { a: '12asd' },
      };
      const data = {
        field: { a: '12ADSa' },
      };
      const { result, message } = compare(data, pattern, { stringUppercase: true });
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(
        message,
        'field->a->Message: expected: 12ASD, actual: 12ADSA data and pattern are uppercased',
        'Message should be empty',
      );
    }
  });

  it('[P] compare allowNumberTypecast', function () {
    {
      const pattern = {
        field: { a: 1 },
      };
      const data = {
        field: { a: '1' },
      };
      const { result, message } = compare(data, pattern, { allowNumberTypecast: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: { a: 1 },
      };
      const data = {
        field: { a: '        1          ' },
      };
      const { result, message } = compare(data, pattern, { allowNumberTypecast: true });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[P] compare allowEmptyArray', function () {
    {
      const pattern = {
        field: { a: 1 },
      };
      const data = {
        field: [],
      };
      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = { field: { a: 1 } };
      const data = { field: [] };
      const { result, message } = compare(data, pattern, { allowEmptyArray: false });
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(message, 'field->Message: expected length: >0, actual lenght: 0', 'Message should not be empty');
    }
    {
      const pattern = {
        field: { length: 0 },
      };
      const data = {
        field: [],
      };
      const { result, message } = compare(data, pattern, { allowEmptyArray: false });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[P] compare _check_number', function () {
    {
      const pattern = {
        field: compare.toCheckNumber('> 10'),
      };
      const data = {
        field: 11,
      };

      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const pattern = {
        field: compare.toCheckNumber('> 10 and < 12'),
      };
      const data = {
        field: 11,
      };

      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
  });

  it('[N] compare _check_number', function () {
    {
      const pattern = {
        field: compare.toCheckNumber(' > 11'),
      };
      const data = {
        field: 11,
      };

      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, false, 'Should be same');
      deepStrictEqual(message, 'field->Message: expected: 11 > 11', 'Message should not be empty');
    }
  });

  it('[P] compare onlyObject', function () {
    const pattern = {
      a: { text: 'first' },
      b: {
        c: { d: { text: 'second' } },
      },
    };

    const data = {
      a: { text: 'first' },
      b: {
        c: { d: { text: 'second' } },
      },
    };

    const { result, message } = compare(data, pattern);
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compare with array', function () {
    const pattern = {
      c: { a: 1 },
    };

    const data = {
      c: [{ a: 1 }],
    };

    const { result, message } = compare(data, pattern);
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compare with sub arrays', function () {
    const pattern = {
      c: { a: { b: { c: { d: 12 } } } },
    };

    const data = {
      c: [{ a: [{ b: [{ c: [{ d: 12 }] }] }] }],
    };

    const { result, message } = compare(data, pattern);
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compare with length', function () {
    const pattern = {
      c: {
        length: 1,
        a: 'test',
      },
    };

    const data = {
      c: [{ a: 'test' }],
    };

    const { result, message } = compare(data, pattern);
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compare stringIncludes true', function () {
    const pattern = {
      c: {
        length: 1,
        a: 'different part',
      },
    };

    const data = {
      c: [{ a: 'long string with different parts' }],
    };

    const { result, message } = compare(data, pattern, { stringIncludes: true });
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compare _data_includes', function () {
    const pattern = {
      c: {
        length: 1,
        a: compare.toDataIncludes('different part'),
      },
    };

    const data = {
      c: [{ a: 'long string with different parts' }],
    };

    const { result, message } = compare(data, pattern);
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compare _pattern_includes', function () {
    const pattern = {
      c: {
        length: 1,
        a: compare.toPatternIncludes('long string with different parts'),
      },
    };

    const data = {
      c: [{ a: 'different part' }],
    };

    const { result, message } = compare(data, pattern);
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compare stringEquals everyArrayItem', function () {
    const pattern = {
      c: { a: 3 },
    };

    const data = {
      c: [{ a: 2 }, { a: 3 }, { a: 2 }, { a: 2 }],
    };

    const { result, message } = compare(data, pattern, { everyArrayItem: false });
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compare check length only', function () {
    {
      const pattern = {
        c: { length: 3 },
      };

      const data = {
        c: [1, 1, 1],
      };

      const { result, message } = compare(data, pattern, { everyArrayItem: false });
      deepStrictEqual(result, true, 'Should be same');
      deepStrictEqual(message, '', 'Message should be empty');
    }
    {
      const data = {
        topItem: {
          arrayItem: [
            {
              item1: true,
              item2: true,
              item3: false,
            },
            {
              item1: true,
              item2: true,
              item3: false,
            },
            {
              item1: true,
              item2: true,
              item3: false,
            },
            {
              item1: true,
              item2: true,
              item3: false,
            },
          ],
        },
      };

      const pattern = {
        topItem: {
          arrayItem: {
            item1: true,
            item2: true,
            item3: { length: '>=0 and <=3' },
          },
        },
      };
    }
  });

  it('[P] compare check toCompare primitive', function () {
    const pattern = {
      c: { toCompare: 1 },
    };

    const data = {
      c: [1, 1, 1],
    };

    const { result, message } = compare(data, pattern, { everyArrayItem: false });
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compare check toCompare array', function () {
    const pattern = {
      c: { toCompare: [1, 1, 1] },
    };

    const data = {
      c: [1, 1, 1],
    };

    const { result, message } = compare(data, pattern, { everyArrayItem: false });
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compare check toCompare array dataIncludesMembers', function () {
    const pattern = {
      c: { toCompare: [1] },
    };

    const data = {
      c: [1, 1, 1],
    };

    const { result, message } = compare(data, pattern, { dataIncludesMembers: true });
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[N] compare check toCompare array dataIncludesMembers', function () {
    const pattern = {
      c: { toCompare: [2] },
    };

    const data = {
      c: [1, 1, 1],
    };

    const { result, message } = compare(data, pattern, { dataIncludesMembers: true });
    deepStrictEqual(result, false, 'Should be same');
    deepStrictEqual(
      message,
      'c->Message: data does not include all pattern members->Message: expected: 2, actual: 1->Message: expected: 2, actual: 1->Message: expected: 2, actual: 1',
      'Message should be empty',
    );
  });

  it('[P] compare check toCompare array patternIncludesMembers', function () {
    const pattern = {
      c: { toCompare: [2, 2, 2, 3] },
    };

    const data = {
      c: [2, 3],
    };

    const { result, message } = compare(data, pattern, { patternIncludesMembers: true });
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[N] compare check toCompare array patternIncludesMembers', function () {
    const pattern = {
      c: { toCompare: [2, 2] },
    };

    const data = {
      c: [5],
    };

    const { result, message } = compare(data, pattern, { patternIncludesMembers: true });
    deepStrictEqual(result, false, 'Should be same');
    deepStrictEqual(
      message,
      'c->Message: pattern does not include all data members->Message: expected: 2, actual: 5->Message: expected: 2, actual: 5',
      'Message should be empty',
    );
  });

  it('[P] compare check toCompare array with ignore indexes', function () {
    const pattern = {
      c: { toCompare: [1, 1, 1], ignoreIndexes: [0, 1] },
    };

    const data = {
      c: [2, 3, 1, 1, 1],
    };

    const { result, message } = compare(data, pattern);
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[N] compare check toCompare array with ignore indexes', function () {
    const pattern = {
      c: { toCompare: [1, 1, 1], ignoreIndexes: [0, 4] },
    };

    const data = {
      c: [2, 3, 1, 1, 1],
    };

    const { result, message } = compare(data, pattern);
    deepStrictEqual(result, false, 'Should not same');
    deepStrictEqual(message, 'c->[0]Message: expected: 1, actual: 3', 'Message should be empty');
  });

  it('[P] compare check compareArrays', function () {
    const pattern = {
      c: [1, 1, 1],
    };

    const data = {
      c: [1, 1, 1],
    };

    const { result, message } = compare(data, pattern, { everyArrayItem: false });
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] compare ignoreProperties', function () {
    const pattern = {
      c: { a: 3 },
      shouldBeIgnored: { a: 'b' },
    };

    const data = {
      c: { a: 3 },
      shouldBeIgnored: { a: 'xx' },
    };

    const { result, message } = compare(data, pattern, { ignoreProperties: 'shouldBeIgnored' });
    deepStrictEqual(result, true, 'Should be same');
    deepStrictEqual(message, '', 'Message should be empty');
  });

  it('[P] ignoreProperties for arr', function () {
    const data = {
      a: {
        b: [
          {
            c: true,
            d: [true],
          },
        ],
      },
    };
    const pattern = {
      a: {
        b: {
          c: true,
          d: { length: '>0 and <= 3', test: null },
        },
      },
    };

    const { result, message } = compare(data, pattern, { ignoreProperties: ['test'] });
    deepStrictEqual(result, true, `Should be same ${message}`);
  });

  it('[N] compare missed fields', function () {
    {
      const pattern = {
        a: { text: 'first' },
        b: {
          c: { d: { text: 'c' } },
        },
      };

      const data = {
        a: { text: 'first' },
      };

      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, false, 'Should not be same');
      deepStrictEqual(
        message,
        'b->Message: seems like types are not comparable, expected: object, actual: undefined',
        'Message should be empty',
      );
    }
    {
      const pattern = {
        a: { text: 'first' },
        b: { c: { d: { text: 'c' } } },
      };

      const data = {
        a: { text: 'first' },
        b: [{ c: { d: { text: 'c' } } }, { c: { d: { text: 'c' } } }, { c: { d: { text: 'c' } } }, { c: 'str' }],
      };

      const { result, message } = compare(data, pattern);

      deepStrictEqual(result, false, 'Should not be same');
      deepStrictEqual(
        message,
        'b[3]->c->Message: seems like types are not comparable, expected: object, actual: string',
        'Message should be empty',
      );
    }
    {
      const pattern = {
        a: { text: 'first' },
        b: {
          c: { d: { text: 1 } },
        },
      };

      const data = {
        a: { text: 'first' },
        b: [
          { c: { d: [{ text: 1 }] } },
          { c: { d: [{ text: 1 }] } },
          { c: { d: [{ text: 1 }] } },
          { c: { d: [{ text: 1 }, { text: 1 }, { z: 1 }] } },
        ],
      };

      const { result, message } = compare(data, pattern);
      deepStrictEqual(result, false, 'Should not be same');
      deepStrictEqual(
        message,
        'b[3]->c->d[2]->text->Message: expected: 1, actual: undefined',
        'Message should be empty',
      );
    }
  });
});
