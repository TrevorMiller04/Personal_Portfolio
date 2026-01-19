import { test, expect } from '@playwright/test';

test.describe('Portfolio UI Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Projects section should have correct heading (not "Featured Projects")', async ({ page }) => {
    // Navigate to projects section
    await page.click('a[href="#projects"]');

    // Check heading - should be "Projects" not "Featured Projects"
    const heading = page.locator('#projects h3, #projects h2').first();
    const headingText = await heading.textContent();

    console.log(`Projects heading text: "${headingText}"`);

    // This test documents the current (incorrect) state
    if (headingText?.includes('Featured')) {
      console.log('ISSUE: Heading still contains "Featured"');
    }
  });

  test('Project cards should not have "Featured" badges', async ({ page }) => {
    await page.click('a[href="#projects"]');

    // Check for Featured badges
    const featuredBadges = page.locator('text=Featured').filter({ hasText: 'Featured' });
    const badgeCount = await featuredBadges.count();

    console.log(`Number of "Featured" badges found: ${badgeCount}`);

    if (badgeCount > 0) {
      console.log('ISSUE: Featured badges still present on project cards');
    }
  });

  test('Project buttons should be "Visit Repo" and "View Project" (not "View Code")', async ({ page }) => {
    await page.click('a[href="#projects"]');

    // Check for "View Code" buttons (should not exist)
    const viewCodeButtons = page.locator('text=View Code');
    const viewCodeCount = await viewCodeButtons.count();

    // Check for "Visit Repo" buttons (should exist)
    const visitRepoButtons = page.locator('text=Visit Repo');
    const visitRepoCount = await visitRepoButtons.count();

    // Check for "View Project" buttons (should exist for projects with images)
    const viewProjectButtons = page.locator('text=View Project');
    const viewProjectCount = await viewProjectButtons.count();

    console.log(`"View Code" buttons: ${viewCodeCount} (should be 0)`);
    console.log(`"Visit Repo" buttons: ${visitRepoCount} (should be 1 - Portfolio Website)`);
    console.log(`"View Project" buttons: ${viewProjectCount} (should be 3 - Portfolio, Multitext, Spotify)`);

    if (viewCodeCount > 0) {
      console.log('ISSUE: "View Code" buttons still present');
    }
  });

  test('Contact section should have correct "Currently seeking" text', async ({ page }) => {
    await page.click('a[href="#contact"]');

    // Check for the seeking text
    const seekingText = page.locator('text=Currently seeking').first();
    const parentText = await seekingText.locator('..').textContent();

    console.log(`Currently seeking text: "${parentText}"`);

    if (parentText?.includes('Summer 2025')) {
      console.log('ISSUE: Text says "Summer 2025" instead of "Summer and Fall 2026"');
    }
  });

  test('Location text should include Boston and Syracuse', async ({ page }) => {
    await page.click('a[href="#contact"]');

    // Check for location text
    const locationText = page.locator('text=Location:').first();
    const parentText = await locationText.locator('..').textContent();

    console.log(`Location text: "${parentText}"`);

    if (parentText?.includes('Boston') && parentText?.includes('Syracuse')) {
      console.log('SUCCESS: Location text includes both Boston and Syracuse');
    } else {
      console.log('ISSUE: Location text missing Boston or Syracuse');
    }
  });

  test('Project cards should not display role field', async ({ page }) => {
    await page.click('a[href="#projects"]');

    // Check for role text patterns like "Full-Stack Developer", "AI/ML Engineer", etc.
    const roles = ['Full-Stack Developer', 'AI/ML Engineer', 'Data Engineer', 'Frontend Developer'];

    for (const role of roles) {
      const roleElements = page.locator(`text=${role}`);
      const count = await roleElements.count();
      if (count > 0) {
        console.log(`ISSUE: Role "${role}" still displayed on project cards`);
      }
    }
  });
