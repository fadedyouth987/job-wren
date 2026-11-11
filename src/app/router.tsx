import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

export function navigate(path: string, replace = false) {
  if (replace) history.replaceState({}, '', path);
  else history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function usePathname() {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);
  return path;
}

export function AppLink({ href, children, className = '', onClick }: { href: string; children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <a href={href} className={className} onClick={(event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (event.currentTarget.hasAttribute('download') || href.startsWith('#')) return;
      const destination = new URL(href, window.location.href);
      if (destination.origin !== window.location.origin || !['http:', 'https:'].includes(destination.protocol)) return;
      event.preventDefault();
      onClick?.();
      navigate(destination.pathname + destination.search + destination.hash);
    }}>{children}</a>
  );
}
