import { faker } from '@faker-js/faker';

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

export const createCardData = () => ({
  cardNumber: faker.string.numeric(16),
  cardDate: `${faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0')}/${faker.number.int({ min: 27, max: 35 })}`,
  cardCVV: faker.string.numeric(3),
});

export const apiDataPost = {
  title: 'Hello World',
  body: 'Test body',
  userId: 1,
};

export const apiDataPatch = {
  title: 'Hello AQA',
};
