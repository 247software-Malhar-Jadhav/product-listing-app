import axios from 'axios'
import type { Category, Product, ProductsResponse } from '@/types/product'

export const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 15000,
})

/**
 * Fetch every product in a scope in one request.
 *
 * The DummyJSON API cannot filter by price or brand server-side, so we pull the
 * full scope (all products, or all products in a category) and apply the price /
 * brand filters and pagination on the client. The dataset is small (~200 items),
 * which keeps combined filtering correct and the brand list complete.
 */
export async function fetchAllProducts(): Promise<Product[]> {
  const { data } = await api.get<ProductsResponse>('/products', {
    params: { limit: 0 },
  })
  return data.products
}

export async function fetchProductsByCategory(slug: string): Promise<Product[]> {
  const { data } = await api.get<ProductsResponse>(
    `/products/category/${slug}`,
    { params: { limit: 0 } },
  )
  return data.products
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/products/categories')
  return data
}

export async function fetchProduct(id: number | string): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`)
  return data
}
