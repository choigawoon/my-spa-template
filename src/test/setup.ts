/**
 * Test Setup
 *
 * This file is executed before each test file.
 * It sets up the testing environment including i18n.
 */

import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll } from 'vitest'
import i18n from '@/lib/i18n'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Reset i18n to default language before all tests
beforeAll(() => {
  i18n.changeLanguage('en')
})
