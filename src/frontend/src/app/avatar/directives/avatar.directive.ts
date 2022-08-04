import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { AvatarService } from '../avatar.service';

@Directive({
  selector: '[avatar]',
})
export class AvatarDirective implements AfterViewInit {
  private img: HTMLImageElement;
  @Input() username = '';

  constructor(el: ElementRef, private service: AvatarService) {
    this.img = el.nativeElement;
    this.img.src = this.service.default_src;
  }

  ngAfterViewInit(): void {
    if (!this.username)
      this.service.me.subscribe((src) => (this.img.src = src));
    else
      this.service.user(this.username).subscribe((src) => (this.img.src = src));
  }
}
