import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tag-input',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './tag-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagInputComponent),
      multi: true,
    },
  ],
})
export class TagInputComponent {
  @Input() placeholder = 'Add a tag...';
  @Input<number>() maxTags: number = 5;

  @Input() suggestions: string[] = [];

  tags: string[] = [];

  inputValue = '';

  filteredSuggestions: string[] = [];

  highlightedIndex = 0;

  // CVA callbacks
  private onChange = (_: any) => {};
  private onTouched = () => {};

  writeValue(value: string[]): void {
    this.tags = Array.isArray(value) ? [...value] : [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInputChange() {
    const query = this.inputValue.toLowerCase();

    this.filteredSuggestions = this.suggestions
      .filter(s => s.toLowerCase().includes(query) && !this.tags.includes(s))
      .slice(0, 10);

    this.highlightedIndex = 0;
  }

  selectSuggestion(suggestion: string) {
    this.tags = [...this.tags, suggestion];
    this.onChange(this.tags);
    this.onTouched();

    this.inputValue = '';
    this.filteredSuggestions = [];
  }

  handleEnter(event: KeyboardEvent) {
    event.preventDefault();

    if (this.filteredSuggestions.length > 0) {
      this.selectSuggestion(this.filteredSuggestions[this.highlightedIndex]);
      return;
    }

    // If no suggestion matches → add text directly as tag
    const value = this.inputValue.trim();
    if (!value) return;

    this.tags = [...this.tags, value];
    this.onChange(this.tags);
    this.onTouched();

    this.inputValue = '';
  }

  moveSelection(direction: number) {
    if (this.filteredSuggestions.length === 0) return;

    this.highlightedIndex =
      (this.highlightedIndex + direction + this.filteredSuggestions.length) % this.filteredSuggestions.length;
  }

  removeTag(tag: string) {
    this.tags = this.tags.filter(t => t !== tag);
    this.onChange(this.tags);
    this.onTouched();
  }
}
