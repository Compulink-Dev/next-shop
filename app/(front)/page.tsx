/* eslint-disable @next/next/no-img-element */
import ProductItem from "@/components/products/ProductItem";
import getBanners from "@/lib/services/bannerServices";
import productService from "@/lib/services/productService";
import { convertDocToObj } from "@/lib/utils";
import Link from "next/link";

export default async function Home() {
  const featuredProducts = await getBanners();
  const latestProducts = await productService.getLatest();
  const categories = await productService.getCategories();

  const categoryProducts = await Promise.all(
    categories.map(async (category) => {
      const products = await productService.getProductsByCategory(category);
      return { category, products };
    })
  );

  return (
    <>
      {/* Full-Width Hero Banner Section */}
      <div className="w-full">
        <div className="carousel w-full h-[500px] lg:h-[600px]">
          {featuredProducts.map((product, index) => (
            <div
              key={product._id}
              id={`slide-${index}`}
              className="carousel-item relative w-full"
            >
              <Link href={`/product/${product.slug}`} className="relative w-full block group">
                <img
                  src={product.image}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={product.name}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent">
                  <div className="container mx-auto px-4 h-full flex items-center">
                    <div className="max-w-2xl text-white drop-shadow-lg">
                      <div className="inline-block px-4 py-2 bg-primary rounded-full mb-4 text-sm font-semibold text-white shadow-lg">
                        🔥 Featured Product
                      </div>
                      <h1 className="text-5xl lg:text-6xl font-bold mb-4 leading-tight drop-shadow-2xl">
                        {product.name}
                      </h1>
                      <p className="text-xl mb-6 text-white/90 drop-shadow-md">
                        Premium IT solutions for modern businesses
                      </p>
                      <button className="btn btn-primary btn-lg rounded-full gap-2 shadow-2xl hover:scale-105 transition-transform">
                        Shop Now
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </Link>

              <div
                className="absolute flex justify-between transform 
                 -translate-y-1/2 left-8 right-8 top-1/2"
              >
                <a
                  href={`#slide-${
                    index === 0 ? featuredProducts.length - 1 : index - 1
                  }`}
                  className="btn btn-circle btn-primary shadow-2xl hover:scale-110 transition-all"
                >
                  ❮
                </a>
                <a
                  href={`#slide-${
                    index === featuredProducts.length - 1 ? 0 : index + 1
                  }`}
                  className="btn btn-circle btn-primary shadow-2xl hover:scale-110 transition-all"
                >
                  ❯
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stats Section */}
      <div className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">500+</div>
              <div className="text-sm lg:text-base opacity-90">IT Products</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">24/7</div>
              <div className="text-sm lg:text-base opacity-90">Support</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">10K+</div>
              <div className="text-sm lg:text-base opacity-90">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold mb-2">99%</div>
              <div className="text-sm lg:text-base opacity-90">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Products Section */}
      <section className="container mx-auto px-4 mt-16 mb-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Latest IT Solutions
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {latestProducts.map((product: any) => (
            <ProductItem key={product.slug} product={convertDocToObj(product)} />
          ))}
        </div>
      </section>

      {/* Category Products Sections */}
      {categoryProducts.map((categoryProduct, idx) => (
        <section key={categoryProduct.category} className="container mx-auto px-4 mt-16 mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-1 w-12 bg-gradient-to-r from-secondary to-accent rounded-full"></div>
            <h2 className="text-4xl font-bold text-base-content">
              {categoryProduct.category}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryProduct.products.map((product: any) => (
              <ProductItem
                key={product.slug}
                product={convertDocToObj(product)}
              />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
