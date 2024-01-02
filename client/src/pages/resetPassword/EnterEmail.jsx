import img from "../../assets/enteremail.webp"
import logo from "../../assets/colorlogo.webp"
import styles from "./resetpassword.module.css"
import { Link } from "react-router-dom"

const enterEmail = () => {
    return (
        <section className="bg-white">
            <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
                <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
                    <img
                        alt="Night"
                        src={img}
                        className="absolute inset-0 h-full w-full object-cover opacity-80"
                    />
                </section>

                <main
                    className={`${styles.main} flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6`}
                >

                    <div className={styles.desk}>
                        <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                            Reset Your Password
                        </h1>

                        <p className="mt-4 leading-relaxed text-gray-500">
                            Enter your email and {"we'll"} send you a link to reset your password.
                            Please  check it.
                        </p>
                    </div>
                    <div className="max-w-xl lg:max-w-3xl">
                        <div className="relative -mt-16 block lg:hidden">

                            <div className={styles.whiteCircle}>
                                <img className={styles.logo} src={logo} alt="colorsplash" />
                            </div>

                            <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                                Reset Your Password
                            </h1>

                            <p className="mt-4 leading-relaxed text-gray-500">
                                Enter your email and {"we'll"} send you a link to reset your password.
                                Please  check it.
                            </p>
                        </div>

                        <form action="#" className="mt-8 grid grid-cols-6 gap-6">


                            <div className="col-span-6">
                                <label htmlFor="Email" className="block text-sm font-medium text-gray-700"> Email </label>

                                <input
                                    type="email"
                                    id="Email"
                                    name="email"
                                    placeholder="Email"
                                    className={styles.input}
                                />
                            </div>


                            <div className="col-span-6 flex items-center  gap-4 col sm:flex sm:items-center sm:gap-4">
                                <div>
                                    <button to='/' className="mt-3 inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring">Send</button>
                                </div>

                                <Link to="/" className="mt-4 text-sm text-gray-500 sm:mt-0">Back to Home?</Link>

                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </section>
    )
}

export default enterEmail