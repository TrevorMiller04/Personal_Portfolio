import { test, expect } from '@playwright/test'

test.describe('Projects Page', () => {
  test('should load and display projects page', async ({ page }) => {
    await page.goto('/projects')

    // Check page title and description
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible()
    await expect(page.getByText('Showcasing modern web applications')).toBeVisible()

    // Should show either loading state, projects, or no projects message
    const loadingIndicator = page.getByText('Loading projects...')
    const projectCards = page.locator('[data-testid="project-card"]')
    const noProjectsMessage = page.getByText('No projects found')

    // Wait for one of these states
    await expect(async () => {
      const isLoading = await loadingIndicator.isVisible()
      const hasProjects = await projectCards.count() > 0
      const hasNoProjectsMessage = await noProjectsMessage.isVisible()
      
      expect(isLoading || hasProjects || hasNoProjectsMessage).toBeTruthy()
    }).toPass({ timeout: 10000 })
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/')
    
    // Click on Projects in navigation
    await page.getByRole('link', { name: 'Projects' }).click()
    
    // Should navigate to projects page
    await expect(page).toHaveURL('/projects')
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible()
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('**/api/projects*', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      })
    })

    await page.goto('/projects')

    // Should show error message
    await expect(page.getByText('Failed to load projects')).toBeVisible()
  })

  test('should be responsive', async ({ page }) => {
    await page.goto('/projects')
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible()
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 })
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible()
  })
})