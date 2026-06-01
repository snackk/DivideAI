import { useState, useCallback } from 'react';

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => {
    setSearchTerm('');
    setSearchOpen(false);
  }, []);

  return { searchTerm, setSearchTerm, searchOpen, openSearch, closeSearch };
}

