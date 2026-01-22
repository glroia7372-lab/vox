"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { CheckCircle, Loader2, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { showDarkMode, clearCart } = useApp();
  const [isConfirming, setIsConfirming] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  useEffect(() => {
    async function confirmPayment() {
      if (!paymentKey || !orderId || !amount) {
        setError("결제 정보가 올바르지 않습니다.");
        setIsConfirming(false);
        return;
      }

      try {
        const response = await fetch("/api/payment/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "결제 승인에 실패했습니다.");
        }

        setPaymentData(data.payment);
        // Clear cart after successful payment
        clearCart();
      } catch (err: any) {
        console.error("Payment confirmation error:", err);
        setError(err.message || "결제 승인 중 오류가 발생했습니다.");
      } finally {
        setIsConfirming(false);
      }
    }

    confirmPayment();
  }, [paymentKey, orderId, amount, clearCart]);

  if (isConfirming) {
    return (
      <div
        className={`pt-24 px-6 pb-20 min-h-screen ${
          showDarkMode ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <div className="max-w-2xl mx-auto text-center py-20">
          <Loader2 className="w-16 h-16 mx-auto mb-6 animate-spin text-vox-red" />
          <h1 className="text-3xl font-serif mb-4">결제 승인 중...</h1>
          <p className="text-gray-500">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`pt-24 px-6 pb-20 min-h-screen ${
          showDarkMode ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-3xl font-serif mb-4">결제 승인 실패</h1>
          <p className="text-gray-500 mb-8">{error}</p>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 px-8 py-4 bg-vox-red text-white rounded-full hover:opacity-90 transition-opacity"
          >
            장바구니로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`pt-24 px-6 pb-20 min-h-screen ${
        showDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center py-12">
          <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-500" />
          <h1 className="text-4xl font-serif mb-4">결제가 완료되었습니다!</h1>
          <p className="text-gray-500">
            주문해 주셔서 감사합니다. 주문 확인 이메일이 발송됩니다.
          </p>
        </div>

        {/* Order Details */}
        <div
          className={`p-8 rounded-2xl mb-8 ${
            showDarkMode ? "bg-gray-900 border border-gray-800" : "bg-gray-50"
          }`}
        >
          <h2 className="text-2xl font-serif mb-6">주문 정보</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">주문번호</span>
              <span className="font-mono">{orderId}</span>
            </div>
            {paymentData && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">결제 수단</span>
                  <span>{paymentData.method || "카드"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">결제 금액</span>
                  <span className="font-bold">
                    ₩{Number(amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">결제 일시</span>
                  <span>
                    {new Date(paymentData.approvedAt).toLocaleString("ko-KR")}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Shipping Info */}
        <div
          className={`p-8 rounded-2xl mb-8 ${
            showDarkMode ? "bg-gray-900 border border-gray-800" : "bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <Package className="w-6 h-6 text-vox-red" />
            <h2 className="text-xl font-serif">배송 안내</h2>
          </div>
          <p className="text-gray-500">
            주문하신 상품은 영업일 기준 2-3일 내에 발송됩니다.
            <br />
            배송 시작 시 알림을 보내드립니다.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/beauty"
            className="flex-1 py-4 px-8 bg-vox-red text-white rounded-full font-bold hover:opacity-90 transition-opacity text-center flex items-center justify-center gap-2"
          >
            쇼핑 계속하기
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className={`flex-1 py-4 px-8 rounded-full font-bold transition-colors text-center ${
              showDarkMode
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-gray-100 text-black hover:bg-gray-200"
            }`}
          >
            홈으로 가기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-24 px-6 pb-20 min-h-screen bg-white">
          <div className="max-w-2xl mx-auto text-center py-20">
            <Loader2 className="w-16 h-16 mx-auto mb-6 animate-spin text-vox-red" />
            <h1 className="text-3xl font-serif mb-4">로딩 중...</h1>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
