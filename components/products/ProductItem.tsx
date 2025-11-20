import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Rating } from "./Rating";
import { Product } from "@/lib/types";

export default function ProductItem({ product }: { product: Product }) {
  return (
    <div className="group card bg-base-100 hover:bg-base-200/50 shadow-lg hover:shadow-2xl mb-4 transition-all duration-300 hover:-translate-y-2 border border-base-300 hover:border-primary/30 rounded-2xl overflow-hidden">
      <figure className="relative overflow-hidden bg-base-200">
        <Link href={`/product/${product.slug}`} className="block w-full">
          <Image
            src={`${product.image}`}
            alt={product.name}
            width={200}
            height={80}
            className="object-contain h-48 w-full p-6 transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
      </figure>
      <div className="card-body p-5">
        <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors">
          <h2 className="card-title text-lg font-semibold line-clamp-2 min-h-[56px] text-base-content">
            {product.name}
          </h2>
        </Link>
        <Rating value={product.rating} caption={`(${product.numReviews})`} />
        <p className="text-sm text-base-content/60 mb-2 font-medium">{product.brand}</p>
        <div className="card-actions flex items-center justify-between pt-2 border-t border-base-300">
          <span className="text-2xl font-bold text-primary">
            ${product.price}
          </span>
          <Link 
            href={`/product/${product.slug}`}
            className="btn btn-primary btn-sm rounded-full px-6 group-hover:shadow-lg transition-all"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
