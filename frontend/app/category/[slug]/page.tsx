import { notFound } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCategoryBySlug, getProductsByCategory } from "@/lib/mock-data"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Header } from "@/components/header"
import Footer from "@/components/footer"

const PRODUCTS_PER_PAGE = 10

export default function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { page?: string }
}) {
  const category = getCategoryBySlug(params.slug)

  if (!category) {
    notFound()
  }

  const currentPage = Number(searchParams.page) || 1
  const { products, totalCount } = getProductsByCategory(params.slug, currentPage, PRODUCTS_PER_PAGE)

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  return (
    <>
     <Header/>
    <div className="container mx-auto max-w-7xl  ">
      {/* Category Header */}
      <div className="text-center space-y-4 mb-12 py-8">
        <h1 className="text-4xl font-bold">{category.name}</h1>
        <p className="text-muted-foreground">Discover our collection of premium {category.name.toLowerCase()}</p>
        <p className="text-sm text-muted-foreground">
          Showing {products.length} of {totalCount} products
        </p>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Page Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center space-x-4">
                  {hasPrevPage && (
                    <Button variant="outline" asChild>
                      <Link href={`/category/${params.slug}?page=${currentPage - 1}`}>
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Link>
                    </Button>
                  )}

                  <div className="flex items-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <Button key={pageNum} variant={pageNum === currentPage ? "default" : "outline"} size="sm" asChild>
                        <Link href={`/category/${params.slug}?page=${pageNum}`}>{pageNum}</Link>
                      </Button>
                    ))}
                  </div>

                  {hasNextPage && (
                    <Button variant="outline" asChild>
                      <Link href={`/category/${params.slug}?page=${currentPage + 1}`}>
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  )}
                </div>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Page {currentPage} of {totalPages}
                </p>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-semibold">No products found</h2>
          <p className="text-muted-foreground">
            We're currently updating our {category.name.toLowerCase()} collection. Check back soon!
          </p>
          <Button asChild>
            <Link href="/">Browse All Products</Link>
          </Button>
        </div>
      )}
      
    </div>
    <Footer/>
    </>
  )
}
