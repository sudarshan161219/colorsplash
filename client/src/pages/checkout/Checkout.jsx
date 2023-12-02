import styles from "./checkout.module.css"
import { useState } from "react";
import currencyFormatter from 'currency-formatter';
import { useSelector } from "react-redux"

import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  TreeSelect,
  Flex
} from 'antd';
import { data } from "../../data/data"

const Checkout = () => {
  const products = useSelector(state => state.cart.products)
  const [componentSize, setComponentSize] = useState('default');
  const imgUrl = import.meta.env.VITE_APP_UPLOAD_URL

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

  return (
    <div className="p-3">
      <h1 className={`flex items-center gap-3  font-medium ${styles.heading}`}>Check Out</h1>
      <strong className="font-medium text-lg mt-4 mb-4">Billing Details</strong>


      <div className={` grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8  mt-4 mb-4`}>
        <form className=" flex flex-col gap-4 lg:col-span-2 ">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
            <div className="grid gap-3">
              <label htmlFor="FirstName" className={styles.label}>
                First Name
              </label>

              <input
                type="text"
                id="FirstName"
                placeholder="First Name"
                className={styles.input}
                required
              />
            </div>

            <div className="grid gap-3">
              <label htmlFor="LastName" className={styles.label}>
                Last Name
              </label>

              <input
                type="text"
                id="LastName"
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
                placeholder="Country / Region"
                className={styles.input}
                required
              />
            </div>

            <div className="grid gap-3">
              <label htmlFor="CompanyName" className={styles.label}>
                Company Name
              </label>

              <input
                type="text"
                id="CompanyName"
                placeholder="Company (optional)"
                className={styles.input}
                required
              />
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
                placeholder="House number and street name"
                className={styles.input}
                required
              />
            </div>

            <div className="grid gap-3">
              <label htmlFor="Aptsuiteunit" className={styles.label}>
                Apt, suite, unit
              </label>

              <input
                type="text"
                id="Aptsuiteunit"
                placeholder="apartment, suite, unit, etc. (optional)"
                className={styles.input}
                required
              />
            </div>
          </div>



          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
            <div className="grid gap-3">
              <label htmlFor="City" className={styles.label}>
                City
              </label>

              <input
                type="text"
                id="City"
                placeholder="Town / City"
                className={styles.input}
                required
              />
            </div>

            <div className="grid gap-3">
              <label htmlFor="State" className={styles.label}>
                State
              </label>

              <Select placeholder='State' >
                {data.map((item, idx) => (
                  <Select.Option key={idx} value={item.value}>{item.name}</Select.Option>
                ))}
              </Select>
            </div>

          </div>


          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
          <div className="grid gap-3">
            <label htmlFor="Phone" className={styles.label}>
              Phone
            </label>

            <input
              type="number"
              id="Phone"
              placeholder="Phone"
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
                placeholder="Postal Code"
                className={styles.input}
                required
              />
            </div>
          </div>

        

        </form>

        <div className="h-32 rounded-lg bg-gray-200">

          <h1>Hello World</h1>
        </div>

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
            <div className="mt-4 space-y-6">
              <ul className="space-y-4">

                {products.map((item) => {
                  const { id, img, name, color, size, shipping, price, quantity } = item
                  const priceInr = currencyFormatter.format(price, { code: 'INR' });
                  const shippingInr = currencyFormatter.format(shipping, { code: 'INR' });
                  const price_quantity = price * quantity
                  const subTotal = price_quantity + shipping

                  return (
                    <li key={id} className="flex items-center gap-3">
                      <img
                        src={imgUrl + img} alt={name}
                        className="h-20 w-25 rounded object-cover"
                      />

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



    </div>
  )
}

export default Checkout