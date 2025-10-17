'use client';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SearchInputProps {
  placeholder?: string;
}

export function SearchInput({ placeholder }: SearchInputProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [searchValue, setSearchValue] = useState(searchParams.get('search')?.toString() || '');
  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearchValue) {
      params.set('search', debouncedSearchValue);
    } else {
      params.delete('search');
    }
    replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearchValue, pathname, replace, searchParams]);

  return (
    <Input
      placeholder={placeholder}
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      className='max-w-sm'
    />
  );
}
