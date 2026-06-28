import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string, search: string): SafeHtml {
    if (!text || !search) {
      return text;
    }

    const regex = new RegExp(`(${search})`, 'gi');

    const highlighted = text.replace(regex, `<mark class="highlight">$1</mark>`);

    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}
