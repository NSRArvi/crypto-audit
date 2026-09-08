"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import useGetQuery from "@/hooks/useGetMutation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { formatDisplayDate } from "@/lib/formatDisplayDate";
import Pagination from "../shared/Pagination/Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import UserTableSkeleton from "../skeleton/UserTableSkeleton";

export default function Users() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState(searchParams.get("email") || "");
  const debouncedValue = useDebounce(inputValue);
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (debouncedValue) {
      params.set("email", debouncedValue);
    } else {
      params.delete("email");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedValue]);

  const per_page = 10;

  const { data, isLoading } = useGetQuery({
    endpoint: `/users?email=${debouncedValue}&page=${page}&per_page=${per_page || 10}`,
    enabled: true,
    isTokenRequired: true,
    queryKey: ["users", debouncedValue, page],
  });

  const users = data?.data?.data ?? [];
  console.log(data?.data?.total);

  return (
    <div className="py-20">
      <div className="p-6 bg-white rounded-lg">
        <div className="flex flex-col md:flex-row  items-start md:items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Manage All Users</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Total: {data?.data?.total} Users
            </p>
          </div>
          <form className="flex justify-end mb-6">
            <Input
              placeholder="Search user"
              className="h-12 bg-white w-full"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </form>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <UserTableSkeleton />
            ) : (
              users.map((user) => (
                <TableRow key={user?.id}>
                  <TableCell className="font-medium">{user?.name}</TableCell>
                  <TableCell>{user?.email}</TableCell>
                  <TableCell>{formatDisplayDate(user?.created_at)}</TableCell>
                  <TableCell>{user?.phone ?? "No Phone Provided"}</TableCell>
                  <TableCell>
                    {user?.address ?? "No Address Provided"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="flex justify-end mt-4">
          <Pagination
            totalPages={data?.data?.last_page}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
