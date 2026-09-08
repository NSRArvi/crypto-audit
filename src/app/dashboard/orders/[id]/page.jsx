"use client";

import { OrderCardSkeleton } from "@/components/skeleton/OrderCardSkeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import useGetQuery from "@/hooks/useGetMutation";
import { Building2Icon, CreditCardIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetQuery({
    endpoint: `/order/${id}`,
    enabled: !!id,
    isTokenRequired: true,
    queryKey: ["order-details", id],
  });
  const order = data?.data ?? {};
  console.log(order);

  if (isLoading) {
    return <OrderCardSkeleton />;
  }

  return (
    <div className="flex items-center justify-center w-full h-full min-h-dvh">
      <div className="w-full lg:w-2/3 mx-auto shadow bg-white rounded-xl overflow-hidden">
        <div className="p-5 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground tracking-wider">
              # {order?.order_number}
            </span>
            <span
              className={`capitalize px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                order.status === "pending"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              }`}
            >
              {order.status}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 mt-2">
            {order.package?.name}
          </h3>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            Ordered on {new Date(order.started_at).toLocaleDateString()}
          </p>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Total Paid
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <p className="text-2xl font-extrabold text-slate-900">
                  <span className="text-2xl font-black leading-tight text-foreground">
                    {order?.discount && (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: order?.currency,
                        }}
                        className="text-black"
                      />
                    )}
                  </span>

                  {order?.discount &&
                    order?.discount?.discount_type === "percentage" &&
                    parseFloat(
                      order?.amount -
                        parseFloat(order?.amount || 0) *
                          (parseFloat(order?.discount?.discount_amount) / 100),
                    ).toFixed(2)}
                  {order?.discount &&
                    order?.discount?.discount_type === "fixed" &&
                    parseFloat(
                      order?.amount - order?.discount?.discount_amount,
                    )}
                </p>
                {order?.currency && (
                  <span className="text-sm text-muted-foreground line-through">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: order?.currency,
                      }}
                      className="text-black"
                    />
                    {parseFloat(order?.amount || 0).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {order?.discount?.email && (
              <span className="bg-red-50 text-red-700 border border-red-100 flex items-center gap-1 font-bold rounded-lg text-xs px-2 py-1">
                {parseInt(order?.discount?.discount_amount)}% OFF
              </span>
            )}
          </div>

          {order?.order_discount && (
            <div className="flex items-start gap-2 text-xs text-amber-800">
              <p>
                Discount offer terms valid until:{" "}
                <span className="font-semibold">
                  {new Date(
                    order?.order_discount?.discount_expire_at,
                  ).toLocaleDateString()}
                </span>
              </p>
            </div>
          )}

          <div className="space-y-2 pt-1 text-xs">
            <div className="flex justify-between items-center text-muted-foreground">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium capitalize flex items-center gap-1.5">
                {order?.payment_type === "manual" ? (
                  <>
                    <Building2Icon size={14} /> Bank{" "}
                  </>
                ) : (
                  <>
                    <CreditCardIcon size={14} /> Stripe{" "}
                  </>
                )}{" "}
                Transfer
              </span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono font-semibold text-muted-foreground">
                {order.manual_payment?.transaction_id}
              </span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span className="text-muted-foreground">
                {order?.discount && "Discount Source"}
              </span>
              <span className="text-muted-foreground uppercase">
                {order?.discount?.discount_source}
              </span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span className="text-muted-foreground">
                {order?.discount && "Source Email"}
              </span>
              <span className="text-xs text-muted-foreground">
                {order?.discount?.email}
              </span>
            </div>
          </div>
        </div>

        {order.manual_payment?.payment_document && (
          <div className=" flex items-center justify-end px-4 pb-4">
            <Dialog>
              <DialogTrigger className="cursor-pointer">
                <span
                  variant="outline"
                  className="text-muted-foreground font-medium px-3 py-2 border border-slate-100 rounded-xl bg-white shadow-md text-xs cursor-pointer"
                >
                  View Document
                </span>
              </DialogTrigger>
              <DialogContent className="max-w-2xl! h-70 p-0 overflow-auto gap-0">
                <div className="w-full bg-gray-50 border-t border-gray-200 p-4">
                  <Image
                    src={order?.manual_payment?.payment_document}
                    alt={order?.package?.name}
                    width={800}
                    height={500}
                    className="w-full object-cover"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}
