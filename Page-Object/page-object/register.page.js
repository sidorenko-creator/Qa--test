// 3 test page object model

export class RegisterPage {
    constructor(page) {
        this.page = page;
        this.registrerbutton = page.locator('[id="login-register-button"]');
        this.Firstname = page.locator('[id="register-first-name"]');
        this.Lastname = page.locator('[id="register-last-name"]');
        this.emailadress = page.locator('[id="register-email"]');
        this.password = page.locator('[id="register-password"]');
        this.city = page.locator('[id="register-city"]');
        this.country = page.locator('[id="register-country"]');
        this.phonenumber = page.locator('[id="register-phone"]');
        this.streetandhousenumber = page.locator('[id="register-street"]');
        this.zipcode = page.locator('[id="register-zip"]');
        this.submitregestretion = page.locator('[id="register-button"]');
    }

    async navigate() {
        await this.page.goto('https://aqa-app.vercel.app/login');
    }   
    async fillRegistationForm(testData) {
        await this.registrerbutton.click();
        await this.Firstname.waitFor();
        await this.Firstname.fill(testData.firstName);
        await this.Lastname.waitFor();
        await this.Lastname.fill(testData.lastName);
        await this.emailadress.waitFor();
        await this.emailadress.fill(testData.email);
        await this.password.waitFor();
        await this.password.fill(testData.password);
        await this.city.waitFor();
        await this.city.fill(testData.city);
        await this.country.waitFor();
        await this.country.selectOption(testData.country);
        await this.phonenumber.waitFor();
        await this.phonenumber.fill(testData.phoneNumber);
        await this.streetandhousenumber.waitFor();
        await this.streetandhousenumber.fill(testData.streetAndHouseNumber);
        await this.zipcode.waitFor();
        await this.zipcode.fill(testData.zipcode);
        await this.submitregestretion.waitFor();
        await this.submitregestretion.click();
      //await page.pause()
    }
}



        











        
        
        






//  test('test', async ({ page }) => {

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