export function useTheme() {
  const isDark = () => document.documentElement.classList.contains('dark')

  function applyTheme(dark: boolean) {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('komando_theme', dark ? 'dark' : 'light')
  }

  function initTheme() {
    const saved = localStorage.getItem('komando_theme')
    if (saved === 'dark' || (!saved && matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  /** Toggle + one-shot FX (ignite/puff/rotating) — pola Fireman */
  function toggleDark(btn?: HTMLElement | null) {
    const dark = !isDark()
    applyTheme(dark)

    // Haptic (no-op di desktop)
    try { navigator.vibrate?.(dark ? 20 : [10, 40, 10]) } catch { /* abaikan */ }

    if (btn) {
      const mark = btn.querySelector('.brand-mark')
      btn.classList.add('rotating')
      mark?.classList.add(dark ? 'puff' : 'ignite')
      setTimeout(() => {
        btn.classList.remove('rotating')
        mark?.classList.remove('puff', 'ignite')
      }, 600)
    }
  }

  return { isDark, initTheme, toggleDark }
}
