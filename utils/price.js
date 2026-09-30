/**
 * Превращает цену из текста в число.
 *
 * Понимает разные форматы:
 *   "$1,299.00"   → 1299      (запятая = тысячи, точка = копейки)
 *   "€1.299,00"   → 1299      (наоборот)
 *   "1 299,50 грн"→ 1299.5
 *   "$100"        → 100
 *   "1,299"       → 1299      (ровно 3 цифры после единственного разделителя = тысячи)
 *
 * Старый вариант просто заменял запятую на точку и превращал "1,299.00" в 1.299 —
 * скрытая ошибка, которая проявилась бы на цене от тысячи.
 *
 * @param {string} value текст цены
 * @returns {number}
 */
export function parsePrice(value) {
  // Оставляем только цифры, точки, запятые и минус (пробелы и валюта уходят)
  const cleaned = String(value).replace(/[^\d.,-]/g, '');

  // Нет ни одной цифры ("бесплатно", пустая строка) → это не цена.
  // Без этой проверки Number('') вернул бы 0 и ошибка осталась бы незамеченной.
  if (!/\d/.test(cleaned)) {
    throw new Error(`Не удалось распознать цену: "${value}"`);
  }

  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');

  let normalized = cleaned;

  if (lastComma !== -1 || lastDot !== -1) {
    // Последний разделитель в строке — кандидат в «десятичный»
    const last = Math.max(lastComma, lastDot);
    const separator = cleaned[last];
    const otherSeparator = separator === ',' ? '.' : ',';

    const hasBothSeparators = cleaned.includes(otherSeparator);
    const occurrences = cleaned.split(separator).length - 1;
    const digitsAfter = cleaned.length - last - 1;
    const isThousandsOnly = !hasBothSeparators && (occurrences > 1 || digitsAfter === 3);

    if (hasBothSeparators) {
      // "1.299,50": последний = десятичный, другой = тысячи
      normalized = cleaned.split(otherSeparator).join('').replace(separator, '.');
    } else if (isThousandsOnly) {
      // "1,299" или "1,299,000": разделитель = тысячи
      normalized = cleaned.split(separator).join('');
    } else {
      // "49.99" или "0,99": разделитель = десятичный
      normalized = cleaned.replace(separator, '.');
    }
  }

  const result = Number(normalized);

  if (Number.isNaN(result)) {
    throw new Error(`Не удалось распознать цену: "${value}"`);
  }

  return result;
}
