/** Форма регистрации (открывается по ссылке на странице логина). */
export class RegisterPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.registerLink = page.locator('#login-register-button');
    this.firstName = page.locator('#register-first-name');
    this.lastName = page.locator('#register-last-name');
    this.email = page.locator('#register-email');
    this.password = page.locator('#register-password');
    this.city = page.locator('#register-city');
    this.country = page.locator('#register-country');
    this.phoneNumber = page.locator('#register-phone');
    this.street = page.locator('#register-street');
    this.zipCode = page.locator('#register-zip');
    this.registerButton = page.locator('#register-button');
  }

  /** Открывает страницу логина — на ней находится ссылка «Register». */
  async open() {
    await this.page.goto('/login');
  }

  /**
   * Открывает форму регистрации, заполняет все поля и отправляет её.
   * @param {ReturnType<import('../data/testdata.js').createUser>} user
   */
  async register(user) {
    await this.registerLink.click();
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.city.fill(user.city);
    await this.country.selectOption(user.country);
    await this.phoneNumber.fill(user.phoneNumber);
    await this.street.fill(user.streetAndHouseNumber);
    await this.zipCode.fill(user.zipcode);
    await this.registerButton.click();
  }
}
