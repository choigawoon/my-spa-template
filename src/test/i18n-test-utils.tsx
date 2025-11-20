/**
 * i18n Test Utilities
 *
 * Provides utilities for testing components with i18n support.
 */

import { ReactElement, ReactNode } from 'react'
import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n'
import { SupportedLanguage } from '@/lib/i18n'

// Import translation files for validation
import en from '@/locales/en.json'
import ko from '@/locales/ko.json'
import ja from '@/locales/ja.json'

/**
 * All translations by language
 */
export const translations = {
  en,
  ko,
  ja,
} as const

/**
 * Wrapper component that provides i18n context
 */
interface I18nWrapperProps {
  children: ReactNode
}

const I18nWrapper = ({ children }: I18nWrapperProps) => {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

/**
 * Custom render function that includes i18n provider
 */
export function renderWithI18n(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult {
  return render(ui, { wrapper: I18nWrapper, ...options })
}

/**
 * Change language for testing
 */
export async function changeTestLanguage(language: SupportedLanguage): Promise<void> {
  await i18n.changeLanguage(language)
}

/**
 * Get current test language
 */
export function getTestLanguage(): string {
  return i18n.language
}

/**
 * Get translation for a key in a specific language
 */
export function getTranslation(key: string, language: SupportedLanguage = 'en'): string {
  return i18n.getFixedT(language)(key)
}

/**
 * Check if a translation key exists in all languages
 */
export function translationKeyExists(key: string): boolean {
  const languages: SupportedLanguage[] = ['en', 'ko', 'ja']
  return languages.every(lang => {
    const t = i18n.getFixedT(lang)
    const value = t(key)
    // If key doesn't exist, i18next returns the key itself
    return value !== key
  })
}

/**
 * Get nested value from object by dot-notation key
 */
function getNestedValue(obj: Record<string, unknown>, key: string): unknown {
  const keys = key.split('.')
  let result: unknown = obj

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = (result as Record<string, unknown>)[k]
    } else {
      return undefined
    }
  }

  return result
}

/**
 * Get all translation keys from a nested object
 */
export function getAllTranslationKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = []

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const value = obj[key]

    if (typeof value === 'object' && value !== null) {
      keys.push(...getAllTranslationKeys(value as Record<string, unknown>, fullKey))
    } else {
      keys.push(fullKey)
    }
  }

  return keys
}

/**
 * Validate that all languages have the same keys
 */
export function validateTranslationKeys(): {
  valid: boolean
  missingKeys: Record<SupportedLanguage, string[]>
} {
  const enKeys = getAllTranslationKeys(en)
  const missingKeys: Record<SupportedLanguage, string[]> = {
    en: [],
    ko: [],
    ja: [],
  }

  // Check each language has all English keys
  for (const key of enKeys) {
    if (getNestedValue(ko, key) === undefined) {
      missingKeys.ko.push(key)
    }
    if (getNestedValue(ja, key) === undefined) {
      missingKeys.ja.push(key)
    }
  }

  // Check English has all keys from other languages
  const koKeys = getAllTranslationKeys(ko)
  const jaKeys = getAllTranslationKeys(ja)

  for (const key of koKeys) {
    if (getNestedValue(en, key) === undefined) {
      missingKeys.en.push(key)
    }
  }

  for (const key of jaKeys) {
    if (getNestedValue(en, key) === undefined) {
      missingKeys.en.push(key)
    }
  }

  const valid =
    missingKeys.en.length === 0 &&
    missingKeys.ko.length === 0 &&
    missingKeys.ja.length === 0

  return { valid, missingKeys }
}

/**
 * Reset i18n to default state (English)
 */
export async function resetI18n(): Promise<void> {
  await i18n.changeLanguage('en')
}

export { i18n }
