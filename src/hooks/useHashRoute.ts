import { useCallback, useEffect, useState } from 'react';
import { ROUTES, type RouteId } from '@/lib/routes';

function readRoute(): RouteId {
  const hash = window.location.hash.replace('#', '');
  return ROUTES.some((route) => route.id === hash) ? (hash as RouteId) : 'inicio';
}

export function useHashRoute(): [RouteId, (route: RouteId) => void] {
  const [route, setRoute] = useState<RouteId>(readRoute);

  useEffect(() => {
    const handleChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', handleChange);
    return () => window.removeEventListener('hashchange', handleChange);
  }, []);

  const navigate = useCallback((next: RouteId) => {
    window.location.hash = next;
  }, []);

  return [route, navigate];
}
