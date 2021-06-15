import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { parse } from 'qs';

// A custom hook that builds on useLocation to parse
// the query string for you.
export default function useQuery(defaultValue = {}) {
  const { search } = useLocation();
  const computedQuery = (str) => {
    const searchStr = new URLSearchParams(str).toString();
    if (searchStr) return parse(searchStr);
    return defaultValue;
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const query = useMemo(() => computedQuery(search), [search]);
  return query;
}
