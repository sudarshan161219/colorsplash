import axios from "axios"
import { Link } from 'react-router-dom';
import styles from "./addcart.module.css"
import currencyFormatter from 'currency-formatter';
import { AiOutlineDelete, AiOutlinePlus, AiOutlineMinus, AiOutlineShoppingCart } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux";
import { addToCart, removeItem } from "../../redux/cartReducer"
import img from "../../assets/ecartbg.png"
import { useAppContext } from "../../context/Context"
import logo from "../../assets/colorlogo.webp"
import { toast } from 'react-hot-toast'


const AddCart = () => {
    const products = useSelector(state => state.cart.products)
    const dispatch = useDispatch()
    const { user } = useAppContext()
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

    const handleIncrement = (itemId) => {
        const item = products.find((item) => item.id === itemId);
        const stock = item ? item.stock : 0;
        const quantity = item ? item.quantity : 0;

        if (quantity < stock) {
            dispatch(addToCart({ id: itemId, quantity: quantity + 1 }));
        } else {
            console.log('Reached maximum stock limit');
        }
    };

    const handleDecrement = (itemId) => {
        const item = products.find((item) => item.id === itemId);
        const quantity = item ? item.quantity : 0;

        if (quantity > 1) {
            dispatch(addToCart({ id: itemId, quantity: quantity - 1 }));
        } else {
            console.log('Minimum quantity reached');
        }
    };


    const handleDownload = async (price) => {
        try {
            const { data: { key } } = await axios.get("http://localhost:1337/api/orders/get_key");
            const { data: { order } } = await axios.post(' http://localhost:1337/api/orders/checkout', { price });
            const options = {
                key: key,
                amount: order.amount,
                currency: "INR",
                name: "colorSplash",
                description: "Test Transaction",
                image: logo,
                order_id: order.id,
                userId: user.id,
                callback_url: `http://localhost:1337/api/orders/verification`,
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
            toast.success("successfully .....");
        } catch (error) {
            // toast.error(error);
            console.log(error);
        }
    };

    if (products.length === 0) {
        return (
            <div className={styles.noItems}>

                <img className={styles.eimg} src={img} alt="Your cart is empty and sad" />
                <div className={styles.textContainer}>
                    <h1>Your cart is empty and sad {':('}</h1>
                    <p>Add something to make it happy!</p>
                </div>

                <div className='mt-5'>
                    <Link to='/' className={`  ${styles.btn} ${styles.addToCartBtn}`}>Continue Shopping</Link>
                </div>
            </div>
        )
    }

    return (

        <div className={styles.container}>
            {!user && <strong className="mt-4 mb-4  leading-relaxed" >Please fill in the fields below and click place order to complete your purchase!
                Already registered? <Link className="text-blue-700 underline" to="/register"  >Please login here</Link></strong>}
            <h1 className={`flex items-center gap-3  font-medium text-2xl ${styles.heading}`}>Your Cart <AiOutlineShoppingCart /> ({products.length}) </h1>
            <div className={styles.mtable}>
                {products.map((item) => {

                    const { id, img, name, color, size, shipping, price, quantity } = item
                    const priceInr = currencyFormatter.format(price, { code: 'INR' });
                    const shippingInr = currencyFormatter.format(shipping, { code: 'INR' });
                    const price_quantity = price * quantity
                    const subTotal = price_quantity + shipping


                    const subTotalInr = currencyFormatter.format(subTotal, { code: 'INR' });


                    return (
                        <div className={styles.card} key={id}>
                            <div className={styles.cardInfo}>
                                <div className={styles.imgContainer}>
                                    <img className={styles.img} src={imgUrl + img} alt={name} />
                                </div>

                                <div className={styles.info_container}>
                                    <strong className={styles.spanHeading}>{name}</strong>
                                    <div className={styles.infoContainer} >

                                        <div className=' grid gap-3 '>
                                            <span>color: {color}</span>
                                            <span>size: {size}</span>
                                        </div>

                                        <div className=' grid gap-3 '>
                                            <span>shipping: {!isNaN(shipping) && null}{shippingInr}</span>
                                            <span>price: {priceInr}</span>
                                        </div>

                                    </div>
                                </div>

                            </div>

                            <div className={styles.action} >
                                <div className={styles.btns}>
                                    <button onClick={() => handleDecrement(id)}> <AiOutlineMinus /> </button>
                                    <span>{quantity}</span>
                                    <button onClick={() => handleIncrement(id)}> <AiOutlinePlus /> </button>
                                </div>
                                <div>
                                    <button onClick={() => dispatch(removeItem(id))} className={styles.rbtn}>
                                        <AiOutlineDelete />
                                    </button>
                                </div>

                                <div className={styles.priceContainer}>
                                    Sub Total:
                                    <span> {subTotalInr} </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>


            {
                products.length >= 1 && <div className={styles.checkOutContainer} >
                    <div className={styles.total_shipping_container}>
                        <div className={styles.total_shipping_container_div}> <span>Sub Total</span> <span>{totalPriceInr}</span> </div>
                        <div className={styles.total_shipping_container_div}> <span>Shipping</span>  <span>{totalShippingPriceInr}</span>  </div>
                    </div>

                    <div className={styles.grand_total}>
                        <div className={styles.grand_total_div} >
                            <span>Grand Total</span>
                            <span>{grandTotalInr}</span>
                        </div>
                    </div>

                    {!user ? <Link to="/register" className={styles.btn} >Proceed To Checkout</Link> : <button onClick={() => handleDownload(grandTotal)} className={styles.btn}> Proceed To Checkout</button>}
                    
    
                </div>
            }

        </div>
    )
}

export default AddCart