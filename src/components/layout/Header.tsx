import { Link } from 'react-router-dom'
import { Menu, Search, ShoppingCart, Heart, User } from 'lucide-react'

interface HeaderProps {
  search?: string
  onSearchChange?: (value: string) => void
}

/**
 * App header. The search box is optional — it's only interactive on the listing
 * page, where the parent passes the controlled value and change handler.
 */
export function Header({ search, onSearchChange }: HeaderProps) {
  const interactive = typeof onSearchChange === 'function'

  return (
    <header className="sticky top-0 z-20 bg-slate-800 text-slate-100">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <button
          type="button"
          aria-label="Menu"
          className="rounded p-2 hover:bg-white/10"
        >
          <Menu className="size-5" />
        </button>

        <Link to="/" className="hidden font-semibold tracking-tight sm:block">
          Shop
        </Link>

        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search ?? ''}
            onChange={(e) => onSearchChange?.(e.target.value)}
            disabled={!interactive}
            placeholder="Search products..."
            className="w-full rounded-md border-0 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-70"
          />
        </div>

        <nav className="flex items-center gap-1">
          <button aria-label="Cart" className="rounded p-2 hover:bg-white/10">
            <ShoppingCart className="size-5" />
          </button>
          <button aria-label="Wishlist" className="rounded p-2 hover:bg-white/10">
            <Heart className="size-5" />
          </button>
          <button aria-label="Account" className="rounded p-2 hover:bg-white/10">
            <User className="size-5" />
          </button>
        </nav>
      </div>
    </header>
  )
}
