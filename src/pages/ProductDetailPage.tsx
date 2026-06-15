import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Rating } from '@/components/products/Rating'
import { StateMessage } from '@/components/common/StateMessage'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useProduct } from '@/hooks/use-product'

export function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { data: product, isLoading, isError, refetch } = useProduct(id)

  // Restore the filters that were active on the listing page (passed via state).
  const listingSearch =
    (location.state as { listingSearch?: string } | null)?.listingSearch ?? ''
  const goBack = () => navigate(`/${listingSearch}`)

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Button variant="outline" size="sm" className="mb-6" onClick={goBack}>
          <ArrowLeft className="size-4" /> Back
        </Button>

        {isLoading ? (
          <DetailSkeleton />
        ) : isError || !product ? (
          <StateMessage
            title="Couldn't load this product"
            description="The product may not exist or the request failed."
            onRetry={() => refetch()}
          />
        ) : (
          <div className="grid gap-8 rounded-lg border bg-card p-6 md:grid-cols-2">
            <div className="flex items-center justify-center rounded-lg bg-white p-6">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="max-h-96 w-full object-contain"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-semibold">{product.title}</h1>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-2xl font-bold">${product.price}</span>
                  <Rating value={product.rating} />
                </div>
              </div>

              <div className="space-y-1 text-sm">
                {product.brand && (
                  <p>
                    <span className="font-medium">Brand:</span> {product.brand}
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <span className="font-medium">Category:</span>
                  <Badge variant="secondary" className="capitalize">
                    {product.category}
                  </Badge>
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="mb-1 font-semibold">Description</h2>
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
              </div>

              {product.reviews?.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h2 className="font-semibold">Reviews</h2>
                    {product.reviews.map((review, i) => (
                      <div key={i} className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {review.reviewerName}
                          </span>
                          <Rating value={review.rating} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="grid gap-8 rounded-lg border bg-card p-6 md:grid-cols-2">
      <Skeleton className="aspect-square w-full" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  )
}
