'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface FilterDropdownProps {
  paramName: string;
  label: string;
  options: { label: string; value: string }[];
}

export function FilterDropdown({ paramName, label, options }: FilterDropdownProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [selectedValue, setSelectedValue] = useState(searchParams.get(paramName)?.toString() || '');

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedValue) {
      params.set(paramName, selectedValue);
    } else {
      params.delete(paramName);
    }
    replace(`${pathname}?${params.toString()}`);
  }, [selectedValue, paramName, pathname, replace, searchParams]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='capitalize'>
          {label}: {selectedValue || 'All'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={selectedValue} onValueChange={setSelectedValue}>
          <DropdownMenuRadioItem value=''>All</DropdownMenuRadioItem>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
