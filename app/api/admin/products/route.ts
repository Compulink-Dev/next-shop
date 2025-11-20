import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/lib/models/ProductModel";
import { NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";

export async function POST() {
  const session = await getServerSession(options);

  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const randomId = Math.floor(Math.random() * 10000);
  const product = new ProductModel({
    part: `PART-${randomId}`,
    name: "Sample Product",
    slug: "sample-product-" + Math.random(),
    image: "/images/shirt1.jpg",
    price: 0,
    category: "Sample Category",
    brand: "Sample Brand",
    countInStock: 0,
    description: "Sample description",
    rating: 0,
    numReviews: 0,
  });

  try {
    await product.save();
    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(options);

  if (!session || !session.user?.isAdmin) {
    console.log("Unauthorized access attempt");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const product = await ProductModel.find();
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product." },
      { status: 500 }
    );
  }
}
