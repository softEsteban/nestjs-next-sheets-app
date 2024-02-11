import React from "react";
// import '../app/globals.css'
import AppLayout from "@/components/layouts/AppLayout";

export default function Workers() {

    let storedData;
    let user: any;

    try {
        storedData = localStorage.getItem('userSession');
    } catch (error) {
        console.error('Error accessing localStorage:', error);
    }
    let userData = undefined;
    if (typeof storedData !== 'undefined' && storedData !== null) {
        try {
            userData = JSON.parse(storedData);
            user = userData?.user || null;
        } catch (error) {
            console.error('Error parsing JSON from localStorage:', error);
        }
    }

    return (
        <>
            <AppLayout>
                <title>Workers Management</title>
                <main className="min-h-screen p-4 sm:p-8 bg-gray-100 rounded-xl">
                    <section className="mt-8">
                        <section className="flex items-center justify-between mt-8 mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Welcome</h2>
                        </section>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* {ordersData.map((order) => (
                                <div key={order._id} className="bg-white p-6 rounded-md shadow-md">
                                    <h3 className="text-xl font-semibold mb-4">Orden #{order._id}</h3>
                                    <p>
                                        <strong>Total:</strong> ${order.total}
                                    </p>
                                    <p>
                                        <strong>Estado de pago:</strong> {order.paymentStatus}
                                    </p>
                                    <p>
                                        <strong>Estado de la orden:</strong> {order.orderStatus}
                                    </p>
                                    <ul className="mt-4">
                                        {order.products.map((product: any) => (
                                            <li key={product._id}>
                                                {product.name} - Cantidad: {product.quantity} - Precio: ${product.price}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))} */}
                        </div>
                    </section>
                </main>
                
            </AppLayout>

        </>
    );
}