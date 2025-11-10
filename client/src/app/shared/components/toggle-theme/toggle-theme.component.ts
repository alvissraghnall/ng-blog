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
          class="group relative p-2 rounded-lg bg-surface-light dark:bg-surface-dark hover:bg-background-light dark:hover:bg-background-dark transition-all duration-300 flex items-center gap-2 border border-border-light dark:border-border-dark"
          (click)="toggleOptions()"
          [attr.aria-label]="'Theme options'"
          [attr.title]="'Theme options'"
        >
          <z-icon [zType]="iconName()" zSize="xl" class="text-text-light dark:text-text-dark group-hover:scale-110 transition-transform" />
          <span class="text-sm text-text-light dark:text-text-dark hidden sm:block capitalize">{{ currentMode() }}</span>
          <svg class="w-4 h-4 text-text-light dark:text-text-dark transition-transform duration-200" 
               [class.rotate-180]="showOptions()" 
               fill="none" 
               stroke="currentColor" 
               viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        @if (showOptions()) {
          <div class="absolute top-full mt-2 right-0 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-xl p-1 z-50 min-w-[160px] animate-fade-in">
            <div class="py-1">
              <button 
                class="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-background-light dark:hover:bg-background-dark transition-colors text-left"
                [class.bg-primary-custom/10.text-primary-custom]="currentMode() === 'light'"
                (click)="setTheme('light')"
              >
                <z-icon [zType]="sunIcon" zSize="xl" [class]="currentMode() === 'light' ? 'text-primary-custom' : 'text-text-muted-light dark:text-text-muted-dark'" />
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-text-light dark:text-text-dark">Light</span>
                  <span class="text-xs text-text-muted-light dark:text-text-muted-dark">Always light mode</span>
                </div>
              </button>
      
              <button 
                class="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-background-light dark:hover:bg-background-dark transition-colors text-left"
                [class.bg-primary-custom/10.text-primary-custom]="currentMode() === 'dark'"
                (click)="setTheme('dark')"
              >
                <z-icon [zType]="moonIcon" zSize="xl" [class]="currentMode() === 'dark' ? 'text-primary-custom' : 'text-text-muted-light dark:text-text-muted-dark'" />
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-text-light dark:text-text-dark">Dark</span>
                  <span class="text-xs text-text-muted-light dark:text-text-muted-dark">Always dark mode</span>
                </div>
              </button>
      
              <button 
                class="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-background-light dark:hover:bg-background-dark transition-colors text-left"
                [class.bg-primary-custom/10.text-primary-custom]="currentMode() === 'system'"
                (click)="setTheme('system')"
              >
                <z-icon [zType]="monitorIcon" zSize="xl" [class]="currentMode() === 'system' ? 'text-primary-custom' : 'text-text-muted-light dark:text-text-muted-dark'" />
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-text-light dark:text-text-dark">System</span>
                  <span class="text-xs text-text-muted-light dark:text-text-muted-dark">Follow system preference</span>
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
