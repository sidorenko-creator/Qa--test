import { faker } from '@faker-js/faker';

/**
 * @typedef {Object} User
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} password
 * @property {string} city
 * @property {string} country
 * @property {string} phoneNumber
 * @property {string} streetAndHouseNumber
 * @property {string} zipcode
 */

/**
 * @typedef {Object} Card
 * @property {string} cardNumber  16 цифр
 * @property {string} cardDate    формат MM/YY
 * @property {string} cardCVV     3 цифры
 */

/**
 * Генерирует нового случайного пользователя для регистрации.
 * Каждый вызов даёт уникальный email, поэтому тесты не конфликтуют между собой.
 * @returns {User}
 */
export const createUser = () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password({ length: 12 }),
  city: faker.location.city(),
  country: 'Ukraine',
  phoneNumber: faker.string.numeric(10),
  streetAndHouseNumber: faker.location.streetAddress(),
  zipcode: faker.location.zipCode(),
});

/**
 * Генерирует данные банковской карты (срок действия всегда в будущем: 2027–2035).
 * @returns {Card}
 */
export const createCardData = () => ({
  cardNumber: faker.string.numeric(16),
  cardDate: `${faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0')}/${faker.number.int({ min: 27, max: 35 })}`,
  cardCVV: faker.string.numeric(3),
});

// ── Данные для API-тестов ──
export const apiDataPost = {
  title: 'Hello World',
  body: 'Test body',
  userId: 1,
};

export const apiDataPatch = {
  title: 'Hello AQA',
};
