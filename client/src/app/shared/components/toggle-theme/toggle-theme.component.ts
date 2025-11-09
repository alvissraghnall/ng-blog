import { Component, OnInit, HostListener, ElementRef, computed, Signal } from '@angular/core';
import { ThemeService, ThemeMode } from '@core/theme/services/theme.service';
import { signal } from '@angular/core';
import { LucideIconData, MonitorIcon, MoonIcon, SunIcon } from 'lucide-angular';
import { ZardIconComponent } from '@ui/icon/icon.component';

@Component({
  selector: 'app-toggle-theme',
  imports: [ZardIconComponent],
  template: `
      <div class="relative">
        <button 
          class="group relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 flex items-center gap-2 border border-gray-200 dark:border-gray-700"
          (click)="toggleOptions()"
          [attr.aria-label]="'Theme options'"
          [attr.title]="'Theme options'"
        >
          <z-icon [zType]="iconName()" zSize="xl" class="text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform" />
          <span class="text-sm text-gray-700 dark:text-gray-300 hidden sm:block capitalize">{{ currentMode() }}</span>
          <svg class="w-4 h-4 text-gray-700 dark:text-gray-300 transition-transform duration-200" 
               [class.rotate-180]="showOptions()" 
               fill="none" 
               stroke="currentColor" 
               viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        @if (showOptions()) {
          <div class="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-1 z-50 min-w-[160px] animate-fade-in">
            <div class="py-1">
              <button 
                class="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                [class.bg-blue-50.dark:bg-blue-900/30.text-blue-600.dark:text-blue-400]="currentMode() === 'light'"
                (click)="setTheme('light')"
              >
                <z-icon [zType]="sunIcon" zSize="xl" [class]="currentMode() === 'light' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'" />
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Light</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">Always light mode</span>
                </div>
              </button>
      
              <button 
                class="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                [class.bg-blue-50.dark:bg-blue-900/30.text-blue-600.dark:text-blue-400]="currentMode() === 'dark'"
                (click)="setTheme('dark')"
              >
                <z-icon [zType]="moonIcon" zSize="xl" [class]="currentMode() === 'dark' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'" />
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-100">Dark</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">Always dark mode</span>
                </div>
              </button>
      
              <button 
                class="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                [class.bg-blue-50.dark:bg-blue-900/30.text-blue-600.dark:text-blue-400]="currentMode() === 'system'"
                (click)="setTheme('system')"
              >
                <z-icon [zType]="monitorIcon" zSize="xl" [class]="currentMode() === 'system' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'" />
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-100">System</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">Follow system preference</span>
                </div>
              </button>
            </div>
          </div>  
        }
        
      </div>
    `,
  styles: ``,
})
export class ToggleThemeComponent {
  sunIcon = SunIcon;
  monitorIcon = MonitorIcon;
  moonIcon = MoonIcon;

  currentMode = this.themeService.currentMode;
  isDarkMode = this.themeService.isDarkMode;

  showOptions = signal(false);

  iconName: Signal<LucideIconData> = computed(() => {
    const mode = this.currentMode();
    if (mode === 'light') return SunIcon;
    if (mode === 'dark') return MoonIcon;
    return MonitorIcon;
  });

  tooltipText = computed(() => {
    const mode = this.currentMode();
    if (mode === 'light') return 'Switch to Dark Mode';
    if (mode === 'dark') return 'Switch to System Preference';
    return 'Switch to Light Mode';
  });

  constructor(
    private themeService: ThemeService,
    private elementRef: ElementRef,
  ) {}

  ngOnInit(): void {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.showOptions.set(false);
    }
  }

  setTheme(mode: ThemeMode): void {
    this.themeService.setTheme(mode);
    this.showOptions.set(false);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleOptions(): void {
    this.showOptions.update(show => !show);
  }
}
