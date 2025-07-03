import { test, expect, chromium } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { HomePage } from '../pages/homePage';

test('Positive scenarios', async ({ page }) => {
    const login = new LoginPage(page);
    const home = new HomePage(page)
    const allTestNames = home.testName;
    await test.step('Verify successful login and home page is displayed', async () => {
        await login.navigateToWheeboxLoginPage();
        await login.loginWithCredentials("demosales1@gmail.com", "demoSales1");
        await expect(page).toHaveURL('https://uat1.wheebox.com/WET-2/homeV2.obj');
        await expect(home.homePageTitle).toHaveText('Test Selection');
        await expect(home.allTab).toBeVisible();
        await expect(home.activeTab).toBeVisible();
        await expect(home.expiredTab).toBeVisible();
    });

    await test.step('Search for test Asales2', async () => {
        await page.waitForURL('https://uat1.wheebox.com/WET-2/homeV2.obj');
        await home.searchTest("Asales2");
        await expect(allTestNames).toContainText(['Asales2']);
        await expect(home.testProgress.first()).toBeVisible();
        await expect(home.testDurationText.first()).toBeVisible();
        await expect(home.testAssignedText.first()).toBeVisible();
    });

    await test.step('Verify Active tab', async ({ page }) => {
        await home.openActiveTab();
        await expect(allTestNames).toContainText(['Asales1']);
        await expect(home.testProgress.first()).toBeVisible();
        await expect(home.testDurationText.first()).toBeVisible();
        await expect(home.testAssignedText.first()).toBeVisible();
        await expect(home.continueButton.first()).toBeVisible();
    });

    await test.step('Verify Expired tab', async () => {
        await home.openExpiredTab();
        const cards = home.testCards
        const count = await cards.count();
        for (let i = 1; i < count; i++) {
            await expect(cards.nth(i)).toBeVisible();
        }

    });

    await test.step('Open test page for active test', async ({ page }) => {
        await home.openActiveTab();
        await expect(allTestNames).toContainText(['Asales1']);
        await home.goToTheActiveTest();
    });
});

test('Login with invalid username', async ({ page }) => {
    const login = new LoginPage(page);
    const home = new HomePage(page)
    await test.step('Login with invalid username', async () => {
        await login.navigateToWheeboxLoginPage();
        await login.loginWithCredentials("demosales1", "demoSales1");
        await expect(login.errorMessage).toHaveText('The login id or password is incorrect Four attempts left.');
    });

    await test.step('Login with invalid password', async () => {
        await login.loginWithCredentials("demosales1@gmail.com", "demo");
        await expect(login.errorMessage).toHaveText('The login id or password is incorrect Three attempts left.');
    });

    await test.step('Login with blank credentials', async () => {
        await login.loginWithCredentials("", "");
        await expect(login.userNameErrorMessage).toHaveText('Please enter Username.');
        await expect(login.passwordErrorMessage).toHaveText('Please enter Password.');
    });

    await test.step('Search field with special characters', async({page})=>{
        await login.navigateToWheeboxLoginPage();
        await login.loginWithCredentials("demosales1@gmail.com", "demoSales1");
        await expect(page).toHaveURL('https://uat1.wheebox.com/WET-2/homeV2.obj');
        await home.searchTest("@@!##");
        await expect(home.testCards).not.toBeVisible();
    });

    await test.step('Internet connection lost during the login', async () => {
        const browser = await chromium.launch();
        const context = await browser.newContext();
        await context.setOffline(true);
        const page = await context.newPage();
        const error = await page.goto("https://uat1.wheebox.com/WET-2/homeV2.obj").catch(e => e);
        await expect(error.message).toContain("net::ERR_INTERNET_DISCONNECTED");
    });
});