'use client';

import { useApp } from '@/context/AppContext';
import { ShoppingBag, Trash2, ChevronLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
    const { cartItems, removeFromCart, clearCart, showDarkMode } = useApp();

    const subtotal = cartItems.reduce((acc: number, item: any) => {
        const price = parseFloat(item.price);
        return isNaN(price) ? acc : acc + price;
    }, 0);
    const shipping = cartItems.length > 0 ? 0 : 0; // Free shipping for VOX
    const total = subtotal + shipping;

    return (
        <div className={`pt-24 px-6 pb-20 min-h-screen ${showDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <Link href="/beauty" className="flex items-center gap-2 text-sm text-gray-500 hover:text-vox-red transition-colors mb-4">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Beauty
                        </Link>
                        <h1 className="text-5xl font-serif">Your Cart ({cartItems.length})</h1>
                    </div>
                    {cartItems.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="text-sm text-gray-500 hover:text-vox-red transition-colors"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-gray-300" />
                        <h2 className="text-2xl font-serif mb-4">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8">Discover our curated selection of beauty products and start shopping.</p>
                        <Link
                            href="/beauty"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-vox-red text-white rounded-full hover:opacity-90 transition-opacity"
                        >
                            Continue Shopping
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Items List */}
                        <div className="lg:col-span-2 space-y-8">
                            {cartItems.map((item, index) => (
                                <div
                                    key={`${item.id}-${index}`}
                                    className={`flex gap-6 pb-8 border-b ${showDarkMode ? 'border-gray-800' : 'border-gray-100'} group`}
                                >
                                    <div className="w-32 h-32 bg-white rounded-xl overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.image_link}
                                            alt={item.name}
                                            className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="text-[10px] font-bold text-vox-red uppercase tracking-widest mb-1">{item.brand}</div>
                                                <h3 className="text-lg font-medium">{item.name}</h3>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-2 text-gray-400 hover:text-vox-red transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="text-xl font-bold mt-4">
                                            {item.price_sign}{item.price}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className={`p-8 rounded-2xl sticky top-32 ${showDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-gray-50'}`}>
                                <h2 className="text-2xl font-serif mb-8">Summary</h2>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className={`pt-4 border-t ${showDarkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between text-xl font-bold`}>
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-vox-red text-white rounded-full font-bold hover:opacity-90 transition-opacity mb-4">
                                    Checkout
                                </button>
                                <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest">
                                    Complimentary VOX Packaging with all orders
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
