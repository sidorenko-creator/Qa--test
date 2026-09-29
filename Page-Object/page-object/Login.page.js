export class Loginpage {
    constructor(page) {
        this.page = page;
        this.emailadress = page.locator('[id="login-email"]');
        this.passwordfield = page.locator('[id="login-password"]');
        this.loginbutton = page.locator('[id="login-button"]');
        this.catalogtitle = page.locator('[id="catalog-title"]');
    }
async login(email, password) {
       await this.emailadress.fill(email);
       await this.passwordfield.fill(password);
       await this.loginbutton.click();
       await this.catalogtitle.waitFor();
    }
}