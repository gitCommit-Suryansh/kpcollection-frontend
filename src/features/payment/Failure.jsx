import React from 'react';
import { Link, useLocation} from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';


const Failure = () => {
    const location = useLocation();
    const orderId = location.state?.orderId;


    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col items-center space-y-6">
                    {/* Success Icon */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-green-100 rounded-full animate-pulse"></div>
                        <CheckCircle className="h-16 w-16 text-green-500 relative" />
                    </div>

                    {/* Success Message */}
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold text-red-500">
                            There is Some Problem with you Payment!
                        </h1>
                        <p className="text-gray-600">
                            Please refer to the orders page.
                        </p>
                    </div>

                    {/* Order Details */}
                    {orderId && (
                        <div className="bg-gray-50 w-full p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Order ID:</span>
                                <span className="font-mono font-medium text-gray-900">
                                    {orderId}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <Link 
                            to="/myaccount/myorders"
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-200"
                        >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            View Order
                        </Link>
                        <Link 
                            to="/shop"
                            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Failure;