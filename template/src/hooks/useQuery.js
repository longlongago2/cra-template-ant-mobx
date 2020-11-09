import { useLocation } from 'react-router-dom';
import { parse } from 'qs';

// A custom hook that builds on useLocation to parse
// the query string for you.
export default function useQuery() {
  const str = new URLSearchParams(useLocation().search).toString();
  if (str) return parse(str);
  return null;
}
