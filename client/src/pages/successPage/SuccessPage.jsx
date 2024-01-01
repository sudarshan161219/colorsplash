import { Link } from "react-router-dom"
import styles from "./index.module.css"
import img from "../../assets/confirmed.svg"

const SuccessPage = () => {
    return (
        <div className={styles.container}>
            <img className={styles.eimg} src={img} alt="Your cart is empty and sad" />
            <div className={styles.textContainer}>
                <h1>Your Order is Confirmed {':)'}</h1>
            </div>
            <div className='mt-5'>
                <Link to='/' className="mt-3 inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring">Continue Shopping</Link>
            </div>
        </div>

    )
}

export default SuccessPage