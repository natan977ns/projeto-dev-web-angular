import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-textarea',
    imports: [FormsModule],
    templateUrl: './textarea.component.html',
    styleUrl: './textarea.component.css'
})
export class TextareaComponent {
  @Input() ngModel: string = '';
  @Input() disabled: boolean = false;
  @Input() placeholder: string = '';
  @Output() ngModelChange = new EventEmitter<{text: string}>();

  onInputChange(event: Event) {
    const input = event.target as HTMLTextAreaElement;
    this.ngModelChange.emit({text: input.value});
  }

  constructor() {}
}
