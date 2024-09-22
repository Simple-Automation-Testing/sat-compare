const messageKeyRg = /message key: [\w\s]+\[\d+\]|message key: [\w\s]+/gim;
const indexRg = /(\[\d\])$/gim;
const indexGlobalRg = /(\[\d\])/gim;

function rearrangeMessageKeys(notFormattedMessage: string) {
  const messages = notFormattedMessage.split('Message:').filter(Boolean);
  const sanitizedMessages = messages.filter(mPart => (mPart.match(indexGlobalRg) || ['']).join('') !== mPart);

  if (messages.length === sanitizedMessages.length && sanitizedMessages.length !== 1) {
    return messages
      .map(message => rearrangeMessageKeys(`Message:${message}`))
      .reverse()
      .join(' ');
  }

  const matched = notFormattedMessage
    .split('message key:')
    .map(item => (item.includes('Message: ') ? item : `message key: ${item.trim()}`).trim())
    .reverse();

  if (matched.length === 0) {
    return notFormattedMessage;
  }

  matched.forEach(matchedItem => {
    const [mathedIndex] = matchedItem.match(indexRg) || [''];
    const noIndexThere = matchedItem.replace(mathedIndex, '');

    notFormattedMessage = notFormattedMessage.replace(noIndexThere, '').replace(mathedIndex, '');
  });

  for (let i = 0; i < matched.length; i++) {
    if (matched.length === 2) {
      continue;
    }
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
