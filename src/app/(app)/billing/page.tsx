"use client";

import { useState } from "react";
import {
  CreditCard,
  TrendingUp,
  Lock,
  Building,
  Check,
  X,
  Download,
  Wallet,
  CalendarDays,
  AlertTriangle,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock invoices
const invoices = [
  {
    id: "inv-101",
    date: "Jan 12, 2025",
    amount: "$49.00",
    status: "Paid",
  },
  {
    id: "inv-100",
    date: "Dec 12, 2024",
    amount: "$49.00",
    status: "Paid",
  },
  {
    id: "inv-099",
    date: "Nov 12, 2024",
    amount: "$49.00",
    status: "Paid",
  },
];

export default function BillingPage() {
  const [autoRenew, setAutoRenew] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-[#071029] to-[#0E152E] text-white">
      {/* HEADER */}
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Billing & Subscription
      </h1>
      <p className="text-muted-foreground mt-1">
        Manage your subscription, invoices, and payment methods.
      </p>

      <div className="mt-8 grid grid-cols-1 xl:grid-cols-[1fr,400px] gap-8">

        {/* LEFT SECTION */}
        <div className="space-y-8">

          {/* CURRENT PLAN */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold">Pro Plan</p>
                  <p className="text-muted-foreground text-sm">
                    Renews on Feb 12, 2025
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full text-sm bg-[#FFB400]/10 border border-[#FFB400] text-[#FFB400]">
                  Active
                </span>
              </div>

              <p className="text-3xl font-bold mt-2">$49/month</p>

              {/* Auto Renew */}
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm">Auto-Renew Subscription</span>
                <button
                  onClick={() => setAutoRenew(!autoRenew)}
                  className={cn(
                    "px-4 py-1 rounded-full border text-sm transition",
                    autoRenew
                      ? "border-[#FFB400] bg-[#FFB4000A]"
                      : "border-white/10"
                  )}
                >
                  {autoRenew ? "On" : "Off"}
                </button>
              </div>

              <Button className="w-full mt-4">Upgrade Plan</Button>

              <Button variant="outline" className="w-full text-red-400 mt-2">
                Cancel Subscription
              </Button>
            </CardContent>
          </Card>

          {/* USAGE SUMMARY */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Usage Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/10">
                <div>
                  <p className="font-semibold">AI Credits</p>
                  <p className="text-sm text-muted-foreground">350 / 500 used</p>
                </div>
                <TrendingUp className="h-5 w-5 text-[#FFB400]" />
              </div>

              <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/10">
                <div>
                  <p className="font-semibold">Storage</p>
                  <p className="text-sm text-muted-foreground">12GB / 50GB</p>
                </div>
                <Lock className="h-5 w-5 text-[#FFB400]" />
              </div>

              <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/10">
                <div>
                  <p className="font-semibold">Projects</p>
                  <p className="text-sm text-muted-foreground">32 / Unlimited</p>
                </div>
                <Building className="h-5 w-5 text-[#FFB400]" />
              </div>
            </CardContent>
          </Card>

          {/* BILLING HISTORY */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {invoices.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => setSelectedInvoice(inv)}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#FFB400] transition cursor-pointer"
                  >
                    <div>
                      <p className="font-medium">{inv.id}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="h-4 w-4 opacity-60" />
                        {inv.date}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">{inv.amount}</p>
                      <p className="text-xs text-green-400">{inv.status}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SECTION — PAYMENT METHODS */}
        <div className="space-y-8">

          {/* PAYMENT METHODS */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              {/* Saved Card */}
              <div className="p-4 bg-black/20 rounded-xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-[#FFB400]" />
                  <div>
                    <p className="font-semibold">Visa ending in 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 04/27</p>
                  </div>
                </div>

                <span className="text-xs text-[#FFB400]">Default</span>
              </div>

              {/* Add New Card */}
              <Button variant="outline" className="w-full flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>

          {/* HELP SECTION */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button className="w-full flex items-center gap-2">
                <Wallet className="h-4 w-4" /> Billing Support
              </Button>

              <Button variant="outline" className="w-full flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" /> Payment Problem
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* -------------------------- INVOICE DRAWER -------------------------- */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-full max-w-xl bg-[#0E152E] border-l border-white/10 h-full p-6 overflow-auto">

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Invoice Details</h2>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-2 rounded hover:bg-white/10"
              >
                <X />
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <p><strong>Invoice ID:</strong> {selectedInvoice.id}</p>
              <p><strong>Date:</strong> {selectedInvoice.date}</p>
              <p><strong>Amount:</strong> {selectedInvoice.amount}</p>
              <p><strong>Status:</strong> {selectedInvoice.status}</p>
            </div>

            <Button className="w-full flex items-center gap-2 mt-8">
              <Download className="h-4 w-4" /> Download Invoice
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
