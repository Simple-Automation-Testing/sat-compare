/* eslint-disable unicorn/better-regex */
const messageKeyRg = /message key: [\w\s]+\[\d+\]|message key: [\w\s]+/gim;
const indexRg = /(\[\d\])$/gim;
const indexGlobalRg = /(\[\d\])/gim;

function rearrangeMessageKeys(notFormattedMessage: string) {
  const matched: string[] = (notFormattedMessage.match(messageKeyRg) || []).reverse();

  if (matched.length === 0) {
    return notFormattedMessage;
  }

  matched.forEach(matchedItem => {
    const [mathedIndex] = matchedItem.match(indexRg) || [''];
    const noIndexThere = matchedItem.replace(mathedIndex, '');

    notFormattedMessage = notFormattedMessage.replace(noIndexThere, '').replace(mathedIndex, '');
  });

  matched.push(notFormattedMessage.trim());

  for (let i = 0; i < matched.length; i++) {
    if (i === matched.length - 2) {
      // next matched key
      const messageItem = matched[i + 1];

      const indexes = messageItem.match(indexGlobalRg) || [''];

      matched[i] += ` ${indexes.reverse().join('')}`;

      indexes.forEach(index => {
        matched[i + 1] = matched[i + 1].replace(index, '');
      });
    } else if (i !== matched.length - 1) {
      // next matched key
      const currentMatchedKey = matched[i + 1];

      const indexes = currentMatchedKey.match(indexRg) || [''];

      matched[i] += ` ${indexes.reverse().join('')}`;

      indexes.forEach(index => {
        matched[i + 1] = matched[i + 1].replace(index, '');
      });
    }
  }

  return matched.join(' ');
}

export { rearrangeMessageKeys };
