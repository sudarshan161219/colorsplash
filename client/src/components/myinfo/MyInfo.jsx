import styles from "./myinfo.module.css"
import { useState, useEffect } from 'react';
import {
    Input,
    Select,
} from 'antd';
import { data } from "../../data/data"
import { CiEdit } from "react-icons/ci";
import { IoAddSharp } from "react-icons/io5";
import { useAppContext } from "../../context/Context";
import { toast } from "react-hot-toast";
import Button from '@mui/material/Button';
import { v4 as uuidv4 } from 'uuid';


const MyInfo = ({ user }) => {
    const { addAddress, getAddresses, userAddress, updateUser, update_Address,
        delete_Address } = useAppContext()
    const [toggle, setToggle] = useState(false)
    const [toggleInput, setToggleInput] = useState(false)
    const [toggleInput2, setToggleInput2] = useState(false)
    const [toggleInput3, setToggleInput3] = useState(false)
    const [deleteCount, setDeleteCount] = useState(0);
    const [saveCount, setSaveCount] = useState(0);
    const [address, setAddress] = useState([])
    const [selectedState, setSelectedState] = useState('')
    const [editing, setEditing] = useState(false)
    const [addressId, setAddressId] = useState(0)
    const [inputValue, setInputValue] = useState({
        username: user?.username || '',
        phoneNumber: user?.phoneNumber || '',
        email: user?.email || ''
    });

    const initialAddress = {
        id: uuidv4(),
        attributes: {
            firstname: '',
            lastname: " ",
            customer_name: " ",
            Street_Address: " ",
            Town_City: " ",
            State: " ",
            Country_Region: " ",
            Phone: " ",
            Postal_Code: " ",
            customer_email: " ",
            customer_address: " "
        }
    };


    useEffect(() => {
        setInputValue({
            username: user?.username || '',
            phoneNumber: user?.phoneNumber || '',
            email: user?.email || ''
        });
        getAddresses(user.id)
    }, [user?.id, deleteCount, saveCount]);




    const onFinish = (e) => {
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
        setToggle(false)
    };


    const onEdit = (e) => {
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

        update_Address(payload, addressId)
        setSaveCount((prevCount) => prevCount + 1);
        setToggle(false)
    }

    const handleChange = (e) => {
        setInputValue({
            ...inputValue,
            [e.target.name]: e.target.value
        });
    };

    const handleStateChange = (value) => {
        setSelectedState(value)
    };


    const handleSave = () => {
        updateUser(user.id, inputValue)
        if (toggleInput) {
            setToggleInput(false)
        }
        if (toggleInput2) {
            setToggleInput2(false)
        }

        if (toggleInput3) {
            setToggleInput3(false)
        }
    }


    const handleAddressEdit = (id) => {
        setToggle(true)
        setEditing(true)
        const filteredAddress = userAddress.filter((number) => number.id === id);
        setAddress(filteredAddress)
        filteredAddress.map(item => setAddressId(item.id))
    }


    const handleInputChange = (e, id, field) => {
        const updatedAddresses = address.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    attributes: {
                        ...item.attributes,
                        [field]: e.target.value,
                    },
                };
            }
            return item;
        });
        setAddress(updatedAddresses);
    };

    const handleCancleEdit = () => {
        setToggle(false)
        setEditing(false)
        setAddress([])
    }

    const handleDeleteBtn = (id) => {
        delete_Address(id)
        setDeleteCount((prevCount) => prevCount + 1);
    }


    return (
        <>
            <div className={`${styles.infoContainer} grid gap-3 `}>

                <div className="grid gap-3 my-3">
                    <h1 className="text-3xl font-semibold">My Info</h1>
                    <h2 className="text-2xl font-semibold">Contact Details</h2>
                </div>

                <div className="grid gap-2">
                    <span className="text-sm font-semibold text-gray-500">Your Name</span>


                    {
                        toggleInput ?
                            <div className="flex gap-5 items-center justify-between ">
                                <Input onChange={handleChange} name="username" value={inputValue.username} placeholder="email" />
                                <div className="flex items-center gap-3">
                                    <Button size="small" onClick={handleSave} variant="contained" color="success">
                                        edit
                                    </Button>
                                    <Button size="small" onClick={() => setToggleInput(!toggleInput)} variant="outlined" color="error">
                                        cancel
                                    </Button>
                                </div>

                            </div>
                            :
                            <div className="flex items-center justify-between ">
                                <strong className="font-semibold">{user?.username}</strong>
                                <CiEdit onClick={() => setToggleInput(!toggleInput)} className="cursor-pointer" />
                            </div>
                    }
                </div>

                <div className="grid gap-2">
                    <span className="text-sm font-semibold text-gray-500">Email Address</span>

                    {
                        toggleInput2 ?
                            <div className="flex gap-5 items-center justify-between ">
                                <Input onChange={handleChange} name="email" value={inputValue.email} placeholder="email" />
                                <div className="flex items-center gap-3">
                                    {/* <Button onClick={handleSave} size={'small'} ghost type="primary">edit</Button>
                                    <Button size={'small'} onClick={() => setToggleInput2(!toggleInput2)} >cancel</Button> */}
                                    <Button size="small" onClick={handleSave} variant="contained" color="success">
                                        edit
                                    </Button>
                                    <Button size="small" onClick={() => setToggleInput2(!toggleInput2)} variant="outlined" color="error">
                                        cancel
                                    </Button>
                                </div>

                            </div>
                            :
                            <div className="flex items-center justify-between ">
                                <strong className="font-semibold">{user?.email}</strong>
                                <CiEdit onClick={() => setToggleInput2(!toggleInput2)} className="cursor-pointer" />
                            </div>
                    }
                </div>

                <div className="grid gap-2">
                    <span className="text-sm font-semibold text-gray-500">Phone Number</span>
                    {
                        toggleInput3 ?
                            <div className="flex gap-5 items-center justify-between ">
                                <Input onChange={handleChange} name="phoneNumber" value={inputValue.phoneNumber} placeholder="phone Number" />
                                <div className="flex items-center gap-3">
                                    {/* <Button onClick={handleSave} size={'small'} ghost type="primary">edit</Button>
                                    <Button size={'small'} onClick={() => setToggleInput3(!toggleInput3)} >cancel</Button> */}
                                    <Button size="small" onClick={handleSave} variant="contained" color="success">
                                        edit
                                    </Button>
                                    <Button size="small" onClick={() => setToggleInput3(!toggleInput3)} variant="outlined" color="error">
                                        cancel
                                    </Button>
                                </div>

                            </div>
                            :
                            <div className="flex items-center justify-between ">
                                <strong className="font-semibold">{user?.phoneNumber}</strong>
                                <CiEdit onClick={() => setToggleInput3(!toggleInput3)} className="cursor-pointer" />
                            </div>
                    }
                </div>

            </div>



            <div className={`grid gap-5 mt-5 ${styles.addressContainer}`} >
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-semibold">Address</h1>
                    <div className="flex items-center gap-4 cursor-pointer">
                        {
                            user?.Street_Address !== "" ?
                                <div className="flex items-center gap-2" onClick={() => setToggle(!toggle)}>
                                    <IoAddSharp />
                                    <span className="text-sm font-semibold text-gray-500">Add New Address</span>
                                </div>
                                :
                                <div className="flex items-center gap-2" onClick={() => setToggle(!toggle)}>
                                    <IoAddSharp />
                                    <span className="text-sm font-semibold text-gray-500">Add Address</span>
                                </div>
                        }
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
                    {userAddress.map((item) => (
                        <div key={item.id} className=" rounded-lg grid gap-4 bg-gray-200 p-3">
                            <div>{item.attributes.customer_address}</div>
                            <div className="flex items-center  justify-between  ">
                                <div className="flex items-center gap-2 " >
                                    <Button onClick={() => handleAddressEdit(item.id)} size="small" variant="contained" color="success">
                                        edit
                                    </Button>
                                    <Button onClick={() => handleDeleteBtn(item.id)} size="small" variant="outlined" color="error">
                                        delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {toggle &&
                <div className="mt-5">

                    <div className="flex items-center gap-2 mb-2">
                        <IoAddSharp className="text-3xl" />
                        <h1 className="text-2xl">Add New Address</h1>
                    </div>

                    {editing ?

                        (
                            address.map((item) => (
                                <form key={item.id} onSubmit={onEdit} className=" flex flex-col gap-4 lg:col-span-2 lg:p-8 ">
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
                                        <div className="grid gap-3">

                                            <label htmlFor={`First_Name_${item.id}`} className={styles.label}>First Name</label>
                                            <input
                                                type="text"
                                                id={`First_Name_${item.id}`}
                                                name="firstname"
                                                placeholder="First Name"
                                                value={item.attributes.firstname}
                                                onChange={(e) => handleInputChange(e, item.id, 'firstname')}
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
                                                value={item.attributes.lastname}
                                                onChange={(e) => handleInputChange(e, item.id, 'lastname')}
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
                                                value={item.attributes.Country_Region}
                                                onChange={(e) => handleInputChange(e, item.id, 'Country_Region')}
                                                className={styles.input}
                                                required
                                            />
                                        </div>


                                        <div className="grid gap-3">
                                            <label htmlFor="StreetAddress" className={styles.label}>
                                                Street Address
                                            </label>

                                            <input
                                                type="text"
                                                id="StreetAddress"
                                                name="Street_Address"
                                                placeholder="House number and street name"
                                                value={item.attributes.Street_Address}
                                                onChange={(e) => handleInputChange(e, item.id, 'Street_Address')}
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
                                                name="Town_City"
                                                placeholder="Town / City"
                                                value={item.attributes.Town_City}
                                                onChange={(e) => handleInputChange(e, item.id, 'Town_City')}
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
                                            <label htmlFor="PhoneNumber" className={styles.label}>
                                                Phone
                                            </label>

                                            <input
                                                type="number"
                                                id="PhoneNumber"
                                                name="Phone"
                                                placeholder="Phone"
                                                value={item.attributes.Phone}
                                                onChange={(e) => handleInputChange(e, item.id, 'Phone')}
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
                                                value={item.attributes.Postal_Code}
                                                onChange={(e) => handleInputChange(e, item.id, 'Postal_Code')}
                                                className={styles.input}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        {/* <button
                                            onClick={handleCancleEdit}
                                            type="button"
                                            className={`${styles.cancelBtn} mt-3 inline-block px-5 py-3 text-xs font-medium uppercase tracking-wide  rounded-xl    focus:relative`}
                                        >
                                            cancel
                                        </button>

                                        <button type="submit" className="mt-3 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white rounded-xl" >Edit Address</button> */}


                                        <Button variant="text" sx={{ backgroundColor: '#F5F5F5', color:'#000' ,boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>Cancel</Button>
                                        <Button variant="contained" sx={{ backgroundColor: '#000' }} >Edit Address</Button>
                                    </div>

                                </form>
                            ))
                        )
                        :
                        <form onSubmit={onFinish} className=" flex flex-col gap-4 lg:col-span-2 ">
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
                                    <label htmlFor="CompanyName" className={styles.label}>
                                        Company Name
                                    </label>

                                    <input
                                        type="text"
                                        id="CompanyName"
                                        name="CompanyName"
                                        placeholder="Company (optional)"
                                        className={styles.input}
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
                                        name="Street_Address"
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
                                        name="Aptsuiteunit"
                                        placeholder="apartment, suite, unit, etc. (optional)"
                                        className={styles.input}

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
                                        name="Town_City"
                                        placeholder="Town / City"
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
                                    <label htmlFor="PhoneNumber" className={styles.label}>
                                        Phone
                                    </label>

                                    <input
                                        type="number"
                                        id="PhoneNumber"
                                        name="Phone"
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
                                        name="Postal_Code"
                                        placeholder="Postal Code"
                                        className={styles.input}
                                        required
                                    />
                                </div>
                            </div>

                            <button className="mt-3 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white rounded-xl" >Add Address</button>

                        </form>
                    }
                </div>
            }
        </>
    );
}

export default MyInfo