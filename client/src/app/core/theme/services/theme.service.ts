import { Injectable, Inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme-preference';
  private readonly DARK_CLASS = 'dark';

  private _currentMode = signal<ThemeMode>('system');
  private _systemPreference = signal<boolean>(false);

  isDarkMode = computed(() => {
    const mode = this._currentMode();
    return mode === 'dark' || (mode === 'system' && this._systemPreference());
  });

  currentMode = this._currentMode.asReadonly();
  systemPreference = this._systemPreference.asReadonly();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const storedPreference = (localStorage.getItem(this.STORAGE_KEY) as ThemeMode) || 'system';
    this._currentMode.set(storedPreference);

    this.updateSystemPreference();

    this.applyTheme(storedPreference);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      this.updateSystemPreference();
      if (this._currentMode() === 'system') {
        this.applyTheme('system');
      }
    });
  }

  private updateSystemPreference(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this._systemPreference.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  private applyTheme(mode: ThemeMode): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const isDark = mode === 'dark' || (mode === 'system' && this._systemPreference());

    if (isDark) {
      document.documentElement.classList.add(this.DARK_CLASS);
    } else {
      document.documentElement.classList.remove(this.DARK_CLASS);
    }
  }

  setTheme(mode: ThemeMode): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this._currentMode.set(mode);
    localStorage.setItem(this.STORAGE_KEY, mode);
    this.applyTheme(mode);
  }

  toggleTheme(): void {
    const currentMode = this._currentMode();
    if (currentMode === 'light') {
      this.setTheme('dark');
    } else if (currentMode === 'dark') {
      this.setTheme('system');
    } else {
      this.setTheme('light');
    }
  }

  static preventFlicker(): void {
    const STORAGE_KEY = 'theme-preference';
    const DARK_CLASS = 'dark';

    const storedPreference = (localStorage.getItem(STORAGE_KEY) as ThemeMode) || 'system';

    if (
      storedPreference === 'dark' ||
      (storedPreference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add(DARK_CLASS);
    }
  }
}
