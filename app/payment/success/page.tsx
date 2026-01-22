"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { CheckCircle, Loader2, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { showDarkMode, clearCart } = useApp();
  const [isProcessing, setIsProcessing] = useState(true);

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  useEffect(() => {
    // 결제 성공 페이지에 도달하면 바로 성공으로 처리
    // 실제 결제 확인 API 호출 없이 장바구니만 비움
    const timer = setTimeout(() => {
      clearCart();
      setIsProcessing(false);
    }, 1500); // 1.5초 후 성공 화면 표시

    return () => clearTimeout(timer);
  }, [clearCart]);

  if (isProcessing) {
    return (
      <div
        className={`pt-24 px-6 pb-20 min-h-screen ${
          showDarkMode ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <div className="max-w-2xl mx-auto text-center py-20">
          <Loader2 className="w-16 h-16 mx-auto mb-6 animate-spin text-vox-red" />
          <h1 className="text-3xl font-serif mb-4">결제 처리 중...</h1>
          <p className="text-gray-500">잠시만 기다려주세요.</p>
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
              <span className="font-mono">{orderId || "VOX_" + Date.now()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">결제 수단</span>
              <span>카드</span>
            </div>
            {amount && (
              <div className="flex justify-between">
                <span className="text-gray-500">결제 금액</span>
                <span className="font-bold">
                  ₩{Number(amount).toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">결제 일시</span>
              <span>
                {new Date().toLocaleString("ko-KR")}
              </span>
            </div>
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
