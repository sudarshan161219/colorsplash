import { useState, useEffect } from "react";
import { Carousel } from 'antd';
import { Link, useParams } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./product.module.css"
import { Radio } from 'antd';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineShoppingCart } from "react-icons/ai"
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import currencyFormatter from 'currency-formatter';
import useFetch from "../../hooks/useFetch"
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartReducer"
import { addToWishlist } from "../../redux/wishlistReducer"
import { SimilarProductsCard } from "../../components/export";
import { PageLoading } from "../../components/export"
import { useSelector } from "react-redux"



const Product = () => {
  const { id } = useParams();
  const [subCat, setSubCat] = useState('')
  const { data, error, loading } = useFetch(`/products/${id}?populate=*`)
  const [size, setSize] = useState('normal');
  const [color, setColor] = useState('normal')
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quantity, setQuantity] = useState(1)
  const wishlists = useSelector(state => state.wishlist.wishlists)
  const products = useSelector(state => state.cart.products)
  const [wishlistedProduct, setWishlistedProduct] = useState([])
  const [cartProduct, setCartProduct] = useState([])
    ;
  const dispatch = useDispatch()

  const imgUrl = import.meta.env.VITE_APP_UPLOAD_URL

  const radioBtn = [
    {
      name: "Xs",
      value: "Xs"
    },
    {
      name: "S",
      value: "S"
    },
    {
      name: "M",
      value: "M"
    },
    {
      name: "L",
      value: "L"
    },
    {
      name: "XL",
      value: "XL"
    },
  ]

  const addtocart = () => {
    dispatch(addToCart({
      id: data?.id,
      name: data?.attributes?.title,
      img: data?.attributes?.img.data[0]?.attributes.formats.small.url,
      color: color === 'normal' ? data?.attributes?.default_color : color,
      size: size === 'normal' ?  data?.attributes?.default_size: size,
      stock: data?.attributes?.stock,
      shipping: data?.attributes?.shipping,
      price: data?.attributes?.price,
      quantity: quantity
    }))
  }

  const addWishlist = () => {
    dispatch(addToWishlist({
      id: data?.id,
      name: data?.attributes?.title,
      img: data?.attributes?.img.data[0]?.attributes.formats.small.url,
      color: color,
      size: size,
      stock: data?.attributes?.stock,
      shipping: data?.attributes?.shipping,
      price: data?.attributes?.price,
      quantity: quantity
    }))
  }

  const handleIncrement = () => {
    setQuantity(quantity + 1)
    if (quantity >= data?.attributes?.stock) {
      setQuantity(quantity);
    }
  };

  const handleDecrement = () => {
    setQuantity(quantity - 1);
    if (quantity === 1) {
      setQuantity(1);
    }
  };

  const price = currencyFormatter.format(data?.attributes?.price, { code: 'INR' });


  useEffect(() => {
    data?.attributes?.sub_categories?.data.map((item) => (
      setSubCat(item.attributes.title)
    ))

    wishlists.map((item) => setWishlistedProduct(item))
    products.map((item) => setCartProduct(item))
  }, [data, wishlists, products, wishlistedProduct, cartProduct])


  if (loading) {
    return <PageLoading />
  }

  return (
    <div className={styles.main}>
      <div className={styles.container}>

        <Carousel initialSlide={currentSlide} >
          {data?.attributes?.img?.data.map((item, idx) => (
            <div key={idx}>
              <div className={styles.imgContainer}>
                <img className={styles.img} src={imgUrl + item?.attributes?.formats?.medium?.url} alt="img" />
                <div style={{ backgroundImage: `url(${imgUrl + item?.attributes?.formats?.medium?.url})` }} className={styles.imgBgContainer}></div>
              </div>
            </div>
          ))}
        </Carousel>

        <div className={styles.infoContainer} >
          <h1 className={styles.heading}>{data?.attributes?.title}</h1>

          <div className={styles.descContainer}>
            <span className={styles.descHeading}>Description</span>
            <p className={styles.desc}>{data?.attributes?.desc}</p>
          </div>

          <div className=" grid gap-10 p-4 " >
            <div className={styles.radioContainerGroup}>
              {
                data?.attributes?.size ? <div className={styles.radioContainer}>
                  <strong className={styles.strong}>Select Size</strong>
                  <Radio.Group buttonStyle="solid" onChange={(e) => setSize(e.target.value)} defaultValue={size}>
                    {radioBtn.map((item, idx) => (
                      <Radio.Button key={idx} value={item.value}>{item.name}</Radio.Button>
                    ))}

                  </Radio.Group>
                </div>

                  : <div className="flex items-center gap-2">
                    <span className="text-lg capitalize">size:</span>  <span className="text-lg capitalize">{data?.attributes?.default_size}</span>
                  </div>
              }


              {
                data?.attributes?.color ?

                  <div className={styles.radioContainer}>
                    <strong className={styles.strong}>Colours Available </strong>
                    <Radio.Group buttonStyle="solid" className={styles.radioGroup} onChange={(e) => setColor(e.target.value)} defaultValue={color}>
                      {data?.attributes?.color.map((item, idx) => (
                        <Radio.Button className={styles.radioBtn} key={idx} value={item.value}>{item.name}</Radio.Button>
                      ))}
                    </Radio.Group>
                  </div>
                  : <div className="flex items-center gap-2">
                    <span className="text-lg capitalize">colour:</span>  <span className="text-lg capitalize">{data?.attributes?.default_color}</span>
                  </div>
              }
            </div>

            <div className="grid gap-3">
              <strong className={styles.strong}>Quantity </strong>
              <div className={styles.btns}>

                <button onClick={handleDecrement}> <AiOutlineMinus /> </button>
                <span>{quantity}</span>
                <button onClick={handleIncrement}> <AiOutlinePlus /> </button>
              </div>
            </div>

            <div className={styles.priceContainer} >
              <h2 className={styles.priceTitle}>{price}</h2>
            </div>
          </div>


          <div className={
            styles.checkOutContainer
          } >

            {
              cartProduct.id === data.id ?
                <Link to="/addtocart" className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900  gap-3  flex-1 text-center flex  items-center justify-center">Go to cart <IoIosArrowRoundForward className={styles.Icons} /></Link>
                :
                <button onClick={addtocart} type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 flex-1 gap-3  text-center flex justify-center">Add to cart <AiOutlineShoppingCart className={styles.Icons} /></button>
            }

            {wishlistedProduct.id === data.id ?
              <Link to="/my_account" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3.5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 flex-2">
                <IoMdHeart className={styles.Icons} /> </Link>
              :
              <button onClick={addWishlist} type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3.5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 flex-2">   <IoIosHeartEmpty className={styles.Icons} /></button>

            }

          </div>
        </div>
      </div>

      <div className={styles.recommendtions} >
        <SimilarProductsCard title={subCat} />
      </div>
    </div>
  )
}

export default Product