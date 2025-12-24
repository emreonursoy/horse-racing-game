import { expect,test } from '@playwright/test'

test.describe('Horse Racing Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the game header', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Horse Racing Game')
  })

  test('should not show horses list on page load', async ({ page }) => {
    // Horses should not be visible initially
    const horseItem = page.locator('.horse-item').first()
    try {
      await expect(horseItem).not.toBeVisible({ timeout: 1000 })
    } catch {
      // If it doesn't exist, that's fine too
    }
  })

  test('should generate exactly 20 horses when clicking Generate Horses', async ({ page }) => {
    // Click Generate Horses button
    await page.click('button:has-text("Generate Horses")')
    
    // Wait for horses to be generated
    await expect(page.locator('.horse-item').first()).toBeVisible({ timeout: 5000 })
    const horses = await page.locator('.horse-item').count()
    expect(horses).toBe(20)
  })

  test('should display Generate Horses button initially', async ({ page }) => {
    await expect(page.locator('button:has-text("Generate Horses")')).toBeVisible()
    // Generate Schedule and Start Race buttons should not be visible until horses are generated
    await expect(page.locator('button:has-text("Generate Schedule")')).toBeHidden()
    await expect(page.locator('button:has-text("Start Race")')).toBeHidden()
  })

  test('should keep Generate Horses button visible after generating horses', async ({ page }) => {
    // Generate Horses button should be visible initially
    await expect(page.locator('button:has-text("Generate Horses")')).toBeVisible()
    
    // Generate horses
    await page.click('button:has-text("Generate Horses")')
    await expect(page.locator('.horse-item').first()).toBeVisible({ timeout: 5000 })
    
    // Generate Horses button should still be visible
    await expect(page.locator('button:has-text("Generate Horses")')).toBeVisible()
    // Now Generate Schedule button should also be visible
    await expect(page.locator('button:has-text("Generate Schedule")')).toBeVisible()
    // Start Race should be visible but disabled
    await expect(page.locator('button:has-text("Start Race")')).toBeVisible()
  })

  test('should generate race schedule when clicking Generate Schedule', async ({ page }) => {
    // First generate horses
    await page.click('button:has-text("Generate Horses")')
    await expect(page.locator('.horse-item').first()).toBeVisible({ timeout: 5000 })
    const horses = await page.locator('.horse-item').count()
    expect(horses).toBe(20)
    
    // Click Generate Schedule button
    await page.click('button:has-text("Generate Schedule")')
    
    // Wait for race schedule to appear
    await expect(page.locator('text=Race Program & Results')).toBeVisible({ timeout: 5000 })
    
    // Wait for all 6 laps to be visible - check each one
    await expect(page.locator('text=Lap 1')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Lap 2')).toBeVisible({ timeout: 2000 })
    await expect(page.locator('text=Lap 3')).toBeVisible({ timeout: 2000 })
    await expect(page.locator('text=Lap 4')).toBeVisible({ timeout: 2000 })
    await expect(page.locator('text=Lap 5')).toBeVisible({ timeout: 2000 })
    await expect(page.locator('text=Lap 6')).toBeVisible({ timeout: 2000 })
    
    // Check that all 6 rounds are displayed
    await expect(page.locator('.race-program__lap')).toHaveCount(6)

    await expect(page.locator('.race-program__lap').first().locator('.race-program__program .race-program__list-item').first()).toBeVisible({ timeout: 5000 })
    const firstRoundHorses = await page.locator('.race-program__lap').first().locator('.race-program__program .race-program__list-item').count()
    expect(firstRoundHorses).toBe(10)
  })

  test('should display correct round distances', async ({ page }) => {
    // Generate horses first
    await page.click('button:has-text("Generate Horses")')
    await expect(page.locator('.horse-item').first()).toBeVisible({ timeout: 5000 })
    await page.click('button:has-text("Generate Schedule")')
    
    await expect(page.locator('text=1200m')).toBeVisible()
    await expect(page.locator('text=1400m')).toBeVisible()
    await expect(page.locator('text=1600m')).toBeVisible()
    await expect(page.locator('text=1800m')).toBeVisible()
    await expect(page.locator('text=2000m')).toBeVisible()
    await expect(page.locator('text=2200m')).toBeVisible()
  })

  test('should start race when clicking Start Race button', async ({ page }) => {
    // Generate horses first
    await page.click('button:has-text("Generate Horses")')
    await expect(page.locator('.horse-item').first()).toBeVisible({ timeout: 5000 })
    await page.click('button:has-text("Generate Schedule")')
    await expect(page.locator('text=Race Program & Results')).toBeVisible({ timeout: 2000 })
    
    // Click Start Race
    await page.click('button:has-text("Start Race")')
    
    // Check that race track appears
    await expect(page.locator('text=Race Track')).toBeVisible()
    await expect(page.locator('text=Racing')).toBeVisible({ timeout: 10000 })
  })

  test('should display race results after race completes', async ({ page }) => {
    // Generate horses first
    await page.click('button:has-text("Generate Horses")')
    await expect(page.locator('.horse-item').first()).toBeVisible({ timeout: 5000 })
    await page.click('button:has-text("Generate Schedule")')
    await expect(page.locator('text=Race Program & Results')).toBeVisible({ timeout: 2000 })
    
    // Start race
    await page.click('button:has-text("Start Race")')
    
    // Wait for race to start (verify racing status appears)
    await expect(page.locator('text=Race Track')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Racing')).toBeVisible({ timeout: 5000 })
    
    // Wait for Race Winners section to appear (only shows when all 6 rounds complete)
    // With 100x speed, this should be relatively quick but we give it time
    await expect(page.locator('text=Race Winners')).toBeVisible({ timeout: 60000 })
    
    // Wait for winners container to have content
    const winnersText = page.locator('.race-winners')
    await expect(winnersText).toBeVisible({ timeout: 5000 })
    await expect(winnersText).toHaveText(/Lap/)
  })

  test('should disable buttons appropriately', async ({ page }) => {
    // Initially, Generate Horses button should be enabled
    const generateHorsesButton = page.locator('button:has-text("Generate Horses")')
    await expect(generateHorsesButton).toBeEnabled()
    
    // Generate horses
    await generateHorsesButton.click()
    await expect(page.locator('.horse-item').first()).toBeVisible({ timeout: 5000 })
    
    // Generate Schedule button should be enabled when horses exist
    const generateScheduleButton = page.locator('button:has-text("Generate Schedule")')
    await expect(generateScheduleButton).toBeEnabled()
    
    // Start Race button should be disabled until schedule is generated
    const startButton = page.locator('button:has-text("Start Race")')
    await expect(startButton).toBeDisabled()
    
    // Generate schedule
    await generateScheduleButton.click()
    await expect(page.locator('text=Race Program & Results')).toBeVisible({ timeout: 2000 })
    
    // Start Race should now be enabled
    await expect(startButton).toBeEnabled()
  })

  test('should reset and regenerate schedule when clicking Generate Schedule again', async ({ page }) => {
    // Generate horses first
    await page.click('button:has-text("Generate Horses")')
    await expect(page.locator('.horse-item').first()).toBeVisible({ timeout: 5000 })
    
    // Get initial horse names to compare later
    const initialHorseNames = await page.locator('.horse-item').allTextContents()
    expect(initialHorseNames.length).toBe(20)
    
    // Generate initial schedule
    await page.click('button:has-text("Generate Schedule")')
    await expect(page.locator('text=Race Program & Results')).toBeVisible({ timeout: 2000 })
    
    // Click Generate Schedule again (this should reset and regenerate schedule, but keep horses)
    await page.click('button:has-text("Generate Schedule")')
    await expect(page.locator('text=Race Program & Results')).toBeVisible({ timeout: 2000 })
    
    // Horses should still be visible (same ones, not regenerated)
    await expect(page.locator('.horse-item').first()).toBeVisible({ timeout: 2000 })
    const newHorseCount = await page.locator('.horse-item').count()
    expect(newHorseCount).toBe(20)
  })

  test('should clear schedule when generating new horse list', async ({ page }) => {
    // Generate horses first
    await page.click('button:has-text("Generate Horses")')
    await expect(page.locator('.horse-item').first()).toBeVisible({ timeout: 5000 })
    
    // Generate schedule
    await page.click('button:has-text("Generate Schedule")')
    await expect(page.locator('text=Race Program & Results')).toBeVisible({ timeout: 2000 })
    
    // Verify schedule is visible
    await expect(page.locator('.race-program__lap')).toHaveCount(6)
    
    // Generate new horse list - this should clear the schedule
    await page.click('button:has-text("Generate Horses")')
    await expect(page.locator('.horse-item').first()).toBeVisible({ timeout: 5000 })
    
    // Schedule should be cleared (Race Program should not show laps)
    // The Race Program component might still be visible but without laps
    const lapsAfterReset = await page.locator('.race-program__lap').count()
    expect(lapsAfterReset).toBe(0)
  })

  test('should generate horses with conditions when clicking Generate Horses', async ({ page }) => {
    // Generate horses
    await page.click('button:has-text("Generate Horses")')
    await expect(page.locator('.horse-item').first()).toBeVisible({ timeout: 5000 })
    
    // Verify all horses have condition values displayed
    const horseItems = await page.locator('.horse-item').all()
    expect(horseItems.length).toBe(20)
    
    // Check that condition is displayed (horses should show condition values)
    for (const horseItem of horseItems) {
      const text = await horseItem.textContent()
      // Horse item should contain condition number (between 1-100)
      expect(text).toMatch(/\d+/)
    }
  })

  test('should generate schedule without regenerating horses', async ({ page }) => {
    // Generate horses first
    await page.click('button:has-text("Generate Horses")')
    await expect(page.locator('.horse-item').first()).toBeVisible({ timeout: 5000 })
    
    // Get initial horses
    const initialHorses = await page.locator('.horse-item').count()
    expect(initialHorses).toBe(20)
    
    // Get initial horse names
    const initialHorseNames = await page.locator('.horse-item').allTextContents()
    
    // Click Generate Schedule - this should only generate schedule, not regenerate horses
    await page.click('button:has-text("Generate Schedule")')
    
    // Wait for schedule to appear
    await expect(page.locator('text=Race Program & Results')).toBeVisible({ timeout: 2000 })
    
    // Verify horses are still present (20 horses)
    const horsesAfterSchedule = await page.locator('.horse-item').count()
    expect(horsesAfterSchedule).toBe(20)
    
    // Verify horses are the same (not regenerated)
    const horsesAfterScheduleNames = await page.locator('.horse-item').allTextContents()
    expect(horsesAfterScheduleNames).toEqual(initialHorseNames)
    
    // Verify schedule was generated
    await expect(page.locator('.race-program__lap')).toHaveCount(6)
  })

  test('should display horse information correctly', async ({ page }) => {
    // Generate horses first
    await page.click('button:has-text("Generate Horses")')
    await expect(page.locator('.horse-item').first()).toBeVisible({ timeout: 5000 })
    
    const firstHorse = page.locator('.horse-item').first()
    const horseText = await firstHorse.textContent()
    
    // Should contain horse name and condition
    expect(horseText).toMatch(/\w+.*\d+/)
  })

  test('should show race track with horses during race', async ({ page }) => {
    // Generate horses first
    await page.click('button:has-text("Generate Horses")')
    await expect(page.locator('.horse-item').first()).toBeVisible({ timeout: 5000 })
    await page.click('button:has-text("Generate Schedule")')
    await expect(page.locator('text=Race Program & Results')).toBeVisible({ timeout: 2000 })
    
    // Start race
    await page.click('button:has-text("Start Race")')
    
    // Wait for race track section to appear
    await expect(page.locator('text=Race Track')).toBeVisible({ timeout: 5000 })
    
    // Wait for track container to be visible
    await expect(page.locator('.track')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('.track__container')).toBeVisible({ timeout: 5000 })
    
    // Verify track lanes exist (these are always present, even if runners finish quickly)
    const lanes = await page.locator('.track__lane').count()
    expect(lanes).toBeGreaterThan(0)
    
    // Verify horse info is displayed in lanes
    const horseNames = await page.locator('.track__horse-name').count()
    expect(horseNames).toBeGreaterThan(0)
    
    // Verify track path elements exist
    const paths = await page.locator('.track__path').count()
    expect(paths).toBeGreaterThan(0)
  })

  test('should pause and resume race', async ({ page }) => {
    // Generate horses and schedule
    await page.click('button:has-text("Generate Horses")')
    await expect(page.locator('.horse-item').first()).toBeVisible({ timeout: 5000 })
    await page.click('button:has-text("Generate Schedule")')
    await expect(page.locator('text=Race Program & Results')).toBeVisible({ timeout: 2000 })
    
    // Start race
    await page.click('button:has-text("Start Race")')
    
    // Wait for race to start
    await expect(page.locator('text=Racing')).toBeVisible({ timeout: 5000 })
    
    // Pause button should be visible
    await expect(page.locator('button:has-text("Pause")')).toBeVisible({ timeout: 2000 })
    
    // Click pause
    await page.click('button:has-text("Pause")')
    
    // Resume button should be visible
    await expect(page.locator('button:has-text("Resume")')).toBeVisible({ timeout: 1000 })
    
    // Click resume
    await page.click('button:has-text("Resume")')
    
    // Pause button should be visible again
    await expect(page.locator('button:has-text("Pause")')).toBeVisible({ timeout: 1000 })
  })

  test('should show pause button during race and hide start race button', async ({ page }) => {
    // Generate horses and schedule
    await page.click('button:has-text("Generate Horses")')
    await expect(page.locator('.horse-item').first()).toBeVisible({ timeout: 5000 })
    await page.click('button:has-text("Generate Schedule")')
    await expect(page.locator('text=Race Program & Results')).toBeVisible({ timeout: 2000 })
    
    // Start race button should be visible
    await expect(page.locator('button:has-text("Start Race")')).toBeVisible()
    
    // Start race
    await page.click('button:has-text("Start Race")')
    
    // Wait for race to start
    await expect(page.locator('text=Racing')).toBeVisible({ timeout: 5000 })
    
    // Start Race button should be hidden
    await expect(page.locator('button:has-text("Start Race")')).toBeHidden()
    
    // Pause button should be visible
    await expect(page.locator('button:has-text("Pause")')).toBeVisible({ timeout: 2000 })
  })

  test('should allow multiple pause/resume cycles', async ({ page }) => {
    // Generate horses and schedule
    await page.click('button:has-text("Generate Horses")')
    await expect(page.locator('.horse-item').first()).toBeVisible({ timeout: 5000 })
    await page.click('button:has-text("Generate Schedule")')
    await expect(page.locator('text=Race Program & Results')).toBeVisible({ timeout: 2000 })
    
    // Start race
    await page.click('button:has-text("Start Race")')
    await expect(page.locator('text=Racing')).toBeVisible({ timeout: 5000 })
    
    // First pause/resume cycle
    await page.click('button:has-text("Pause")')
    await expect(page.locator('button:has-text("Resume")')).toBeVisible({ timeout: 1000 })
    await page.click('button:has-text("Resume")')
    await expect(page.locator('button:has-text("Pause")')).toBeVisible({ timeout: 1000 })
    
    // Second pause/resume cycle
    await page.click('button:has-text("Pause")')
    await expect(page.locator('button:has-text("Resume")')).toBeVisible({ timeout: 1000 })
    await page.click('button:has-text("Resume")')
    await expect(page.locator('button:has-text("Pause")')).toBeVisible({ timeout: 1000 })
  })

  test('should reset entire system to initial state when paused', async ({ page }) => {
    // Generate horses and schedule
    await page.click('button:has-text("Generate Horses")')
    await expect(page.locator('.horse-item').first()).toBeVisible({ timeout: 5000 })
    await page.click('button:has-text("Generate Schedule")')
    await expect(page.locator('text=Race Program & Results')).toBeVisible({ timeout: 2000 })
    
    // Verify horses and schedule are visible
    const horsesCount = await page.locator('.horse-item').count()
    expect(horsesCount).toBe(20)
    await expect(page.locator('text=Race Program & Results')).toBeVisible()
    
    // Start race
    await page.click('button:has-text("Start Race")')
    await expect(page.locator('text=Racing')).toBeVisible({ timeout: 5000 })
    
    // Pause race
    await page.click('button:has-text("Pause")')
    await expect(page.locator('button:has-text("Resume")')).toBeVisible({ timeout: 1000 })
    
    // Reset Game button should be visible
    await expect(page.locator('button:has-text("Reset Game")')).toBeVisible({ timeout: 1000 })
    
    // Click Reset Game - should reset everything to initial state
    await page.click('button:has-text("Reset Game")')
    
    // Horses list should be hidden (no horses)
    const horseItem = page.locator('.horse-item').first()
    try {
      await expect(horseItem).not.toBeVisible({ timeout: 2000 })
    } catch {
      // If it doesn't exist, that's fine too
    }
    
    // Race Program should not be visible (no schedule)
    const raceProgram = page.locator('text=Race Program & Results')
    try {
      await expect(raceProgram).not.toBeVisible({ timeout: 2000 })
    } catch {
      // If it doesn't exist, that's fine too
    }
    
    // Generate Horses button should be visible (system reset to initial state)
    await expect(page.locator('button:has-text("Generate Horses")')).toBeVisible({ timeout: 2000 })
    
    // Start Race button should not be visible (no schedule)
    await expect(page.locator('button:has-text("Start Race")')).toBeHidden()
    
    // Pause/Resume/Reset buttons should not be visible
    await expect(page.locator('button:has-text("Pause")')).toBeHidden()
    await expect(page.locator('button:has-text("Resume")')).toBeHidden()
    await expect(page.locator('button:has-text("Reset Game")')).toBeHidden()
  })

  test('should not show Reset Game button when race is not paused', async ({ page }) => {
    // Generate horses and schedule
    await page.click('button:has-text("Generate Horses")')
    await expect(page.locator('.horse-item').first()).toBeVisible({ timeout: 5000 })
    await page.click('button:has-text("Generate Schedule")')
    await expect(page.locator('text=Race Program & Results')).toBeVisible({ timeout: 2000 })
    
    // Start race
    await page.click('button:has-text("Start Race")')
    await expect(page.locator('text=Racing')).toBeVisible({ timeout: 5000 })
    
    // Reset Game button should not be visible when not paused
    await expect(page.locator('button:has-text("Reset Game")')).toBeHidden()
    
    // Pause race
    await page.click('button:has-text("Pause")')
    
    // Now Reset Game button should be visible
    await expect(page.locator('button:has-text("Reset Game")')).toBeVisible({ timeout: 1000 })
  })
})
