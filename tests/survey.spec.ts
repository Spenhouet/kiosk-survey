import { test, expect } from '@playwright/test';
import * as m_en from '../messages/en.json'; // For checking English text
// import * as m_de from '../messages/de.json'; // For German if testing lang switching

test.beforeEach(async ({ page }) => {
  // Clear localStorage before each test to ensure a clean state
  await page.evaluate(() => localStorage.clear());
  // Always navigate to the English version for base tests, or parameterize language
  await page.goto('/en/');
});

test('should display survey question and allow answering (EN)', async ({ page }) => {
  await expect(page.locator('h1')).toContainText(m_en.default_survey_question.substring(0,30)); // Partial match for default q
  const answerButtons = page.locator('div.flex.flex-col.gap-4 button'); // More specific selector
  await expect(answerButtons).toHaveCount(4);

  await answerButtons.first().click();
  await expect(page).toHaveURL(/.*\/en\/results/);
  await expect(page.locator('h2')).toContainText(m_en.results_page_title);
  await expect(page.locator('div.text-left span').first()).toContainText(m_en.answer_reactivity); // Check first answer result
  await expect(page.locator('div.text-left span').first()).toContainText(`1 ${m_en.votes_suffix_singular}`);
});

test('should navigate to settings, change question, and see it on survey page (EN)', async ({ page }) => {
    await page.locator('a[aria-label="Settings"]').click(); // Default label is "Settings"
    await expect(page).toHaveURL(/.*\/en\/settings/);
    await expect(page.locator('h2')).toContainText(m_en.settings_page_title);

    const newQuestion = "What's your favorite color?";
    await page.locator('textarea#surveyQuestion').fill(newQuestion);

    // Click "Back to Survey"
    await page.locator(`a:has-text("${m_en.back_to_survey_button}")`).click();
    await expect(page).toHaveURL(/.*\/en\/?$/); // Ensure it goes to the root of /en/
    await expect(page.locator('h1')).toContainText(newQuestion);
});

test('should change background color from settings (EN)', async ({ page }) => {
    await page.locator('a[aria-label="Settings"]').click();
    await expect(page).toHaveURL(/.*\/en\/settings/);

    const newBgColor = '#ff0000'; // Red
    await page.locator('input#bgColor').fill(newBgColor); // Using fill for color input might need DOM property set

    // Svelte might take a moment to update body style via $effect
    // Playwright's auto-wait might cover this, or explicit wait needed
    await page.waitForFunction((color) => document.body.style.backgroundColor === color.replace("#","rgb(").replace("0000","0, 0)"), "rgb(255, 0, 0)");


    // Check if the body background color changed
    const bodyBg = await page.locator('body').evaluate(body => getComputedStyle(body).backgroundColor);
    expect(bodyBg).toBe('rgb(255, 0, 0)'); // Browsers often return rgb

    // Navigate back and check again
    await page.locator(`a:has-text("${m_en.back_to_survey_button}")`).click();
    await page.waitForURL(/.*\/en\/?$/);
    const bodyBgOnSurveyPage = await page.locator('body').evaluate(body => getComputedStyle(body).backgroundColor);
    expect(bodyBgOnSurveyPage).toBe('rgb(255, 0, 0)');
});

// Add more tests: clearing results, resetting survey, language switching effect on UI text