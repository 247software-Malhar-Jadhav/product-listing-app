import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Rating } from '@/components/products/Rating'
import type { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
  /** Current listing querystring, forwarded so the detail page can restore filters on Back. */
  listingSearch?: string
}

export function ProductCard({ product, listingSearch }: ProductCardProps) {
  return (
    <Link
      to={`/product/${product.id}`}
      state={{ listingSearch }}
      className="group block focus:outline-none"
    >
      <Card className="h-full overflow-hidden py-0 transition-shadow hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <div className="flex aspect-square items-center justify-center bg-white p-4">
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-contain transition-transform group-hover:scale-105"
          />
        </div>
        <CardContent className="space-y-1 px-4 pb-4">
          <h3 className="truncate text-sm font-medium" title={product.title}>
            {product.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold">${product.price}</span>
            <Rating value={product.rating} />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
