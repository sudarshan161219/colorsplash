import axios from "axios"
import styles from "./checkout.module.css"
import { useState, useEffect } from "react";
import currencyFormatter from 'currency-formatter';
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Radio,
  Select,
  Space,
} from 'antd';
import { data } from "../../data/data"
import { useAppContext } from "../../context/Context"
import { useDispatch } from "react-redux";
import { resetCart } from "../../redux/cartReducer"
import logo from "../../assets/colorlogo.webp"

const Checkout = () => {
  const products = useSelector(state => state.cart.products)
  const { user, getAddresses, userAddress, addAddress } = useAppContext()
  const [selectedState, setSelectedState] = useState('')
  const [value, setValue] = useState(1);
  const [value1, setValue1] = useState(null);
  const imgUrl = import.meta.env.VITE_APP_UPLOAD_URL
  const [saveCount, setSaveCount] = useState(0);
  const [address, setAddress] = useState([])
  const navigate = useNavigate();
  const dispatch = useDispatch()


  useEffect(() => {
    getAddresses(user?.id)
  }, [user?.id, saveCount]);

  let user_id
  let user_name
  let user_email
  let user_phone

  if (user) {
    const { id, username, email, phoneNumber } = user

    user_id = id
    user_email = email
    user_name = username
    user_phone = phoneNumber
  }



  const totalPrice = products.reduce((accumulator, currentItem) => {
    const itemTotal = currentItem.price * currentItem.quantity;
    return accumulator + itemTotal;
  }, 0);


  const totalShippingPrice = products.reduce((accumulator, item) => {
    return accumulator + (item.shipping === 0 ? 0 : item.shipping);
  }, 0);



  const totalPriceInr = currencyFormatter.format(totalPrice, { code: 'INR' });
  const totalShippingPriceInr = currencyFormatter.format(totalShippingPrice, { code: 'INR' });
  const grandTotal = totalPrice + totalShippingPrice
  const grandTotalInr = currencyFormatter.format(grandTotal, { code: 'INR' });



  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    data.State = selectedState

    const {
      firstname, lastname, Street_Address, Town_City, State, Country_Region, Phone, Postal_Code } = data
    const town_city_postal_code = Town_City + "-" + Postal_Code
    const customer_address = firstname + " " + lastname + ", " + Street_Address + ", " + town_city_postal_code + ", " + State + ", " + Country_Region + " , " + Phone
    const useridnum = user.id
    const customer_email = user?.email

    if (!firstname || !lastname || !Street_Address || !Town_City || !State || !Country_Region || !Phone || !Postal_Code) {
      toast.error("please fill all fields!");
      return
    }

    let payload = {
      "data": {
        "customer_Id": useridnum,
        "firstname": firstname,
        "lastname": lastname,
        "customer_name": firstname + " " + lastname,
        "Street_Address": Street_Address,
        "Town_City": Town_City,
        "State": State,
        "Country_Region": Country_Region,
        "Phone": Phone,
        "Postal_Code": Postal_Code,
        "customer_email": customer_email,
        "customer_address": customer_address
      }
    };

    addAddress(payload)
    setSaveCount((prevCount) => prevCount + 1);


  }


  const handleStateChange = (value) => {
    setSelectedState(value)
  };

  const onChange = (e) => {
    setValue(e.target.value);
  };


  const onChangeAddress = (e) => {
    setValue1(e.target.value);
    const filteredAddress = userAddress.filter((number) => number.id === e.target.value);
    setAddress(filteredAddress)
  }

  const user_Address = address.map(item => item.attributes.customer_address)

  const handlePlaceOrder = async () => {
    if (value1 === null) {
      toast.error("Please choose an address or add a new address.");
      return;
    }

    const productData = products.map((item) => {
      const { id, name, color, size, price, quantity } = item;
      return {
        "product_id": id,
        "product_name": name,
        "size": size,
        "quantity": quantity,
        "price": price,
        "color": color,
      };
    });

    const orderInfo = {
      "data": {
        "payment_method": 'COD',
        "user_address": user_Address[0],
        "delivered": false,
        "order_canceled": false,
        "user_Id": user?.id,
        "user_email": user?.email,
        "user_name": user?.username,
        "user_phone": user?.phoneNumber,
        "products_data": productData,
      }
    };

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post('http://localhost:1337/api/users-orders', orderInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        toast.success(`Your order has been placed successfully!`);
        dispatch(resetCart({}));
        navigate("/success-page");
      } else {
        toast.error("Failed to place the order. Please try again.");
      }
    } catch (error) {
      console.error('Error placing order:', error.message || error);
      toast.error("Something went wrong, please try again later.");
    }
  };




  const handlePayment = async (price) => {
    if (value1 === null) {
      toast.error("Please choose an address or add a new address.");
      return;
    }
    const token = localStorage.getItem('token');

    const productData = products.map((item) => {
      const { id, name, color, size, price, quantity } = item;
      return {
        "product_id": id,
        "product_name": name,
        "size": size,
        "quantity": quantity,
        "price": price,
        "color": color,
      };
    });

    const orderOnlineInfo = {
      "data": {
        "payment_method": 'online paid',
        "user_address": user_Address[0],
        "delivered": false,
        "order_canceled": false,
        "user_Id": user?.id,
        "user_email": user?.email,
        "user_name": user?.username,
        "user_phone": user?.phoneNumber,
        "products_data": productData,
      }
    };

    const serializedData = encodeURIComponent(JSON.stringify(orderOnlineInfo));

    try {
      const { data: { key } } = await axios.get("http://localhost:1337/api/user_orders/get_key", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      }
      );
      const { data: { order } } = await axios.post('http://localhost:1337/api/user_orders/checkout', {
        price
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const options = {
        key: key,
        amount: order.amount,
        currency: "INR",
        name: "colorSplash",
        description: "Test Transaction",
        image: logo,
        order_id: order.id,
        userId: user.id,
        callback_url: `http://localhost:1337/api/user_orders/verification?data=${serializedData}`,
        prefill: {
          name: user.name,
          email: user.email,
        },
        notes: {
          "address": "Razorpay Corporate Office"
        },
        theme: {
          color: "#121212"
        }
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-3">
      <h1 className={`flex items-center gap-3  font-medium ${styles.heading}`}>Check Out</h1>
      <strong className="font-medium text-lg mt-4 mb-4">Billing Details</strong>


      <div className="items-baseline  grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8  mt-4 mb-4">
        <form onSubmit={handleSubmit} className=" flex flex-col gap-4 lg:col-span-2 ">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
            <div className="grid gap-3">
              <label htmlFor="First_Name" className={styles.label}>
                First Name
              </label>

              <input
                type="text"
                id="First_Name"
                name="firstname"
                placeholder="First Name"
                className={styles.input}
                required
              />
            </div>

            <div className="grid gap-3">
              <label htmlFor="Last_Name" className={styles.label}>
                Last Name
              </label>

              <input
                type="text"
                id="Last_Name"
                name="lastname"
                placeholder="Last Name"
                className={styles.input}
                required
              />
            </div>
          </div>


          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
            <div className="grid gap-3">
              <label htmlFor="CountryRegion" className={styles.label}>
                Country / Region
              </label>

              <input
                type="text"
                id="CountryRegion"
                name="Country_Region"
                placeholder="Country / Region"
                className={styles.input}
                required
              />
            </div>
            <div className="grid gap-3">
              <label htmlFor="State" className={styles.label}>
                State
              </label>
              <Select onChange={handleStateChange} placeholder='State' >
                {data.map((item, idx) => (
                  <Select.Option key={idx} value={item.value}>{item.name}</Select.Option>
                ))}
              </Select>
            </div>
          </div>


          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
            <div className="grid gap-3">
              <label htmlFor="StreetAddress" className={styles.label}>
                Street Address
              </label>

              <input
                type="text"
                id="StreetAddress"
                name="Street_Address"
                placeholder="House number and street name"
                className={styles.input}
                required
              />
            </div>

            <div className="grid gap-3">
              <label htmlFor="City" className={styles.label}>
                City
              </label>

              <input
                type="text"
                id="City"
                name="Town_City"
                placeholder="Town / City"
                className={styles.input}
                required
              />
            </div>
          </div>




          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
            <div className="grid gap-3">
              <label htmlFor="PhoneNumber" className={styles.label}>
                Phone
              </label>

              <input
                type="number"
                id="PhoneNumber"
                name="Phone"
                placeholder="Phone"
                maxLength="10"
                className={styles.input}
                required
              />
            </div>

            <div className="grid gap-3">
              <label htmlFor="PostalCode" className={styles.label}>
                Postal Code
              </label>

              <input
                type="number"
                id="PostalCode"
                name="Postal_Code"
                placeholder="Postal Code"
                maxLength="6"
                className={styles.input}
                required
              />
            </div>
          </div>

          <button className="mt-3 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white rounded-xl" >Add New Address</button>

        </form>

        <div className="rounded-lg bg-gray-200 p-2">
          <div className={styles.headingContainer} >
            <h2 className="text-lg font-medium" >Order Summary</h2>
          </div>
          <div
            className="relative w-screen max-w-sm border mt-0 mb-0 mr-auto ml-auto"
            aria-modal="true"
            role="dialog"
            tabIndex="-1"
          >
            <div className='mt-4 space-y-6'>
              <ul style={{ height: products.length >= 4 && '410px', overflowY: products.length >= 4 && 'scroll' }} className={` ${styles.orderSummary} space-y-4`}>

                {products.map((item) => {
                  const { id, img, name, color, size, shipping, price, quantity } = item
                  const priceInr = currencyFormatter.format(price, { code: 'INR' });
                  const shippingInr = currencyFormatter.format(shipping, { code: 'INR' });
                  const price_quantity = price * quantity
                  const subTotal = price_quantity + shipping

                  return (
                    <li key={id} className="flex items-center gap-3">
                      <div className="h-20 w-25 rounded relative" >
                        <img
                          src={imgUrl + img} alt={name}
                          className="h-full w-full rounded object-cover"
                        />
                        <span className={styles.badge} >{quantity}</span>
                      </div>

                      <div className="w-full">
                        <h3 className="text-lg text-gray-900">{name}</h3>

                        <dl className="mt-0.5 flex items-center justify-between space-y-px text-[10px] text-gray-600">
                          <div>
                            <div>
                              <dt className="inline text-black text-sm">Size: </dt>
                              <dd className="inline text-sm">XXS</dd>
                            </div>

                            <div>
                              <dt className="inline text-black text-sm">Color: </dt>
                              <dd className="inline text-sm">White</dd>
                            </div>
                          </div>

                          <div>
                            <dt className="inline text-black text-sm">{priceInr} </dt>
                          </div>
                        </dl>
                      </div>
                    </li>
                  )
                })}
              </ul>
              <div className="space-y-4 text-center">
                <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                  <div className="w-screen max-w-lg space-y-4">
                    <dl className="space-y-0.5 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <dt>Subtotal ({products.length} items )</dt>
                        <dd>{totalPriceInr}</dd>
                      </div>

                      <div className="flex justify-between">
                        <dt>Shipping</dt>
                        <dd>{totalShippingPriceInr}</dd>
                      </div>


                      <div className="flex justify-between !text-base font-medium">
                        <dt>Total</dt>
                        <dd>{grandTotalInr}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {
        userAddress.length > 0 &&
        <div className={styles.paymentContainer}>
          <div className="grid gap-2 mt-4 mb-3">
            <h2 className="font-medium text-lg  text-black">Shipping Address</h2>
            <p className="text-base font-medium text-gray-800">Select the address.</p>
          </div>
          <div className=" p-3 rounded-lg bg-gray-200">

            <Radio.Group onChange={onChangeAddress} value={value1}>
              <Space className="grid gap-4" direction="vertical">
                {userAddress.map((item, idx) => (
                  <Radio key={item?.id} className="flex " value={item?.id}>
                    <h3 className="font-medium text-lg  text-black">{item.attributes.customer_name}</h3>
                    <p className="text-gray-800" >{item.attributes.customer_address}</p>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>

          </div>

        </div>}


      <div className={styles.paymentContainer}>
        <div className="grid gap-2 mt-4 mb-3">
          <h2 className="font-medium text-lg  text-black">Payment Method</h2>
          <p className="text-base font-medium text-gray-800">All transactions are secure and encrypted.</p>
        </div>
        <div className=" p-3 rounded-lg bg-gray-200">

          <Radio.Group onChange={onChange} value={value}>
            <Space className="grid gap-4" direction="vertical">
              <Radio value={1}>
                <h3 className="font-medium text-lg  text-black">Razor Pay</h3>
                <p className="text-gray-800" >Make payments via UPI, card, net banking, and more</p>
              </Radio>
              <Radio value={2}>
                <h3 className="font-medium text-lg  text-black">Cash on delivery</h3>
                <p className="text-gray-800">Pay with cash upon delivery.</p>
              </Radio>
            </Space>
          </Radio.Group>
        </div>


        <div className="flex justify-end" >

          {
            value === 1 ?
              <button onClick={() => handlePayment(grandTotal)} className="mt-3 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white rounded-xl" >Pay Now</button>
              :
              <button onClick={handlePlaceOrder} className="mt-3 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white rounded-xl" >Place Order</button>
          }

        </div>

      </div>

    </div >
  )
}

export default Checkout