import { useParams } from 'react-router-dom'

// Detail view is implemented in a later step; this keeps the route mounted.
export function ProductDetailPage() {
  const { id } = useParams()
  return <div className="p-6">Product {id}</div>
}
