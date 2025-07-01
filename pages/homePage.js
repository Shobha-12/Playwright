import{page} from '@playwright/test';

export class HomePage{
    constructor(page){
        this.page=page;
        this.allTab = page.locator("#tab-all");
        this.activeTab = page.locator("#tab-active");
        this.completedTab = page.locator("tab-completed");
        this.expiredTab = page.locator("#tab-expired");
        this.searchInput = page.locator("#search");
        this.testCards = page.locator("div[class='test-card']");
        this.continueButton = page.locator("div[class='btn-test ']");
        this.expiredLabel = page.locator("span[class='state expired']");
        this.testName = page.locator("//div[@class='d-flex justify-content-between bordr']//h4");
        this.testProgress = page.locator("//div[contains(@class,'circular-progress')]");
        this.testDurationText = page.locator("#durationText");
        this.testAssignedText = page.locator("#assignText");
        this.homePageTitle = page.locator("div[class='main_header'] h2");
    }

    async openActiveTab(){
        await this.activeTab.click();
    }

    async openExpiredTab(){
        await this.activeTab.click();
    }

    async searchTest(testName) {
        this.searchInput.click();
        this.searchInput.fill(testName);
    }

    async goToTheActiveTest(){
        this.continueButton.click();
    }
}