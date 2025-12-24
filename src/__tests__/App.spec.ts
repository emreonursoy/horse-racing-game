import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import App from '../App.vue'
import store from '../store'

describe('App', () => {
  it('renders properly', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [store],
      },
    })
    expect(wrapper.text()).toContain('Horse Racing Game')
    expect(wrapper.text()).toContain('Generate Horses')
    // Generate Schedule and Start Race buttons are not visible initially (no horses)
    // Note: "Generate Schedule" text appears in RaceProgram message, so we check for buttons specifically
    const buttons = wrapper.findAll('button')
    const buttonTexts = buttons.map((btn) => btn.text())
    expect(buttonTexts).not.toContain('Generate Schedule')
    expect(buttonTexts).not.toContain('Start Race')
  })

  it('displays horses section after generating horses', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [store],
      },
    })

    // Initially, horses section should not be visible (horses list is conditionally rendered)
    // Generate horses
    await store.dispatch('generateHorses')
    await wrapper.vm.$nextTick()

    // Now horses section should be visible
    expect(wrapper.text()).toContain('Horses')
    expect(wrapper.text()).toContain('Generate Schedule')
  })

  it('displays Start Race button after generating schedule', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [store],
      },
    })

    // Generate horses and schedule
    await store.dispatch('generateHorses')
    await store.dispatch('generateRaceSchedule')
    await wrapper.vm.$nextTick()

    // Now Start Race button should be visible
    expect(wrapper.text()).toContain('Start Race')
  })
})
