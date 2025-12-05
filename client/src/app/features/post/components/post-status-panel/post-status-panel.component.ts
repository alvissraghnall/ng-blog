import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ZardCardComponent } from '@ui/card/card.component';
import { ZardButtonComponent } from '@ui/button/button.component';
import { ZardIconComponent } from '@ui/icon/icon.component';

@Component({
  selector: 'app-post-status-panel',
  standalone: true,
  imports: [CommonModule, ZardCardComponent, ZardButtonComponent, ZardIconComponent],
  templateUrl: './post-status-panel.component.html',
})
export class PostStatusPanelComponent {
  @Input({ required: true }) form!: FormGroup;

  onEditVisibility() {
    console.log('Edit Visibility clicked');
  }

  onEditPublishDate() {
    console.log('Edit Publish Date clicked');
  }
}
