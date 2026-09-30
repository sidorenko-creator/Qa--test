/**
 * ID товаров в магазине. Из них строятся все локаторы вида #product-add-<id>,
 * #cart-item-name-<id> и т.д. Нужен другой товар — меняем число здесь,
 * а не ищем «магические» 5 и 6 по всем Page Object.
 */
export const PRODUCT_IDS = {
  coffeeMachine: 6,
  tablet: 5,
};

/**
 * @typedef {Object} Product
 * @property {number} id     ID товара в магазине
 * @property {string} name   название, как показано в каталоге
 * @property {string} price  цена в виде строки, как показано на сайте (например "$99.00")
 */
