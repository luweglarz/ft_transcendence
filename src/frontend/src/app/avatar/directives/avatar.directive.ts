import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AvatarService } from '../avatar.service';

@Directive({
  selector: '[avatar]',
})
export class AvatarDirective implements AfterViewInit, OnChanges {
  private img: HTMLImageElement;
  private _srcSubstription?: Subscription;
  @Input() username = '';

  constructor(el: ElementRef, private service: AvatarService) {
    this.img = el.nativeElement;
    this.img.src = this.service.default_src;
  }

  ngAfterViewInit(): void {
    this.subscribeSrc();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['username']) {
      this._srcSubstription?.unsubscribe();
      this.subscribeSrc();
    }
  }

  subscribeSrc() {
    let src$: Observable<string>;
    if (!this.username) src$ = this.service.me.src;
    else src$ = this.service.getSrc(this.username);
    this._srcSubstription = src$.subscribe(this.updateSrc);
  }

  updateSrc = (src: string) => {
    this.img.src = src;
  };
}
