/**
 * i18n Tests
 *
 * Tests for internationalization configuration and functionality.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import i18n, {
  supportedLanguages,
  changeLanguage,
  getCurrentLanguage,
} from '@/lib/i18n'
import {
  getTranslation,
  translationKeyExists,
  getAllTranslationKeys,
  validateTranslationKeys,
  translations,
  resetI18n,
} from '@/test/i18n-test-utils'

describe('i18n Configuration', () => {
  beforeEach(async () => {
    await resetI18n()
  })

  describe('Supported Languages', () => {
    it('should support English, Korean, and Japanese', () => {
      expect(supportedLanguages).toContain('en')
      expect(supportedLanguages).toContain('ko')
      expect(supportedLanguages).toContain('ja')
      expect(supportedLanguages).toHaveLength(3)
    })

    it('should have English as fallback language', () => {
      expect(i18n.options.fallbackLng).toContain('en')
    })
  })

  describe('Language Switching', () => {
    it('should switch to Korean', async () => {
      await changeLanguage('ko')
      expect(getCurrentLanguage()).toBe('ko')
    })

    it('should switch to Japanese', async () => {
      await changeLanguage('ja')
      expect(getCurrentLanguage()).toBe('ja')
    })

    it('should switch back to English', async () => {
      await changeLanguage('ko')
      await changeLanguage('en')
      expect(getCurrentLanguage()).toBe('en')
    })

    it('should update i18n.language when language changes', async () => {
      await changeLanguage('ja')
      expect(i18n.language).toBe('ja')
    })
  })

  describe('Translation Retrieval', () => {
    it('should get English translation', () => {
      const text = getTranslation('common.loading', 'en')
      expect(text).toBe('Loading...')
    })

    it('should get Korean translation', () => {
      const text = getTranslation('common.loading', 'ko')
      expect(text).toBe('로딩 중...')
    })

    it('should get Japanese translation', () => {
      const text = getTranslation('common.loading', 'ja')
      expect(text).not.toBe('common.loading')
    })

    it('should translate navigation items', () => {
      expect(getTranslation('nav.home', 'en')).toBe('Home')
      expect(getTranslation('nav.home', 'ko')).toBe('홈')
    })

    it('should translate page titles', () => {
      expect(getTranslation('pages.home.title', 'en')).toBe('Welcome')
      expect(getTranslation('pages.home.title', 'ko')).toBe('환영합니다')
    })
  })
})

describe('Translation Key Validation', () => {
  describe('Key Existence', () => {
    it('should have common.loading in all languages', () => {
      expect(translationKeyExists('common.loading')).toBe(true)
    })

    it('should have nav.home in all languages', () => {
      expect(translationKeyExists('nav.home')).toBe(true)
    })

    it('should have pages.home.title in all languages', () => {
      expect(translationKeyExists('pages.home.title')).toBe(true)
    })

    it('should return false for non-existent key', () => {
      expect(translationKeyExists('non.existent.key')).toBe(false)
    })
  })

  describe('Translation Structure', () => {
    it('should have same keys in all languages', () => {
      const result = validateTranslationKeys()

      if (!result.valid) {
        console.log('Missing keys:', result.missingKeys)
      }

      expect(result.valid).toBe(true)
    })

    it('should have common section in all languages', () => {
      expect(translations.en.common).toBeDefined()
      expect(translations.ko.common).toBeDefined()
      expect(translations.ja.common).toBeDefined()
    })

    it('should have nav section in all languages', () => {
      expect(translations.en.nav).toBeDefined()
      expect(translations.ko.nav).toBeDefined()
      expect(translations.ja.nav).toBeDefined()
    })

    it('should have pages section in all languages', () => {
      expect(translations.en.pages).toBeDefined()
      expect(translations.ko.pages).toBeDefined()
      expect(translations.ja.pages).toBeDefined()
    })

    it('should have messages section in all languages', () => {
      expect(translations.en.messages).toBeDefined()
      expect(translations.ko.messages).toBeDefined()
      expect(translations.ja.messages).toBeDefined()
    })

    it('should have form section in all languages', () => {
      expect(translations.en.form).toBeDefined()
      expect(translations.ko.form).toBeDefined()
      expect(translations.ja.form).toBeDefined()
    })

    it('should have theme section in all languages', () => {
      expect(translations.en.theme).toBeDefined()
      expect(translations.ko.theme).toBeDefined()
      expect(translations.ja.theme).toBeDefined()
    })

    it('should have language section in all languages', () => {
      expect(translations.en.language).toBeDefined()
      expect(translations.ko.language).toBeDefined()
      expect(translations.ja.language).toBeDefined()
    })
  })

  describe('Common Translations Completeness', () => {
    const commonKeys = [
      'loading',
      'error',
      'success',
      'cancel',
      'save',
      'delete',
      'edit',
      'create',
      'search',
      'submit',
      'refresh',
      'close',
      'confirm',
      'back',
      'next',
      'previous',
      'yes',
      'no',
    ]

    commonKeys.forEach(key => {
      it(`should have common.${key} in all languages`, () => {
        expect(translationKeyExists(`common.${key}`)).toBe(true)
      })
    })
  })

  describe('Navigation Translations Completeness', () => {
    const navKeys = [
      'home',
      'dashboard',
      'settings',
      'profile',
      'logout',
      'login',
      'mswTest',
      'zustandTest',
    ]

    navKeys.forEach(key => {
      it(`should have nav.${key} in all languages`, () => {
        expect(translationKeyExists(`nav.${key}`)).toBe(true)
      })
    })
  })

  describe('Form Translations Completeness', () => {
    const formKeys = [
      'name',
      'email',
      'password',
      'description',
      'price',
      'category',
      'required',
      'invalidEmail',
      'minLength',
      'maxLength',
    ]

    formKeys.forEach(key => {
      it(`should have form.${key} in all languages`, () => {
        expect(translationKeyExists(`form.${key}`)).toBe(true)
      })
    })
  })
})

describe('Translation Key Extraction', () => {
  it('should extract all keys from English translations', () => {
    const keys = getAllTranslationKeys(translations.en)
    expect(keys.length).toBeGreaterThan(0)
    expect(keys).toContain('common.loading')
    expect(keys).toContain('nav.home')
    expect(keys).toContain('pages.home.title')
  })

  it('should have same number of keys in Korean and English', () => {
    const enKeys = getAllTranslationKeys(translations.en)
    const koKeys = getAllTranslationKeys(translations.ko)
    expect(koKeys.length).toBe(enKeys.length)
  })

  it('should have same number of keys in Japanese and English', () => {
    const enKeys = getAllTranslationKeys(translations.en)
    const jaKeys = getAllTranslationKeys(translations.ja)
    expect(jaKeys.length).toBe(enKeys.length)
  })
})

describe('Interpolation', () => {
  beforeEach(async () => {
    await resetI18n()
  })

  it('should interpolate minLength with min value', () => {
    const t = i18n.getFixedT('en')
    const result = t('form.minLength', { min: 8 })
    expect(result).toBe('Must be at least 8 characters')
  })

  it('should interpolate maxLength with max value', () => {
    const t = i18n.getFixedT('en')
    const result = t('form.maxLength', { max: 100 })
    expect(result).toBe('Must be at most 100 characters')
  })

  it('should interpolate Korean translations', () => {
    const t = i18n.getFixedT('ko')
    const result = t('form.minLength', { min: 8 })
    expect(result).toBe('최소 8자 이상이어야 합니다')
  })
})

describe('useTranslation Hook Simulation', () => {
  beforeEach(async () => {
    await resetI18n()
  })

  it('should translate with current language', async () => {
    await changeLanguage('en')
    expect(i18n.t('common.save')).toBe('Save')

    await changeLanguage('ko')
    expect(i18n.t('common.save')).toBe('저장')

    await changeLanguage('ja')
    expect(i18n.t('common.save')).not.toBe('common.save')
  })

  it('should maintain language state across translations', async () => {
    await changeLanguage('ko')

    expect(i18n.t('common.loading')).toBe('로딩 중...')
    expect(i18n.t('common.error')).toBe('오류')
    expect(i18n.t('nav.home')).toBe('홈')
  })
})
