"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  MessageCircle,
  Calendar,
  Tag,
  User,
  ShieldCheck,
  Send,
} from "lucide-react";
import useGetQuery from "@/hooks/useGetMutation";
import PriceProposal from "./PriceProposal";
import { formatDate } from "@/lib/formatDate";

function statusBadgeVariant(status) {
  switch (status) {
    case "pending":
      return "secondary";
    case "approved":
      return "default";
    case "rejected":
      return "destructive";
    default:
      return "outline";
  }
}

function initials(name) {
  return name
    ?.split(" ")
    ?.map((n) => n[0])
    ?.join("")
    ?.toUpperCase()
    ?.slice(0, 2);
}

export default function RequestOrderDetails({ id }) {
  console.log({ id });
  const { data, isLoading } = useGetQuery({
    endpoint: `/manual-orders/${id}`,
    enabled: !!id,
    isTokenRequired: true,
    queryKey: ["order-details", id],
  });
  const orderDetailsData = data?.data ?? {};

  return (
    <div className="min-h-screen bg-muted/30 py-10">
      <div className=" px-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Inquiry #{orderDetailsData.id}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {orderDetailsData.service_interest}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={statusBadgeVariant(orderDetailsData.status)}
              className="capitalize"
            >
              {orderDetailsData.status}
            </Badge>
            <Badge
              variant={
                orderDetailsData.is_price_proposal_sent ? "default" : "outline"
              }
            >
              {orderDetailsData.is_price_proposal_sent
                ? "Proposal sent"
                : "Proposal not sent"}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left: Requester + Contact */}
          <div className="md:col-span-2 space-y-6">
            {/* Requester card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Requester</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="text-base">
                      {initials(orderDetailsData.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium capitalize">
                      {orderDetailsData.full_name}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {orderDetailsData.job_title} at{" "}
                      <span className="capitalize">
                        {orderDetailsData.company_name}
                      </span>
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <dl className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <dt className="text-xs text-muted-foreground">Email</dt>
                      <dd className="text-sm">{orderDetailsData.email}</dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <dt className="text-xs text-muted-foreground">Company</dt>
                      <dd className="text-sm capitalize">
                        {orderDetailsData.company_name}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Briefcase className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Job title
                      </dt>
                      <dd className="text-sm capitalize">
                        {orderDetailsData.job_title}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MessageCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Preferred contact
                      </dt>
                      <dd className="text-sm">
                        <span className="capitalize">
                          {orderDetailsData.contact_method}
                        </span>{" "}
                        &middot; {orderDetailsData.contact_handle}
                      </dd>
                    </div>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Additional info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Additional information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {orderDetailsData.additional_info ??
                    "No additional information provided."}
                </p>
              </CardContent>
            </Card>

            {/* Price proposal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Price proposal</CardTitle>
              </CardHeader>
              <CardContent className=" items-center justify-between">
                <PriceProposal id={orderDetailsData?.id} />
              </CardContent>
            </Card>
          </div>

          {/* Right: Meta + account */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Package ID</span>
                  <span className="ml-auto font-medium">
                    #{orderDetailsData.package_id}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Submitted</span>
                  <span className="ml-auto font-medium text-right">
                    {formatDate(orderDetailsData.created_at)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last updated</span>
                  <span className="ml-auto font-medium text-right">
                    {formatDate(orderDetailsData.updated_at)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">User ID</span>
                  <span className="ml-auto font-medium">
                    #{orderDetailsData.user?.id}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Role</span>
                  <Badge variant="outline" className="ml-auto capitalize">
                    {orderDetailsData.user?.role}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Verified</span>
                  <span className="ml-auto font-medium">
                    {orderDetailsData.user?.email_verified_at ? "Yes" : "No"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
