import { useEffect } from 'react';

export function useKeyboardShortcut(
  combo: { key: string; ctrlOrMeta?: boolean },
  callback: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) {
        return;
      }

      const ctrlOrMeta = combo.ctrlOrMeta ?? false;
      const modifierOk = ctrlOrMeta
        ? event.ctrlKey || event.metaKey
        : !event.ctrlKey && !event.metaKey;

      if (modifierOk && event.key.toLowerCase() === combo.key.toLowerCase()) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [combo.key, combo.ctrlOrMeta, callback, enabled]);
}
