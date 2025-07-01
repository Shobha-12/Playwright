import{test, expect, chromium} from '@playwright/test';
import{LoginPage} from '../pages/loginPage';
import { HomePage } from '../pages/homePage';

test('Positive scenarios', async({page})=>{
    const login= new LoginPage(page);
    const home = new HomePage(page)
    await test.step('Verify successful login and home page is displayed', async({page})=>{
        await login.navigateToWheeboxLoginPage();
        await login.loginWithCredentials("demosales1@gmail.com", "demoSales1");
        await expect(page).toContainURL('https://uat1.wheebox.com/WET-2/homeV2.obj');
        await expect(home.homePageTitle).toHaveText('Test Selection');
    });

    await test.step('Search for test Asales2', async({page})=>{
        await home.searchTest("Asales2");
        await expect(home.testName).toHaveText('Asales2');
        await expect(home.testProgress).toBeVisible();
        await expect(home.testDurationText).toBeVisible();
        await expect(home.testAssignedText).toBeVisible();
    });

    await test.step('Verify Active tab', async({page})=>{
        await home.openActiveTab();
        await expect(home.testName).toHaveText('Asales1');
        await expect(home.testProgress).toBeVisible();
        await expect(home.testDurationText).toBeVisible();
        await expect(home.testAssignedText).toBeVisible();
        await expect(home.continueButton).toBeVisible();
    });

    await test.step('Verify Expired tab', async({page})=>{
        await home.openExpiredTab();
        await expect(home.testCards).toHaveCount(3);
        await expect(home.testProgress).toHaveCount(3);
        await expect(home.testDurationText).toHaveCount(3);
        await expect(home.testAssignedText).toHaveCount(3);
        await expect(home.expiredLabel).toHaveCount(3);
    });

    await test.step('Open test page for active test', async({page})=>{
        await home.openActiveTab();
        await expect(home.testName).toHaveText('Asales1');
        await expect(home.testProgress).toBeVisible();
        await expect(home.testDurationText).toBeVisible();
        await expect(home.testAssignedText).toBeVisible();
        await expect(home.continueButton).toBeVisible();
        await home.goToTheActiveTest();
    });
});

test('Login with invalid username', async({page})=>{
    const login= new LoginPage(page);
    const home = new HomePage(page)
    await test.step('Login with invalid username', async()=>{
        await login.navigateToWheeboxLoginPage();
        await login.loginWithCredentials("demosales1", "demoSales1");
        await expect(login.errorMessage).toHaveText('The login id or password is incorrect Four attempts left.');
    });

    await test.step('Login with invalid password', async()=>{
        await login.loginWithCredentials("demosales1@gmail.com", "demo");
        await expect(login.errorMessage).toHaveText('The login id or password is incorrect Three attempts left.');
    });

    await test.step('Login with blank credentials', async()=>{
        await login.loginWithCredentials("", "");
        await expect(login.userNameErrorMessage).toHaveText('Please enter Username.');
        await expect(login.passwordErrorMessage).toHaveText('Please enter Password.');
    });

    await test.step('Search field with special characters', async({page})=>{
        await home.searchTest("@@!##");
        await expect(home.testCards).not.toBeVisible();
    });

    await test.step('Internet connection lost during the login', async()=>{
        const browser = await chromium.launch();
        const context = await browser.newContext();
        await context.setOffline(true);
        const page = await context.newPage();
        const error = await page.goto("https://uat1.wheebox.com/WET-2/homeV2.obj").catch(e=>e);
        await expect(error.message).toContain("net::ERR_INTERNET_DISCONNECTED");
    });
});