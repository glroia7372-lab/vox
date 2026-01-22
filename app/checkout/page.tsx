"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { ChevronLeft, CreditCard, Loader2, Smartphone, Building2, Wallet } from "lucide-react";
import Link from "next/link";

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";

type PaymentMethod = "CARD" | "VIRTUAL_ACCOUNT" | "TRANSFER" | "MOBILE_PHONE";

export default function CheckoutPage() {
  const { cartItems, showDarkMode } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("CARD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tossPayments, setTossPayments] = useState<any>(null);

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
    // Load TossPayments SDK for individual API integration
    const script = document.createElement("script");
    script.src = "https://js.tosspayments.com/v1/payment";
    script.async = true;
    script.onload = () => {
      if (window.TossPayments && clientKey) {
        const tp = window.TossPayments(clientKey);
        setTossPayments(tp);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const paymentMethods = [
    { id: "CARD" as PaymentMethod, name: "카드", icon: CreditCard, description: "신용/체크카드" },
    { id: "VIRTUAL_ACCOUNT" as PaymentMethod, name: "가상계좌", icon: Building2, description: "무통장입금" },
    { id: "TRANSFER" as PaymentMethod, name: "계좌이체", icon: Wallet, description: "실시간 계좌이체" },
    { id: "MOBILE_PHONE" as PaymentMethod, name: "휴대폰", icon: Smartphone, description: "휴대폰 결제" },
  ];

  const handlePayment = async () => {
    if (!tossPayments) {
      setError("결제 모듈이 로드되지 않았습니다. 페이지를 새로고침해주세요.");
      return;
    }

    if (!clientKey) {
      setError("결제 설정 오류: 클라이언트 키가 없습니다.");
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

      // Common payment parameters
      const paymentParams: any = {
        amount: totalKRW,
        orderId,
        orderName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      };

      // Call appropriate payment method
      switch (selectedMethod) {
        case "CARD":
          await tossPayments.requestPayment("카드", paymentParams);
          break;
        case "VIRTUAL_ACCOUNT":
          await tossPayments.requestPayment("가상계좌", {
            ...paymentParams,
            validHours: 24, // 입금 유효시간 24시간
            cashReceipt: {
              type: "소득공제",
            },
          });
          break;
        case "TRANSFER":
          await tossPayments.requestPayment("계좌이체", paymentParams);
          break;
        case "MOBILE_PHONE":
          await tossPayments.requestPayment("휴대폰", paymentParams);
          break;
      }
    } catch (err: any) {
      console.error("Payment request error:", err);
      if (err.code === "USER_CANCEL") {
        setError("결제가 취소되었습니다.");
      } else if (err.code === "INVALID_CARD_COMPANY") {
        setError("유효하지 않은 카드사입니다.");
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
          {/* Payment Method Selection */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-xl font-serif mb-4">결제 수단</h2>
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        selectedMethod === method.id
                          ? "border-vox-red bg-red-50"
                          : showDarkMode
                          ? "border-gray-700 bg-gray-900 hover:border-gray-600"
                          : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 mb-3 ${
                          selectedMethod === method.id
                            ? "text-vox-red"
                            : "text-gray-400"
                        }`}
                      />
                      <p
                        className={`font-bold ${
                          selectedMethod === method.id
                            ? "text-vox-red"
                            : showDarkMode
                            ? "text-white"
                            : "text-black"
                        }`}
                      >
                        {method.name}
                      </p>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Info */}
            <div
              className={`p-6 rounded-xl ${
                showDarkMode ? "bg-gray-900" : "bg-gray-50"
              }`}
            >
              <h3 className="font-bold mb-3">결제 안내</h3>
              {selectedMethod === "CARD" && (
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• 신용카드 및 체크카드 결제가 가능합니다.</li>
                  <li>• 카드사별 무이자 할부 혜택이 적용될 수 있습니다.</li>
                  <li>• 결제 완료 후 즉시 주문이 확정됩니다.</li>
                </ul>
              )}
              {selectedMethod === "VIRTUAL_ACCOUNT" && (
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• 가상계좌 발급 후 24시간 이내에 입금해주세요.</li>
                  <li>• 입금 확인 후 주문이 확정됩니다.</li>
                  <li>• 현금영수증 발급이 가능합니다.</li>
                </ul>
              )}
              {selectedMethod === "TRANSFER" && (
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• 실시간으로 계좌에서 결제 금액이 이체됩니다.</li>
                  <li>• 결제 완료 후 즉시 주문이 확정됩니다.</li>
                  <li>• 현금영수증 발급이 가능합니다.</li>
                </ul>
              )}
              {selectedMethod === "MOBILE_PHONE" && (
                <ul className="text-sm text-gray-500 space-y-2">
                  <li>• 휴대폰 소액결제로 진행됩니다.</li>
                  <li>• 통신사 정책에 따라 결제 한도가 제한될 수 있습니다.</li>
                  <li>• 결제 금액은 휴대폰 요금에 합산 청구됩니다.</li>
                </ul>
              )}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                {error}
              </div>
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
                disabled={isProcessing || !tossPayments}
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

// Declare TossPayments on window for TypeScript
declare global {
  interface Window {
    TossPayments: (clientKey: string) => {
      requestPayment: (method: string, params: any) => Promise<void>;
    };
  }
}
