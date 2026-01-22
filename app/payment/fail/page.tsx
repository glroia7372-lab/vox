"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { XCircle, ArrowLeft, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const { showDarkMode } = useApp();

  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");
  const orderId = searchParams.get("orderId");

  // Map common error codes to user-friendly messages
  const getErrorDescription = (code: string | null) => {
    switch (code) {
      case "PAY_PROCESS_CANCELED":
        return "결제가 취소되었습니다.";
      case "PAY_PROCESS_ABORTED":
        return "결제 처리 중 오류가 발생했습니다.";
      case "REJECT_CARD_COMPANY":
        return "카드사에서 결제를 거절했습니다.";
      case "INVALID_CARD_EXPIRATION":
        return "카드 유효기간이 만료되었습니다.";
      case "INVALID_STOPPED_CARD":
        return "정지된 카드입니다.";
      case "EXCEED_MAX_DAILY_PAYMENT_COUNT":
        return "일일 결제 한도를 초과했습니다.";
      case "EXCEED_MAX_PAYMENT_AMOUNT":
        return "결제 금액 한도를 초과했습니다.";
      case "INVALID_CARD_NUMBER":
        return "유효하지 않은 카드 번호입니다.";
      default:
        return errorMessage || "결제 처리 중 문제가 발생했습니다.";
    }
  };

  return (
    <div
      className={`pt-24 px-6 pb-20 min-h-screen ${
        showDarkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-2xl mx-auto">
        {/* Fail Header */}
        <div className="text-center py-12">
          <XCircle className="w-20 h-20 mx-auto mb-6 text-red-500" />
          <h1 className="text-4xl font-serif mb-4">결제에 실패했습니다</h1>
          <p className="text-gray-500">{getErrorDescription(errorCode)}</p>
        </div>

        {/* Error Details */}
        <div
          className={`p-8 rounded-2xl mb-8 ${
            showDarkMode ? "bg-gray-900 border border-gray-800" : "bg-gray-50"
          }`}
        >
          <h2 className="text-xl font-serif mb-6">오류 정보</h2>
          <div className="space-y-4">
            {orderId && (
              <div className="flex justify-between">
                <span className="text-gray-500">주문번호</span>
                <span className="font-mono text-sm">{orderId}</span>
              </div>
            )}
            {errorCode && (
              <div className="flex justify-between">
                <span className="text-gray-500">오류 코드</span>
                <span className="font-mono text-sm">{errorCode}</span>
              </div>
            )}
            {errorMessage && (
              <div className="flex flex-col gap-2">
                <span className="text-gray-500">상세 메시지</span>
                <span className="text-sm">{decodeURIComponent(errorMessage)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div
          className={`p-8 rounded-2xl mb-8 ${
            showDarkMode ? "bg-gray-900 border border-gray-800" : "bg-gray-50"
          }`}
        >
          <h2 className="text-xl font-serif mb-4">도움이 필요하신가요?</h2>
          <ul className="space-y-3 text-gray-500">
            <li>• 카드 정보가 올바른지 확인해주세요.</li>
            <li>• 결제 한도를 확인해주세요.</li>
            <li>• 다른 결제 수단을 시도해보세요.</li>
            <li>• 문제가 지속되면 카드사에 문의해주세요.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/checkout"
            className="flex-1 py-4 px-8 bg-vox-red text-white rounded-full font-bold hover:opacity-90 transition-opacity text-center flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            다시 결제하기
          </Link>
          <Link
            href="/cart"
            className={`flex-1 py-4 px-8 rounded-full font-bold transition-colors text-center flex items-center justify-center gap-2 ${
              showDarkMode
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-gray-100 text-black hover:bg-gray-200"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            장바구니로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
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
      <PaymentFailContent />
    </Suspense>
  );
}
