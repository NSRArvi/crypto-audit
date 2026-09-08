"use client";

import useGetQuery from "@/hooks/useGetMutation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Eye, PencilIcon } from "lucide-react";
import { formatDisplayDate } from "@/lib/formatDisplayDate";

export default function RequestOrders() {
  const { data, isLoading } = useGetQuery({
    endpoint: "/manual-orders",
    enabled: true,
    isTokenRequired: true,
    queryKey: ["manual-orders"],
  });
  const requestOrdersData = data?.data?.data ?? [];

  return (
    <div className="py-20">
      <Table className="shadow bg-white px-4 ">
        <TableHeader>
          <TableRow className="h-12">
            <TableHead>Customer</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Price Proposal</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requestOrdersData?.map((order) => {
            const priceProposal =
              order?.is_price_proposal_sent === 1 ? "Sent" : "Not Sent";
            return (
              <TableRow key={order?.id}>
                <TableCell className="font-medium capitalize">
                  {order.full_name}
                  <br />
                  <span className="text-muted-foreground text-xs lowercase">
                    {" "}
                    {order?.email}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {order?.service_interest}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {priceProposal}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDisplayDate(order?.created_at)}
                </TableCell>
                {order?.status === "active" ? (
                  <TableCell>
                    <Badge className="bg-green-50 text-green-700">
                      {order?.status}
                    </Badge>
                  </TableCell>
                ) : (
                  <TableCell>
                    <Badge className="bg-yellow-50 text-red-500">
                      {order?.status}
                    </Badge>
                  </TableCell>
                )}

                <TableCell className="text-center">
                  <Link href={`/dashboard/request-order/${order?.id}`}>
                    <Eye size={16} />
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
