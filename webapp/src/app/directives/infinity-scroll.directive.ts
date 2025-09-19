import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { InfiniteScrollService, InfiniteScrollOptions } from '../services/infinity-scroll.service';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true,
})
export class InfiniteScrollDirective implements OnInit, OnDestroy, OnChanges {
  @Input() infiniteScrollOptions: InfiniteScrollOptions = {};
  @Input() infiniteScrollDisabled = false;
  @Output() infiniteScrollTriggered = new EventEmitter<void>();

  private subscription?: Subscription;
  private isTriggering = false;

  constructor(
    private elementRef: ElementRef,
    private infiniteScrollService: InfiniteScrollService
  ) {}

  ngOnInit(): void {
    this.setupInfiniteScroll();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['infiniteScrollDisabled']) {
      if (changes['infiniteScrollDisabled'].currentValue) {
        this.cleanup();
      } else {
        this.setupInfiniteScroll();
      }
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private hasUserScrolled = false;
  private initialSetupComplete = false;
  private direction: 'up' | 'down' = 'down';
  private lastIntersectionRatio = 0;

  private setupInfiniteScroll(): void {
    if (this.infiniteScrollDisabled) {
      // console.log('🚫 Infinite scroll disabled, skipping setup');
      return;
    }

    if (this.initialSetupComplete) {
      this.cleanup();
    }

    const element = this.elementRef.nativeElement;
    // console.log('🔧 Setting up infinite scroll for element:');

    if (!this.initialSetupComplete) {
      this.setupScrollListener();
      this.setupScrollDebugger();
      this.initialSetupComplete = true;
    }

    this.subscription = this.infiniteScrollService
      .observe(element, this.infiniteScrollOptions)
      .subscribe((entry) => {
        if (!this.hasUserScrolled && entry.isIntersecting && entry.intersectionRatio > 0) {
          this.hasUserScrolled = true;
          // console.log('✅ User scroll detected - element entered viewport');
        }

        if (entry.intersectionRatio > this.lastIntersectionRatio) {
          this.direction = 'down';
        } else if (entry.intersectionRatio < this.lastIntersectionRatio) {
          this.direction = 'up';
        }
        this.lastIntersectionRatio = entry.intersectionRatio;

        // console.log('👁️ Intersection Observer triggered:');

        if (!entry.isIntersecting && this.isTriggering) {
          // console.log('🔄 Resetting isTriggering - element left viewport');
          this.isTriggering = false;
        }

        // Todo[Erik] - Refatorar para disparar quando o elemento entrar e for 100% visível
        if (
          entry.isIntersecting &&
          !this.infiniteScrollDisabled &&
          !this.isTriggering &&
          this.hasUserScrolled &&
          this.direction === 'down' &&
          entry.intersectionRatio > 0.3
        ) {
          // console.log('🚀 Triggering infinite scroll event!');
          this.isTriggering = true;
          this.infiniteScrollTriggered.emit();
          setTimeout(() => {
            // console.log('✅ Reset isTriggering flag after timeout');
            this.isTriggering = false;
          }, 1000);
        } else {
          // console.log('❌ Not triggering because:', {
          //   isIntersecting: entry.isIntersecting,
          //   disabled: this.infiniteScrollDisabled,
          //   isTriggering: this.isTriggering,
          //   hasUserScrolled: this.hasUserScrolled,
          //   direction: this.direction,
          //   intersectionRatio: entry.intersectionRatio,
          // });
        }
      });
  }

  private setupScrollListener(): void {
    // console.log('📜 Scroll listener setup - using Intersection Observer for detection');
  }

  private scrollDebugHandler = () => {
    const element = this.elementRef.nativeElement;
    const rect = element.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

    // console.log('📜 Scroll event detected:', {
    //   top: rect.top,
    //   bottom: rect.bottom,
    //   visible: isVisible,
    // });
  };

  private setupScrollDebugger(): void {
    // console.log('🔍 Setting up scroll debugger');
    window.addEventListener('scroll', this.scrollDebugHandler, { passive: true });
  }

  private removeScrollDebugger(): void {
    console.log('🗑️ Removing scroll debugger');
    window.removeEventListener('scroll', this.scrollDebugHandler);
  }

  private cleanup(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
    this.infiniteScrollService.unobserve(this.elementRef.nativeElement);
    this.removeScrollDebugger();
  }
}
