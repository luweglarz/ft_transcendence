import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { JwtService } from 'src/app/auth/jwt';
import { AvatarService } from '../avatar.service';

@Directive({
  selector: '[avatar]',
})
export class AvatarDirective implements AfterViewInit, OnChanges, OnDestroy {
  private img: HTMLImageElement;
  private _srcSubstription?: Subscription;
  @Input() username = '';

  constructor(
    el: ElementRef,
    private service: AvatarService,
    private jwt: JwtService,
  ) {
    this.img = el.nativeElement;
    this.img.src = this.service.default_src;
  }

  ngAfterViewInit(): void {
    this.subscribeSrc();
  }
  ngOnDestroy(): void {
    this._srcSubstription?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['username']) {
      this._srcSubstription?.unsubscribe();
      this.subscribeSrc();
    }
  }

  subscribeSrc() {
    let src$: Observable<string>;
    if (!this.username || this.username == this.jwt.username)
      src$ = this.service.me.src;
    else src$ = this.service.getSrc(this.username);
    this._srcSubstription = src$.subscribe(this.updateSrc);
  }

  updateSrc = (src: string) => {
    this.img.src = src;
  };
}
