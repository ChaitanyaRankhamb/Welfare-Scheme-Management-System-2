'use client';

import * as React from 'react';
import { X, Check, ChevronsUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select items...',
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between h-auto min-h-12 py-2 px-3 rounded-2xl border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all font-medium',
            className
          )}
        >
          <div className="flex flex-wrap gap-1.5">
            {selected.length > 0 ? (
              selected.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="rounded-xl px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-none text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnselect(item);
                  }}
                >
                  {options.find((o) => o.value === item)?.label || item}
                  <X className="h-2.5 w-2.5" />
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground opacity-60 text-sm font-medium">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden" align="start">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search options..." className="h-12 border-none focus:ring-0 font-medium" />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty className="py-6 text-center text-sm font-bold text-muted-foreground italic">No results found.</CommandEmpty>
            <CommandGroup className="p-2">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(
                      selected.includes(option.value)
                        ? selected.filter((item) => item !== option.value)
                        : [...selected, option.value]
                    );
                  }}
                  className="rounded-xl h-11 px-4 cursor-pointer data-[selected='true']:bg-indigo-500/10 transition-colors"
                >
                  <div className={cn(
                    "mr-3 flex h-4 w-4 items-center justify-center rounded border border-indigo-500/20 transition-all",
                    selected.includes(option.value) ? "bg-indigo-600 border-indigo-600 text-white" : "bg-transparent"
                  )}>
                    {selected.includes(option.value) && <Check className="h-3 w-3 font-black" />}
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
