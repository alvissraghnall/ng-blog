import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ZardButtonComponent } from '@ui/button/button.component';
import { ZardIconComponent } from '@ui/icon/icon.component';
import { CalendarDaysIcon } from 'lucide-angular';

@Component({
  selector: 'app-post-status-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ZardButtonComponent, ZardIconComponent],
  templateUrl: './post-status-panel.component.html',
})
export class PostStatusPanelComponent {
  @Input({ required: true }) form!: FormGroup;

  calendarIcon = CalendarDaysIcon;

  onEditVisibility() {
    console.log('Edit Visibility clicked');
  }

  onEditPublishDate() {
    console.log('Edit Publish Date clicked');
  }
}
