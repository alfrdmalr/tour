export const TAB_KEYCODE = 9;

//  selector adapted from https://gist.github.com/r3lk3r/0030bab99347a2326334e00b23188cab#file-focusloopingutil-js
export const focusableSelector: string =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, [tabindex]:not([tabindex^="-"]):not([disabled]), [contenteditable]';
