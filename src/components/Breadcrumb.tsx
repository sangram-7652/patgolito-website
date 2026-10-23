import React from 'react';
import { Home, ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href: string;
  tab?: 'landing' | 'about' | 'terms' | 'privacy' | 'delete-account';
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (tab: 'landing' | 'about' | 'terms' | 'privacy' | 'delete-account') => void;
  className?: string;
  id?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  onNavigate,
  className = '',
  id = 'site-breadcrumb-nav',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: BreadcrumbItem) => {
    if (item.tab && onNavigate) {
      e.preventDefault();
      onNavigate(item.tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      id={id}
      aria-label="Breadcrumb"
      className={`w-full bg-zinc-50/80 border-b border-zinc-200/80 py-2.5 text-xs text-zinc-600 backdrop-blur-sm ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ol
          className="flex items-center flex-wrap gap-1.5 sm:gap-2 text-[11px] sm:text-xs tracking-tight"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isFirst = index === 0;

            return (
              <li
                key={item.href + index}
                className="inline-flex items-center gap-1.5"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {!isFirst && (
                  <ChevronRight
                    className="w-3.5 h-3.5 text-zinc-400 shrink-0 select-none"
                    aria-hidden="true"
                  />
                )}

                {isLast ? (
                  <span
                    className="font-semibold text-zinc-900 flex items-center gap-1.5 truncate max-w-[240px] sm:max-w-md"
                    aria-current="page"
                    itemProp="name"
                  >
                    {isFirst && <Home className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />}
                    <span>{item.label}</span>
                  </span>
                ) : (
                  <a
                    href={item.href}
                    onClick={(e) => handleClick(e, item)}
                    className="flex items-center gap-1.5 text-zinc-600 hover:text-black hover:underline underline-offset-4 font-medium transition-colors cursor-pointer"
                    itemProp="item"
                  >
                    {isFirst && <Home className="w-3.5 h-3.5 text-zinc-500 group-hover:text-black shrink-0" aria-hidden="true" />}
                    <span itemProp="name">{item.label}</span>
                  </a>
                )}

                <meta itemProp="position" content={String(index + 1)} />
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
