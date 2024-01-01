import { useState, useEffect } from "react";
import styles from "./orders.module.css";
import { useAppContext } from "../../context/Context";
import currencyFormatter from 'currency-formatter';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "axios";

const Orders = () => {
  const { isLoading, getOrders, user, userOrder } = useAppContext();
  const [productsData, setProductsData] = useState([]);
  const [productsDetails, setProductsDetails] = useState([]);
  const imgUrl = import.meta.env.VITE_APP_UPLOAD_URL



  useEffect(() => {
    getOrders(user?.id);
  }, []);

  useEffect(() => {
    const extractedProductData = userOrder.map(order => order.attributes.products_data).flat();
    setProductsData(extractedProductData);
  }, [userOrder]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productIds = productsData.map(product => product.product_id);
        const requests = productIds.map(productId =>
          axios.get(`http://localhost:1337/api/products/${productId}?populate=*`)
        );
        const responses = await Promise.all(requests);
        const updatedProductDetails = responses.map(response => response.data);
        setProductsDetails(updatedProductDetails);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    if (productsData.length > 0) {
      fetchProductDetails();
    }
  }, [productsData]);


  const userOrderMap = {};
  userOrder.forEach(order => {
    order.attributes.products_data.forEach(product => {
      if (!userOrderMap[product.product_id]) {
        userOrderMap[product.product_id] = [];
      }
      userOrderMap[product.product_id].push(order);
    });
  });
  

  const productsWithOrderInfo = productsDetails.map(product => {
    const orderInfo = userOrderMap[product.data.id];
    return {
      ...product,
      orderInfo 
    };
  });



  if (isLoading) {
    return <h1>Loading.....!</h1>;
  }



  return (
    <div className={styles.container}>
      <h1 className={`flex items-center gap-3  font-medium text-2xl ${styles.heading}`}>
        Your Orders ({productsDetails.length})
      </h1>
      <div className={styles.mtable}>
        <section>
          <div className="mx-auto max-w-screen-xl py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="mt-8 space-y-4">
                {productsWithOrderInfo.map((product, idx) => (
                  <div
                    key={idx}
                    className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8"
                  >
                    <span
                      className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"
                    ></span>

                    <div className="sm:flex sm:justify-between sm:gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                          {product.data.attributes.title}
                        </h3>
                      </div>
                      <div className="hidden sm:block sm:shrink-0">
                        <img
                          src={imgUrl + product?.data?.attributes?.img?.data[0]?.attributes?.formats?.small?.url}
                          className="h-16 w-16 rounded-lg object-cover shadow-sm"
                          alt={product?.attributes?.img?.data[0].name}
                        />
                      </div>
                    </div>



                    <dl className="mt-6 flex gap-4 sm:gap-6">
                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-gray-600">Order Date</dt>
                        <dd className="text-xs text-gray-500">{product.orderInfo[0].attributes.createdAt}</dd>
                      </div>

                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-gray-600">Estimated Delivery Date</dt>
                        <dd className="text-xs text-gray-500">3 minute</dd>
                      </div>

                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-gray-600">Payment Method</dt>
                        <dd className="text-xs text-gray-500">{product.orderInfo[0].attributes.payment_method}</dd>
                      </div>

                      <div className="flex flex-col">
                        <dt className="text-sm font-medium text-gray-600">Order Status</dt>
                        <dd className="text-xs text-gray-500">{product.orderInfo[0].attributes.delivered ? "Shipped" : "In Progress"} </dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>


            </div>
          </div>
        </section>
      </div>
    </div>

  );
};

export default Orders;
