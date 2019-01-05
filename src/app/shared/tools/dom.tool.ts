export class DomTool {
  static isInViewport(element: HTMLElement) {
    const rect = element.getBoundingClientRect();

    if (rect.height === 0 && rect.width === 0) {
      return false;
    }

    const html = document.documentElement;

    return (
      (rect.top >= 0 || rect.bottom >= 0) &&
      (rect.top <= (window.innerHeight || html.clientHeight) ||
        rect.bottom <= (window.innerHeight || html.clientHeight))
    );
  }
}
