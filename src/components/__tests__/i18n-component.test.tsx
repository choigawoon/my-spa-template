/**
 * i18n Component Tests
 *
 * Tests for React components with i18n support.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useTranslation } from 'react-i18next'
import {
  renderWithI18n,
  changeTestLanguage,
  resetI18n,
} from '@/test/i18n-test-utils'

// Test component that uses translations
function TestComponent() {
  const { t } = useTranslation()

  return (
    <div>
      <h1 data-testid="title">{t('pages.home.title')}</h1>
      <p data-testid="loading">{t('common.loading')}</p>
      <button data-testid="save-btn">{t('common.save')}</button>
      <span data-testid="nav-home">{t('nav.home')}</span>
    </div>
  )
}

// Language selector component for testing
function LanguageSelector() {
  const { t, i18n } = useTranslation()

  return (
    <div>
      <span data-testid="current-lang">{i18n.language}</span>
      <button
        data-testid="switch-en"
        onClick={() => i18n.changeLanguage('en')}
      >
        {t('language.en')}
      </button>
      <button
        data-testid="switch-ko"
        onClick={() => i18n.changeLanguage('ko')}
      >
        {t('language.ko')}
      </button>
      <button
        data-testid="switch-ja"
        onClick={() => i18n.changeLanguage('ja')}
      >
        {t('language.ja')}
      </button>
    </div>
  )
}

// Form component with validation messages
function FormComponent() {
  const { t } = useTranslation()

  return (
    <form>
      <label>
        {t('form.name')}
        <input type="text" name="name" />
      </label>
      <label>
        {t('form.email')}
        <input type="email" name="email" />
      </label>
      <p data-testid="required-msg">{t('form.required')}</p>
      <p data-testid="min-length-msg">{t('form.minLength', { min: 8 })}</p>
      <button type="submit">{t('common.submit')}</button>
    </form>
  )
}

describe('i18n Component Integration', () => {
  beforeEach(async () => {
    await resetI18n()
  })

  describe('Basic Translation Rendering', () => {
    it('should render English translations by default', () => {
      renderWithI18n(<TestComponent />)

      expect(screen.getByTestId('title')).toHaveTextContent('Welcome')
      expect(screen.getByTestId('loading')).toHaveTextContent('Loading...')
      expect(screen.getByTestId('save-btn')).toHaveTextContent('Save')
      expect(screen.getByTestId('nav-home')).toHaveTextContent('Home')
    })

    it('should render Korean translations', async () => {
      await changeTestLanguage('ko')
      renderWithI18n(<TestComponent />)

      expect(screen.getByTestId('title')).toHaveTextContent('환영합니다')
      expect(screen.getByTestId('loading')).toHaveTextContent('로딩 중...')
      expect(screen.getByTestId('save-btn')).toHaveTextContent('저장')
      expect(screen.getByTestId('nav-home')).toHaveTextContent('홈')
    })

    it('should render Japanese translations', async () => {
      await changeTestLanguage('ja')
      renderWithI18n(<TestComponent />)

      expect(screen.getByTestId('title')).toHaveTextContent('ようこそ')
      expect(screen.getByTestId('loading')).toHaveTextContent('読み込み中...')
      expect(screen.getByTestId('save-btn')).toHaveTextContent('保存')
      expect(screen.getByTestId('nav-home')).toHaveTextContent('ホーム')
    })
  })

  describe('Dynamic Language Switching', () => {
    it('should switch from English to Korean', async () => {
      const user = userEvent.setup()
      renderWithI18n(<LanguageSelector />)

      expect(screen.getByTestId('current-lang')).toHaveTextContent('en')

      await user.click(screen.getByTestId('switch-ko'))

      await waitFor(() => {
        expect(screen.getByTestId('current-lang')).toHaveTextContent('ko')
      })
    })

    it('should switch from English to Japanese', async () => {
      const user = userEvent.setup()
      renderWithI18n(<LanguageSelector />)

      expect(screen.getByTestId('current-lang')).toHaveTextContent('en')

      await user.click(screen.getByTestId('switch-ja'))

      await waitFor(() => {
        expect(screen.getByTestId('current-lang')).toHaveTextContent('ja')
      })
    })

    it('should switch between multiple languages', async () => {
      const user = userEvent.setup()
      renderWithI18n(<LanguageSelector />)

      // Switch to Korean
      await user.click(screen.getByTestId('switch-ko'))
      await waitFor(() => {
        expect(screen.getByTestId('current-lang')).toHaveTextContent('ko')
      })

      // Switch to Japanese
      await user.click(screen.getByTestId('switch-ja'))
      await waitFor(() => {
        expect(screen.getByTestId('current-lang')).toHaveTextContent('ja')
      })

      // Switch back to English
      await user.click(screen.getByTestId('switch-en'))
      await waitFor(() => {
        expect(screen.getByTestId('current-lang')).toHaveTextContent('en')
      })
    })
  })

  describe('Form Translation with Interpolation', () => {
    it('should render English form labels', () => {
      renderWithI18n(<FormComponent />)

      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByTestId('required-msg')).toHaveTextContent('This field is required')
      expect(screen.getByTestId('min-length-msg')).toHaveTextContent('Must be at least 8 characters')
    })

    it('should render Korean form labels with interpolation', async () => {
      await changeTestLanguage('ko')
      renderWithI18n(<FormComponent />)

      expect(screen.getByText('이름')).toBeInTheDocument()
      expect(screen.getByText('이메일')).toBeInTheDocument()
      expect(screen.getByTestId('required-msg')).toHaveTextContent('필수 입력 항목입니다')
      expect(screen.getByTestId('min-length-msg')).toHaveTextContent('최소 8자 이상이어야 합니다')
    })

    it('should render Japanese form labels with interpolation', async () => {
      await changeTestLanguage('ja')
      renderWithI18n(<FormComponent />)

      expect(screen.getByText('名前')).toBeInTheDocument()
      expect(screen.getByText('メールアドレス')).toBeInTheDocument()
      expect(screen.getByTestId('required-msg')).toHaveTextContent('必須項目です')
      expect(screen.getByTestId('min-length-msg')).toHaveTextContent('8文字以上で入力してください')
    })
  })
})

describe('i18n Edge Cases', () => {
  beforeEach(async () => {
    await resetI18n()
  })

  it('should handle missing translation gracefully', () => {
    function MissingKeyComponent() {
      const { t } = useTranslation()
      return <span data-testid="missing">{t('non.existent.key')}</span>
    }

    renderWithI18n(<MissingKeyComponent />)

    // i18next returns the key when translation is missing
    expect(screen.getByTestId('missing')).toHaveTextContent('non.existent.key')
  })

  it('should render nested translations correctly', () => {
    function NestedComponent() {
      const { t } = useTranslation()
      return (
        <div>
          <span data-testid="nested">{t('pages.mswTest.title')}</span>
        </div>
      )
    }

    renderWithI18n(<NestedComponent />)

    expect(screen.getByTestId('nested')).toHaveTextContent('MSW + TanStack Query Test')
  })

  it('should handle multiple interpolations', () => {
    // This tests that our form validation messages work correctly
    function InterpolationComponent() {
      const { t } = useTranslation()
      return (
        <div>
          <span data-testid="min">{t('form.minLength', { min: 5 })}</span>
          <span data-testid="max">{t('form.maxLength', { max: 200 })}</span>
        </div>
      )
    }

    renderWithI18n(<InterpolationComponent />)

    expect(screen.getByTestId('min')).toHaveTextContent('Must be at least 5 characters')
    expect(screen.getByTestId('max')).toHaveTextContent('Must be at most 200 characters')
  })
})
