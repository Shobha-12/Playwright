import{page} from '@playwright/test';

export class LoginPage{
    constructor(page){
        this.page=page;
        this.usernameInput = page.locator("input[placeholder='Enter your username']");
        this.passwordInput = page.locator("input[placeholder='Enter your password']");
        this.loginButton = page.locator("input[value='Login']");
        this.errorMessage = page.locator("#msgbox");
        this.userNameErrorMessage = page.locator("span#error-username");
        this.passwordErrorMessage = page.locator("span#error-password");
    }

    async navigateToWheeboxLoginPage(){
        await this.page.goto('https://uat1.wheebox.com/LOGIN-2/sales.jsp');
    }

    async loginWithCredentials(username, password) {
        await this.usernameInput.click();
        await this.usernameInput.fill(username);
        await this.passwordInput.click();
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}