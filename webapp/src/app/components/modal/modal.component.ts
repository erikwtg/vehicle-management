import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  OnChanges,
  signal,
  PLATFORM_ID,
  WritableSignal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() title = 'Modal';
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() showCloseButton: WritableSignal<boolean> = signal(true);
  @Output() close = new EventEmitter<void>();

  isAnimating: WritableSignal<boolean> = signal<boolean>(false);
  isBrowser: WritableSignal<boolean> = signal<boolean>(false);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser.set(isPlatformBrowser(platformId));
  }

  ngOnChanges() {
    if (!this.isBrowser()) return;

    if (this.isOpen) {
      this.isAnimating.set(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  ngOnDestroy() {
    if (!this.isBrowser()) return;

    document.body.style.overflow = 'auto';
  }

  onClose() {
    this.isAnimating.set(false);
    setTimeout(() => {
      this.close.emit();
    }, 150);
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onCancel() {
    this.onClose();
  }

  onContentClick(event: Event) {
    event.stopPropagation();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.onClose();
    }
  }
}
