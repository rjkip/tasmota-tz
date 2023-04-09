export function onClickOutside(element, listener) {
  function clickListener(event) {
    if (![element, ...element.querySelectorAll('*')].includes(event.target)) {
      listener(event);
    }
  }

  document.body.addEventListener('click', clickListener);

  return {
    destroy() {
      document.body.removeEventListener('click', clickListener);
    }
  };
}
