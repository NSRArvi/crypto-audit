"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetQuery from "@/hooks/useGetMutation";
import OrderTable from "./OrderTable";
import Loader from "../shared/Loader/Loader";
import { Input } from "../ui/input";
import { act, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Pagination from "../shared/Pagination/Pagination";
import { getSearchParams } from "@/lib/getSearchParams";
const status = [
  { label: "Default", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
  { label: "Approved", value: "approved" },
];

export default function Orders() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeOrderId, setActiveOrderId] = useState(null);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [statusValue, setStatusValue] = useState("");
  const [inputValue, setInputValue] = useState(searchParams.get("query") || "");
  const debouncedValue = useDebounce(inputValue);
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (debouncedValue) {
      params.set("query", debouncedValue);
    } else {
      params.delete("query");
    }
    if (statusValue) {
      params.set("status", statusValue);
    } else {
      params.delete("status");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedValue, statusValue, pathname, router]);

  // fetch all data to show table
  const limit = 10;

  const { name, email, order_number } = getSearchParams(debouncedValue);
  const {
    data,
    refetch: refetchOrders,
    isLoading,
  } = useGetQuery({
    endpoint: `/order/list?page=${page}&per_page=${limit || 10}&name=${name}&email=${email}&order_number=${order_number}&status=${statusValue}`,
    enabled: true,
    isTokenRequired: true,
    queryKey: ["orders", debouncedValue, statusValue, page, limit],
  });
  const orders = data?.data?.data ?? [];

  // update status
  const {
    data: statusData,
    refetch: updateOrderStatus,
    isLoading: isUpdateLoading,
  } = useGetQuery({
    endpoint: `/order/review/${activeOrderId}/${pendingStatus}`,
    enabled: false,
    isTokenRequired: true,
    queryKey: ["order-review", activeOrderId, pendingStatus],
  });

  const handleStatusChange = ({ orderId, status }) => {
    setActiveOrderId(orderId);
    setPendingStatus(status);
  };

  useEffect(() => {
    if (activeOrderId === null || pendingStatus === null) return;

    updateOrderStatus().then(() => {
      refetchOrders();
      setActiveOrderId(null);
      setPendingStatus(null);
    });
  }, [activeOrderId, pendingStatus]);

  return (
    <div className="p-6 bg-white rounded-lg mt-10">
      <div className="flex flex-col md:flex-row  justify-items-normal md:items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Manage All Orders</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Total: {orders?.length} Orders
          </p>
        </div>
        <div className="mb-6">
          <form className="mb-2">
            <Input
              placeholder="Search by order number"
              className="h-12 bg-white w-full"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </form>
          <Select
            status={status}
            value={statusValue}
            onValueChange={setStatusValue}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {status.map((stat) => (
                  <SelectItem key={stat.value} value={stat.value}>
                    {stat.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Package</TableHead>
            <TableHead>Order Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Method</TableHead>
            {/* <TableHead>Base Price</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Paid Amount</TableHead> */}
            <TableHead>Status</TableHead>
            {/* <TableHead>Transaction id </TableHead> */}
            {/* <TableHead>Payment Document</TableHed> */}
            <TableHead>Actions</TableHead>
            <TableHead>View Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-[60vh] text-center">
                <div className=" w-full flex items-center justify-center">
                  <Loader />
                </div>
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <OrderTable
                key={order?.id}
                order={order}
                status={status}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex justify-end mt-4">
        <Pagination totalPages={data?.data?.last_page} />
      </div>
    </div>
  );
}
