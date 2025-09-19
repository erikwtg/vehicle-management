import { Injectable, ElementRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface InfiniteScrollOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

@Injectable({
  providedIn: 'root',
})
export class InfiniteScrollService {
  private observers = new Map<Element, IntersectionObserver>();
  private subjects = new Map<Element, Subject<IntersectionObserverEntry>>();

  observe(
    element: Element,
    options: InfiniteScrollOptions = {}
  ): Observable<IntersectionObserverEntry> {
    const defaultOptions: InfiniteScrollOptions = {
      root: null,
      rootMargin: '50px',
      threshold: [0, 0.1, 0.25, 0.5],
      ...options,
    };

    if (this.subjects.has(element)) {
      return this.subjects.get(element)!.asObservable();
    }

    const subject = new Subject<IntersectionObserverEntry>();
    this.subjects.set(element, subject);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === element) {
          subject.next(entry);
        }
      });
    }, defaultOptions);

    this.observers.set(element, observer);
    observer.observe(element);

    return subject.asObservable();
  }

  unobserve(element: Element): void {
    const observer = this.observers.get(element);
    const subject = this.subjects.get(element);

    if (observer) {
      observer.unobserve(element);
      observer.disconnect();
      this.observers.delete(element);
    }

    if (subject) {
      subject.complete();
      this.subjects.delete(element);
    }
  }

  disconnectAll(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.subjects.forEach((subject) => subject.complete());
    this.observers.clear();
    this.subjects.clear();
  }
}
