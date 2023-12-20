import { useState, useEffect } from "react";
import styles from "./orders.module.css"
import { useAppContext } from "../../context/Context"
import currencyFormatter from 'currency-formatter';
import { AiOutlineShoppingCart } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux";


async function fetchProductDetails(productId) {
  try {
    const response = await fetch(`http://localhost:1337/api/products/${productId}?populate=*`);
    const productData = await response.json();
    return productData.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
}



const Orders = () => {
  const { isLoading, getOrders, user, userOrder } = useAppContext()
  const [orderWithImages, setOrderWithImages] = useState([]);
  const [productArr, setProductArr] = useState()
  const imgUrl = import.meta.env.VITE_APP_UPLOAD_URL


  const mergedArray = userOrder.flatMap(item => item.attributes.products_data || []);


  const isDeliverd = userOrder.map(item => item.attributes.delivered)
  const paymentMethod = userOrder.map(item => item.attributes.payment_method)


  useEffect(() => {
    async function fetchProductImages() {
      const updatedOrder = await Promise.all(
        mergedArray.map(async (item) => {
          const productDetails = await fetchProductDetails(item.product_id);
          return {
            ...item,
            images: productDetails && productDetails.attributes.img.data,
            productId: productDetails && productDetails.id,
            delivery: isDeliverd,
            payment: paymentMethod,
            productCreatedAt: productDetails && productDetails.attributes.createdAt
          };
        })
      );

      const mergedOrder = mergedArray.map((item, index) => ({
        ...item,
        ...updatedOrder[index],
        images: updatedOrder[index]?.images || item.images
      }));

      setOrderWithImages(mergedOrder);
    }

    fetchProductImages();
  }, []);


  useEffect(() => {
    getOrders(user?.id)
  }, [])


  if (isLoading) {
    return <h1>Loading.....!</h1>
  }

  return (
    <div className={styles.container}>
      <h1 className={`flex items-center gap-3  font-medium text-2xl ${styles.heading}`}>Your  Orders ({mergedArray.length}) </h1>
      <div className={styles.mtable}>
        <section>
          <div className="mx-auto max-w-screen-xl  py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="mt-8">
                <ul className="space-y-4">
                  {orderWithImages.map((item) => {
                    const img = item.images[0]
                    const isoDate = item.productCreatedAt;
                    const date = new Date(isoDate);
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();

                    const formattedDate = `${day}/${month}/${year}`;
                    const orderstatus = item.delivery[0]


                    return (
                      <li key={item.id} className="grid gap-2 mb-2 bg-gray-200 p-2" >
                        <div className="flex items-center gap-4">
                          <img
                            src={imgUrl + img.attributes.formats.small.url}
                            alt=""
                            className="h-20 w-20 rounded object-cover"
                          />
                          <div>
                            <h3 className="text-base text-gray-900">{item.product_name}</h3>

                            <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                              <div>
                                <dt className="inline text-xs font-semibold">Size:</dt>
                                <dd className="inline text-sm font-semibold">{item.size}</dd>
                              </div>

                              <div>
                                <dt className="inline text-xs font-semibold">Color:</dt>
                                <dd className="inline text-xs font-semibold">{item.color}</dd>
                              </div>
                            </dl>
                          </div>
                        </div>

                        <div className=" grid gap-2 ">
                          <strong className="text-lg font-semibold">Order No: {item.productId}</strong>


                          <div className="flex items-center justify-between">

                            <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                              <div>
                                <dt className="inline text-sm font-semibold">Order date:</dt>
                                <dd className="inline text-sm ">&nbsp; {formattedDate}</dd>
                              </div>

                              <div>
                                <dt className="inline text-sm font-semibold">Estimated Delivery Date:</dt>
                                {/* <dd className="inline text-sm ">&nbsp; {item.attributes.color}</dd> */}
                              </div>
                            </dl>


                            <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                              <div>
                                <dt className="inline text-sm font-semibold">Order Status:</dt>
                                <dd className="inline text-sm ">&nbsp;  {!orderstatus ? "Inprogress" : "Shipped"}</dd>
                              </div>

                              <div>
                                <dt className="inline text-sm font-semibold">Payment Method:</dt>
                                <dd className="inline text-sm ">&nbsp; {item.payment[0]}</dd>
                              </div>
                            </dl>
                          </div>
                        </div>

                      </li>
                    )

                  })}
                </ul>
                <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">

                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>

  )
}

export default Orders