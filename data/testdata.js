import { faker } from '@faker-js/faker';

export const newUser1 = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  city: faker.location.city(),
  country: 'Ukraine',
  phoneNumber: faker.phone.number(),
  streetAndHouseNumber: faker.location.streetAddress(),
  zipcode: faker.location.zipCode()
};


export const cardData ={ 
    cardNumber:faker.finance.creditCardNumber(),
    cardData:faker.date.future(),
    cardCVV: faker.finance.creditCardCVV(),
};

export const apiDataPost = {
   title: 'Hello World',
   body: 'Test body',
   userId: 1,
}
export const apiDataPatch = {
  title: 'Hello AQA'
}