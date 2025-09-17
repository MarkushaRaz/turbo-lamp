import { getCurrentWindow } from '@electron/remote';
import { useEffect } from 'react';

const currentWindow = getCurrentWindow();
let timer!: NodeJS.Timeout;

function clickThroughHandler(event: MouseEvent) {
  if (event.target === document.body.children[0].children[0]) {
    currentWindow.setIgnoreMouseEvents(true, { forward: true });
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => currentWindow.setIgnoreMouseEvents(false), 600);
  } else {
    currentWindow.setIgnoreMouseEvents(false);
  }
}

export const useWindowTransparency = (): void => {
  useEffect(() => {
    window.addEventListener('mousemove', clickThroughHandler);
    return () => {
      window.removeEventListener('mousemove', clickThroughHandler);
    };
  }, []);
};
