"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import { ChevronLeft, CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";
import { loadTossPayments, TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";

export default function CheckoutPage() {
  const { cartItems, showDarkMode } = useApp();
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paymentMethodsRef = useRef<HTMLDivElement>(null);
  const agreementRef = useRef<HTMLDivElement>(null);

  // Calculate totals
  const subtotal = cartItems.reduce((acc: number, item: any) => {
    const price = parseFloat(item.price);
    return isNaN(price) ? acc : acc + price;
  }, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  // Convert USD to KRW (approximate rate for demo)
  const exchangeRate = 1300;
  const totalKRW = Math.round(total * exchangeRate);

  useEffect(() => {
    async function initTossPayments() {
      if (!clientKey) {
        setError("결제 설정 오류: 클라이언트 키가 없습니다.");
        setIsLoading(false);
        return;
      }

      if (cartItems.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const tossPayments = await loadTossPayments(clientKey);
        
        // Generate unique customer key
        const customerKey = `customer_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        
        const widgetsInstance = tossPayments.widgets({
          customerKey,
        });

        // Set payment amount
        await widgetsInstance.setAmount({
          currency: "KRW",
          value: totalKRW,
        });

        // Render payment methods widget
        if (paymentMethodsRef.current) {
          await widgetsInstance.renderPaymentMethods({
            selector: "#payment-methods",
            variantKey: "DEFAULT",
          });
        }

        // Render agreement widget
        if (agreementRef.current) {
          await widgetsInstance.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
          });
        }

        setWidgets(widgetsInstance);
        setIsLoading(false);
      } catch (err) {
        console.error("Toss Payments initialization error:", err);
        setError("결제 위젯을 불러오는데 실패했습니다.");
        setIsLoading(false);
      }
    }

    initTossPayments();
  }, [totalKRW, cartItems.length]);

  const handlePayment = async () => {
    if (!widgets) {
      setError("결제 위젯이 준비되지 않았습니다.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Generate unique order ID
      const orderId = `VOX_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      // Create order name from cart items
      const orderName = cartItems.length === 1 
        ? cartItems[0].name 
        : `${cartItems[0].name} 외 ${cartItems.length - 1}건`;

      await widgets.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err: any) {
      console.error("Payment request error:", err);
      if (err.code === "USER_CANCEL") {
        setError("결제가 취소되었습니다.");
      } else {
        setError(err.message || "결제 요청 중 오류가 발생했습니다.");
      }
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div
        className={`pt-24 px-6 pb-20 min-h-screen ${
          showDarkMode ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <div className="max-w-2xl mx-auto text-center py-20">
          <CreditCard className="w-16 h-16 mx-auto mb-6 text-gray-300" />
          <h1 className="text-3xl font-serif mb-4">장바구니가 비어있습니다</h1>
          <p className="text-gray-500 mb-8">
            결제를 진행하려면 먼저 상품을 장바구니에 담아주세요.
          </p>
          <Link
            href="/beauty"
            className="inline-flex items-center gap-2 px-8 py-4 bg-vox-red text-white rounded-full hover:opacity-90 transition-opacity"
          >
            쇼핑 계속하기
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-vox-red transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            장바구니로 돌아가기
          </Link>
          <h1 className="text-5xl font-serif">결제하기</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Payment Widget Section */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-vox-red" />
                <span className="ml-3">결제 위젯 로딩 중...</span>
              </div>
            ) : (
              <>
                {/* Payment Methods */}
                <div className="mb-8">
                  <h2 className="text-xl font-serif mb-4">결제 수단</h2>
                  <div
                    id="payment-methods"
                    ref={paymentMethodsRef}
                    className={`rounded-xl overflow-hidden ${
                      showDarkMode ? "bg-gray-900" : "bg-gray-50"
                    }`}
                  />
                </div>

                {/* Agreement */}
                <div className="mb-8">
                  <div
                    id="agreement"
                    ref={agreementRef}
                    className={`rounded-xl overflow-hidden ${
                      showDarkMode ? "bg-gray-900" : "bg-gray-50"
                    }`}
                  />
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                    {error}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div
              className={`p-8 rounded-2xl sticky top-32 ${
                showDarkMode
                  ? "bg-gray-900 border border-gray-800"
                  : "bg-gray-50"
              }`}
            >
              <h2 className="text-2xl font-serif mb-6">주문 요약</h2>
              
              {/* Cart Items Preview */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {cartItems.map((item: any, index: number) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex gap-3 items-center"
                  >
                    <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image_link}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.brand}</p>
                    </div>
                    <p className="text-sm font-medium">
                      {item.price_sign}
                      {item.price}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className={`border-t ${
                  showDarkMode ? "border-gray-700" : "border-gray-200"
                } pt-4 space-y-3`}
              >
                <div className="flex justify-between text-gray-600">
                  <span>소계 (USD)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>배송비</span>
                  <span>무료</span>
                </div>
                <div
                  className={`pt-3 border-t ${
                    showDarkMode ? "border-gray-700" : "border-gray-200"
                  } flex justify-between text-lg font-bold`}
                >
                  <span>총 결제금액 (KRW)</span>
                  <span>₩{totalKRW.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500">
                  * 환율 적용: $1 = ₩{exchangeRate.toLocaleString()}
                </p>
              </div>

              <button
                onClick={handlePayment}
                disabled={isLoading || isProcessing || !widgets}
                className="w-full mt-6 py-4 bg-vox-red text-white rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    결제 처리 중...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    ₩{totalKRW.toLocaleString()} 결제하기
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest mt-4">
                토스페이먼츠로 안전하게 결제됩니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
