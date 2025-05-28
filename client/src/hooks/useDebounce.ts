import { useEffect, useState } from "react";

const useDebounce = (query: string, delay: number = 500) => {
  const [debounceQuery, setDebounceQuery] = useState(query);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceQuery(query);
    }, delay);

    return () => clearTimeout(timeout);
  }, [query]);

  return debounceQuery;
};

export default useDebounce;
