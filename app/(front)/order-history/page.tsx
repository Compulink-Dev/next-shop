import { Metadata } from "next";
import MyOrders from "./MyOrders";

export const metadata: Metadata = {
  title: "Order History",
};
export default function OrderHistory() {
  return (
    <>
      <MyOrders />
    </>
  );
}
