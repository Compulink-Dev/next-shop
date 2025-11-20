import ProductItem from '@/components/products/ProductItem'
import { Rating } from '@/components/products/Rating'
import productServices from '@/lib/services/productService'
import Link from 'next/link'
import { Filter, X, ChevronDown } from 'lucide-react'

const sortOrders = ['newest', 'lowest', 'highest', 'rating']
const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
]

const ratings = [5, 4, 3, 2, 1]

export async function generateMetadata({
  searchParams: { q = 'all', category = 'all', price = 'all', rating = 'all' },
}: {
  searchParams: {
    q: string
    category: string
    price: string
    rating: string
    sort: string
    page: string
  }
}) {
  if (
    (q !== 'all' && q !== '') ||
    category !== 'all' ||
    rating !== 'all' ||
    price !== 'all'
  ) {
    return {
      title: `Search ${q !== 'all' ? q : ''}
          ${category !== 'all' ? ` : Category ${category}` : ''}
          ${price !== 'all' ? ` : Price ${price}` : ''}
          ${rating !== 'all' ? ` : Rating ${rating}` : ''}`,
    }
  } else {
    return {
      title: 'Search Products',
    }
  }
}

export default async function SearchPage({
  searchParams: {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  },
}: {
  searchParams: {
    q: string
    category: string
    price: string
    rating: string
    sort: string
    page: string
  }
}) {
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string
    s?: string
    p?: string
    r?: string
    pg?: string
  }) => {
    const params = { q, category, price, rating, sort, page }
    if (c) params.category = c
    if (p) params.price = p
    if (r) params.rating = r
    if (pg) params.page = pg
    if (s) params.sort = s
    return `/search?${new URLSearchParams(params).toString()}`
  }
  const categories = await productServices.getCategories()

  console.log(categories);


  const { countProducts, products, pages } = await productServices.getByQuery({
    category,
    q,
    price,
    rating,
    page,
    sort,
  })
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-2">Search Products</h1>
          <p className="text-base-content/60">
            Browse our complete catalog of IT solutions
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-base-200 rounded-2xl p-6 border border-base-300 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-base-content">Filters</h2>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                  <ChevronDown className="w-4 h-4" />
                  Category
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      className={`block py-2 px-3 rounded-lg transition-colors ${
                        'all' === category 
                          ? 'bg-primary text-primary-content font-semibold' 
                          : 'hover:bg-base-300 text-base-content'
                      }`}
                      href={getFilterUrl({ c: 'all' })}
                    >
                      All Categories
                    </Link>
                  </li>
                  {categories.map((c: string) => (
                    <li key={c}>
                      <Link
                        className={`block py-2 px-3 rounded-lg transition-colors ${
                          c === category 
                            ? 'bg-primary text-primary-content font-semibold' 
                            : 'hover:bg-base-300 text-base-content'
                        }`}
                        href={getFilterUrl({ c })}
                      >
                        {c}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                  <ChevronDown className="w-4 h-4" />
                  Price Range
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      className={`block py-2 px-3 rounded-lg transition-colors ${
                        'all' === price 
                          ? 'bg-primary text-primary-content font-semibold' 
                          : 'hover:bg-base-300 text-base-content'
                      }`}
                      href={getFilterUrl({ p: 'all' })}
                    >
                      Any Price
                    </Link>
                  </li>
                  {prices.map((p) => (
                    <li key={p.value}>
                      <Link
                        href={getFilterUrl({ p: p.value })}
                        className={`block py-2 px-3 rounded-lg transition-colors ${
                          p.value === price 
                            ? 'bg-primary text-primary-content font-semibold' 
                            : 'hover:bg-base-300 text-base-content'
                        }`}
                      >
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                  <ChevronDown className="w-4 h-4" />
                  Customer Rating
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href={getFilterUrl({ r: 'all' })}
                      className={`block py-2 px-3 rounded-lg transition-colors ${
                        'all' === rating 
                          ? 'bg-primary text-primary-content font-semibold' 
                          : 'hover:bg-base-300 text-base-content'
                      }`}
                    >
                      All Ratings
                    </Link>
                  </li>
                  {ratings.map((r) => (
                    <li key={r}>
                      <Link
                        href={getFilterUrl({ r: `${r}` })}
                        className={`block py-2 px-3 rounded-lg transition-colors ${
                          `${r}` === rating 
                            ? 'bg-primary text-primary-content font-semibold' 
                            : 'hover:bg-base-300 text-base-content'
                        }`}
                      >
                        <Rating caption={' & up'} value={r}></Rating>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-base-200 rounded-2xl p-4 mb-6 border border-base-300">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-base-content">
                    {products.length === 0 ? 'No' : countProducts} Results
                  </span>
                  {q !== 'all' && q !== '' && (
                    <span className="badge badge-primary badge-lg">{q}</span>
                  )}
                  {category !== 'all' && (
                    <span className="badge badge-secondary badge-lg">{category}</span>
                  )}
                  {price !== 'all' && (
                    <span className="badge badge-accent badge-lg">Price: {price}</span>
                  )}
                  {rating !== 'all' && (
                    <span className="badge badge-info badge-lg">Rating: {rating}+ ⭐</span>
                  )}
                  {((q !== 'all' && q !== '') ||
                    category !== 'all' ||
                    rating !== 'all' ||
                    price !== 'all') && (
                    <Link 
                      className="btn btn-ghost btn-sm gap-2 hover:bg-error/10 hover:text-error" 
                      href="/search"
                    >
                      <X className="w-4 h-4" />
                      Clear All
                    </Link>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-base-content/70">Sort by:</span>
                  <div className="flex gap-1">
                    {sortOrders.map((s) => (
                      <Link
                        key={s}
                        className={`btn btn-sm ${
                          sort == s 
                            ? 'btn-primary' 
                            : 'btn-ghost hover:bg-primary/10'
                        }`}
                        href={getFilterUrl({ s })}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="bg-base-200 rounded-2xl p-16 text-center border border-base-300">
                <Filter className="w-24 h-24 mx-auto mb-6 text-base-content/30" />
                <h3 className="text-2xl font-bold text-base-content mb-4">No products found</h3>
                <p className="text-base-content/60 mb-6">Try adjusting your filters or search query</p>
                <Link href="/search" className="btn btn-primary rounded-full">
                  Clear Filters
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 mb-8">
                  {products.map((product) => (
                    <ProductItem key={product.slug} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center">
                    <div className="join">
                      {Array.from(Array(pages).keys()).map((p) => (
                        <Link
                          key={p}
                          className={`join-item btn ${
                            Number(page) === p + 1 
                              ? 'btn-primary' 
                              : 'btn-ghost'
                          }`}
                          href={getFilterUrl({ pg: `${p + 1}` })}
                        >
                          {p + 1}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
