//@ts-nocheck
import AddToCart from "@/components/products/AddToCart";
import { convertDocToObj } from "@/lib/utils";
import productService from "@/lib/services/productService";
import Image from "next/image";
import Link from "next/link";
import { Rating } from "@/components/products/Rating";
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Truck,
  Shield,
  CheckCircle,
} from "lucide-react";
import ProductItem from "@/components/products/ProductItem";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const product = await productService.getBySlug(params.slug);
  if (!product) {
    return { title: "Product not found" };
  }
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetails({
  params,
}: {
  params: { slug: string };
}) {
  const product = await productService.getBySlug(params.slug);
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        Product not found
      </div>
    );
  }

  // Get similar products from the same category
  const similarProducts = await productService.getByQuery({
    category: product.category,
    limit: 4,
  });
  const filteredSimilar = similarProducts.products
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Breadcrumb */}
      <div className="bg-base-200 border-b border-base-300">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="bg-base-200 rounded-2xl p-8 border border-base-300">
              <Image
                src={`${product.image}`}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Part Number */}
            <div className="flex items-center gap-3">
              <span className="badge badge-primary badge-lg">
                {product.brand}
              </span>
              <span className="text-sm text-base-content/60">
                Part #: {product.part}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-base-content leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <Rating
                value={product.rating}
                caption={`${product.numReviews} reviews`}
              />
            </div>

            {/* Price & Stock */}
            <div className="bg-base-200 rounded-xl p-6 border border-base-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-base-content/70">Price:</span>
                <span className="text-4xl font-bold text-primary">
                  ${product.price}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base-content/70">Availability:</span>
                {product.countInStock > 0 ? (
                  <span className="flex items-center gap-2 text-success font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    In Stock ({product.countInStock} units)
                  </span>
                ) : (
                  <span className="text-error font-semibold">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Add to Cart */}
            {product.countInStock !== 0 && (
              <div className="space-y-4">
                <AddToCart
                  item={{
                    ...convertDocToObj(product),
                    qty: 0,
                    color: "",
                    size: "",
                  }}
                />
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-base-300">
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-xs text-base-content/60">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-xs text-base-content/60">1 Year Warranty</p>
              </div>
              <div className="text-center">
                <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-xs text-base-content/60">Secure Packaging</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-base-200 rounded-2xl p-8 mb-16 border border-base-300">
          <h2 className="text-2xl font-bold text-base-content mb-4">
            Product Description
          </h2>
          <p className="text-base-content/70 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Similar Products */}
        {filteredSimilar.length > 0 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              <h2 className="text-3xl font-bold text-base-content">
                Similar Products
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {filteredSimilar.map((item: any) => (
                <ProductItem key={item.slug} product={convertDocToObj(item)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
