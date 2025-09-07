import {
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';

type PanelMode = 'persistent' | 'overlay';
type PanelPos = 'left' | 'right';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css'],
})
export class SidePanelComponent {
  @Input() mode: PanelMode = 'overlay';
  @Input() position: PanelPos = 'left';
  /** Controlado por el padre (two-way si usás [(expanded)]) */
  @Input() expanded = false;
  @Output() expandedChange = new EventEmitter<boolean>();
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  /** Tamaños */
  @Input() width = '320px';
  @Input() collapsedWidth = '0px'; // solo aplica en 'persistent'

  /** Overlay options */
  @Input() hasBackdrop = true;
  @Input() closeOnBackdrop = true;
  @Input() closeOnEsc = true;

  @Input() background = '#fff'; // valor por defecto

  @HostBinding('style.--panel-bg')
  get cssBg() {
    return this.background;
  }

  // Clases al host
  @HostBinding('class.overlay') get isOverlay() {
    return this.mode === 'overlay';
  }
  @HostBinding('class.persistent') get isPersist() {
    return this.mode === 'persistent';
  }
  @HostBinding('class.left') get isLeft() {
    return this.position === 'left';
  }
  @HostBinding('class.right') get isRight() {
    return this.position === 'right';
  }
  @HostBinding('class.expanded') get isExpanded() {
    return this.expanded;
  }

  // CSS vars al host
  @HostBinding('style.--panel-width') get cssW() {
    return this.width;
  }
  @HostBinding('style.--panel-collapsed-width') get cssCW() {
    return this.collapsedWidth;
  }

  open() {
    if (!this.expanded) {
      this.expanded = true;
      this.expandedChange.emit(true);
      this.opened.emit();
    }
  }
  close() {
    if (this.expanded) {
      this.expanded = false;
      this.expandedChange.emit(false);
      this.closed.emit();
    }
  }
  toggle() {
    this.expanded ? this.close() : this.open();
  }

  onBackdropClick() {
    if (this.mode === 'overlay' && this.closeOnBackdrop) this.close();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEsc(ev: KeyboardEvent) {
    if (this.mode === 'overlay' && this.closeOnEsc && this.expanded) {
      ev.preventDefault();
      this.close();
    }
  }
}
