// import { test, expect } from '@playwright/test';
      // first test playwright codegen
// test('test', async ({ page }) => {
//   await page.goto('https://aqa-app.vercel.app/login');
//   await page.getByRole('button', { name: 'Register' }).click();
//   await page.locator('#register-country').selectOption('Germany');
//   await page.getByRole('textbox', { name: 'First Name' }).click();
//   await page.getByRole('textbox', { name: 'First Name' }).fill('rose');
//   await page.getByRole('textbox', { name: 'Last Name' }).click();
//   await page.getByRole('textbox', { name: 'Last Name' }).fill('das');
//   await page.getByRole('textbox', { name: 'Email Address' }).dblclick();
//   await page.getByRole('textbox', { name: 'Email Address' }).fill('sassss@gmail.com');
//   await page.getByRole('textbox', { name: 'City' }).click();
//   await page.getByRole('textbox', { name: 'City' }).fill('Kyiv');
//   await page.locator('#register-country').selectOption('Ukraine');
//   await page.getByRole('textbox', { name: 'Phone Number' }).click();
//   await page.getByRole('textbox', { name: 'Phone Number' }).fill('380975352525');
//   await page.getByRole('textbox', { name: 'Street and House Number' }).dblclick();
//   await page.getByRole('textbox', { name: 'Street and House Number' }).fill('Tuchini 28');
//   await page.getByRole('textbox', { name: 'ZIP Code' }).click();
//   await page.getByRole('textbox', { name: 'ZIP Code' }).fill('33100');
//   await page.getByRole('button', { name: 'Register' }).click();
// });

//  import {test, expect} from '@playwright/test';
//  import {RegisterPage} from './page-object/register.page.js';
//  import {newUser1} from '../data/testdata.js';
//  import {Loginpage} from './page-object/Login.page.js';
//  import {CatalogPage} from './page-object/catalog.page.js'; 
//  import {bucketPage} from './page-object/buscet.page.js';

//  test('test', async ({ page }) => {
//   const loginpage = new Loginpage(page);
//   const registerpage = new RegisterPage(page);
//   const catalogpage = new CatalogPage(page);

  
//   await registerpage.navigate();
//   await registerpage.fillRegistationForm(newUser1);
//   await loginpage.login(newUser1.email, newUser1.password);
//   await catalogpage.selectProduct();
//   const bucketpage = new bucketPage(page, catalogpage.cofeeMachineNameValue, catalogpage.tabletNameValue, catalogpage.cofeeMachinePriceValue, catalogpage.tabletPriceValue  );

//   await bucketpage.compareProductDetails();

//  });


    //2 test manualy   
 //   const registrerbutton = page.locator('[id="login-register-button"]');
//   const Firstname = page.locator('[id="register-first-name"]');
//   const Lastname = page.locator('[id="register-last-name"]');
//   const emailadress = page.locator('[id="register-email"]');
//   const password = page.locator('[id="register-password"]');
//   const city = page.locator('[id="register-city"]');
//   const country = page.locator('[id="register-country"]');
//   const phonenumber = page.locator('[id="register-phone"]');
//   const streetandhousenumber = page.locator('[id="register-street"]');
//   const zipcode = page.locator('[id="register-zip"]');
//   const submitregestretion = page.locator('[id="register-button"]');

//   await page.goto('https://aqa-app.vercel.app/login');
//   await registrerbutton.waitFor();
//   await registrerbutton.click();
//   await Firstname.waitFor();
//   await Firstname.fill('Danylo ');
//   await Lastname.waitFor();
//   await Lastname.fill('Kovalenko');
//   await emailadress.waitFor();
//   await emailadress.fill('danylo.kovalenko@gmail.com');
//   await password.waitFor();
//   await password.fill('Password123');
//   await city.waitFor();
//   await city.fill('Kyiv');
//   await country.waitFor();
//   await country.selectOption('Ukraine');
//   await phonenumber.waitFor();
//   await phonenumber.fill('380975352525');
//   await streetandhousenumber.waitFor();
//   await streetandhousenumber.fill('Tuchini 28');
//   await zipcode.waitFor();
//   await zipcode.fill('33100');
//   await submitregestretion.waitFor();
//   await submitregestretion.click();
//   //await page.pause()

//  });
// import { test, expect } from '@playwright/test';
// import { RegisterPage } from './page-object/register.page.js';
// import { Loginpage } from './page-object/Login.page.js';
// import { CatalogPage } from './page-object/catalog.page.js';
// import { BucketPage } from './page-object/buscet.page.js';
// import { newUser1 } from '../data/testdata.js';
// import { cardData } from '../data/testdata.js';
// import { Checkoutpage } from './page-object/checkout.page.js';
// import { MyAccountPage } from './page-object/MyAccount.page.js';

// test.setTimeout(50 * 1000);
// test('E2E: Успішна реєстрація, авторизація та додавання товарів у кошик', async ({ page }) => {
//   // Ініціалізація сторінок
//   const registerPage = new RegisterPage(page);
//   const loginPage = new Loginpage(page);
//   const catalogPage = new CatalogPage(page);
//   const checkoutPage = new Checkoutpage(page);  
//   //const bucketPage = new BucketPage(page);

//   // 1. Реєстрація
//   await registerPage.navigate();
//   await registerPage.fillRegistationForm (newUser1);

//   // 2. Логін
//   await loginPage.login(newUser1.email, newUser1.password);

//   // 3. Вибір товарів на сторінці каталогу
//   await catalogPage.selectProduct();

//   // 4. Перевірка товарів у кошику
//   const bucketPage = new BucketPage(page,
//     catalogPage.tabletNameValue,
//     catalogPage.cofeeMachineNameValue,
//     catalogPage.tabletPriceValue,
//     catalogPage.cofeeMachinePriceValue
//   );

//   await bucketPage.compareProductsDetails();
//   await bucketPage.checkTotalPrice();

//   await  checkoutPage.fillPaymentData(cardData.cardNumber, cardData.cardData, cardData.cardCVV )

//   await checkoutPage.successOrderMessage();
//   await checkoutPage.goToMyAccount();

//   await MyAccountPage.checkFinalOrder(catalogPage.tabletPriceValue, catalogPage.cofeeMachinePriceValue);
// });
import { test } from '@playwright/test';
import { RegisterPage } from '../Page-Object/page-object/register.page.js';
import { Loginpage } from '../Page-Object/page-object/Login.page.js';
import { CatalogPage } from '../Page-Object/page-object/catalog.page.js';
import { BucketPage } from '../Page-Object/page-object/buscet.page.js';
import { Checkoutpage } from '../Page-Object/page-object/checkout.page.js';
import { MyAccountPage } from '../Page-Object/page-object/MyAccount.page.js';
import { cardData, newUser1 } from '../data/testdata.js';

test.setTimeout(50 * 1000);

test('E2E: Успішна реєстрація, авторизація та додавання товарів у кошик', async ({ page }) => {
  const registerPage = new RegisterPage(page);
   const loginPage = new Loginpage(page);
   const catalogPage = new CatalogPage(page);
   const checkoutPage = new Checkoutpage(page);
  const myAccountPage = new MyAccountPage(page);

  await registerPage.navigate();
  await registerPage.fillRegistationForm (newUser1);
  await loginPage.login(newUser1.email, newUser1.password);
  await catalogPage.selectProduct();

 const bucketPage = new BucketPage(page,
     catalogPage.tabletNameValue,
     catalogPage.cofeeMachineNameValue,
     catalogPage.tabletPriceValue,
     catalogPage.cofeeMachinePriceValue,
  );

  
  await bucketPage.compareProductsDetails();
  await bucketPage.checkTotalPrice();

  await checkoutPage.fillPaymentData(cardData.cardNumber, cardData.cardData, cardData.cardCVV );
  await checkoutPage.successOrderMessage();
  await checkoutPage.goToMyAccount();

  // await myAccountPage.checkFinalOrder(catalogPage.tabletPriceValue, catalogPage.cofeeMachinePriceValue);
  // await myAccountPage.checkTwoItems();
  await myAccountPage.logout();
});