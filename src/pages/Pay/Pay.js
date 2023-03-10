import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Pay.css';
import 'react-date-range/dist/styles.css'; // import stylesheet
import 'react-date-range/dist/theme/default.css'; // import theme
import { DateRange } from 'react-date-range';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
// import { Calendar } from 'react-date-range';
import moment from 'moment';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Footer from '~/layouts/Footer';
import { isValidNumber } from 'libphonenumber-js';

function Settings() {
    const currentUser = localStorage.getItem('user');
    const User = JSON.parse(localStorage.getItem('user'));
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('pay:');
    const lastPart = urlParts[urlParts.length - 1];
    // console.log(User.id);
    const [products, setProducts] = useState([]);
    // const [error, setError] = useState(null);
    // const [isLoaded, setIsLoaded] = useState(false);
    const [open, setOpen] = useState(false);
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ]);

    const [disabledDates, setDisabledDates] = useState();

    //////////////////////////////////////////

    // const disabledDates = [];

    // const startDate = new Date('3 15,2023');
    // const endDate = new Date('3 20, 2023');
    // console.log(startDate);
    // Loop from start date to end date
    // let currentDate = startDate;
    // while (currentDate <= endDate) {
    //     // Add current date to disabled dates array
    //     disabledDates.push(new Date(currentDate));

    //     // Increment current date by one day
    //     currentDate.setDate(currentDate.getDate() + 1);
    // }
    //////////////////////////////////////////
    const [sumDay, setSumDay] = useState(0);
    const BorrowDate = moment(state[0].startDate);
    const ReturnDate = moment(state[0].endDate);
    const orderBorrowDate = BorrowDate.format('YYYY-MM-DD');
    const orderReturnDate = ReturnDate.format('YYYY-MM-DD');
    // const orderBorrowDay = BorrowDate.format('DD');
    // const orderReturnDay = ReturnDate.format('DD');
    // const day = orderReturnDay - orderBorrowDay + 1;

    // console.log(orderReturnDate - orderBorrowDate);

    // T??nh to??n s??? ng??y gi???a ng??y m?????n v?? ng??y tr???

    const handleClose = () => {
        setOpen(false);
        const date = moment(orderBorrowDate);
        const date1 = moment(orderReturnDate);
        const numDays = date1.diff(date, 'days');

        setSumDay(numDays);
    };
    // console.log(sumDay);
    const handleOpen = () => {
        setOpen(true);
    };
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URLS}products/getOne/${lastPart}`)
            .then((res) => res.json())
            .then(
                (result) => {
                    // setIsLoaded(true);
                    setProducts(result);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    // setIsLoaded(true);
                    // setError(error);
                },
            );
    }, [lastPart]);
    const [orders, setOrders] = useState();
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URLS}order-details/getAllByProduct/${lastPart}`)
            .then((res) => res.json())
            .then(
                (result) => {
                    setOrders(result);
                    let start = 0;
                    const disabledDates = [];
                    console.log('???? ~ file: Pay.js:128 ~ useEffect ~ disabledDates:', disabledDates);
                    while (start <= result.length) {
                        const startDate = new Date(`${moment(result[start].orderBorrowDate).format('MM DD,YYYY')}`);
                        console.log(startDate);

                        const endDate = new Date(`${moment(result[start].orderReturnDate).format('MM DD,YYYY')}`);
                        console.log(endDate);
                        // console.log(moment(result[0].orderReturnDate).format('MM DD,YYYY'));
                        // Loop from start date to end date

                        let currentDate = startDate;
                        while (currentDate <= endDate) {
                            // Add current date to disabled dates array
                            disabledDates.push(new Date(currentDate));
                            setDisabledDates(disabledDates);
                            // Increment current date by one day
                            currentDate.setDate(currentDate.getDate() + 1);
                        }
                        start++;
                    }
                    // const startDate = new Date(`${moment(result[0].orderBorrowDate).format('MM DD,YYYY')}`);
                    // console.log(startDate);

                    // const endDate = new Date(`${moment(result[0].orderReturnDate).format('MM DD,YYYY')}`);
                    // console.log(endDate);
                    // // console.log(moment(result[0].orderReturnDate).format('MM DD,YYYY'));
                    // // Loop from start date to end date
                    // const disabledDates = [];
                    // let currentDate = startDate;
                    // while (currentDate <= endDate) {
                    //     // Add current date to disabled dates array
                    //     disabledDates.push(new Date(currentDate));
                    //     console.log('???? ~ file: Pay.js:128 ~ useEffect ~ disabledDates:', disabledDates);
                    //     setDisabledDates(disabledDates);
                    //     // Increment current date by one day
                    //     currentDate.setDate(currentDate.getDate() + 1);
                    // }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    // setIsLoaded(true);
                    // setError(error);
                },
            );
    }, [lastPart]);

    useEffect(() => {}, [orders]);
    // const [pay, setPay] = useState(products.price);
    const [name, setName] = useState(
        (User.lastName ? User.lastName : '') + ' ' + (User.firstName ? User.firstName : ''),
    );
    const [address, setAddress] = useState(User.address);
    const [phone, setPhone] = useState(User.phone);
    // const [id, setid] = useState(User.id);

    // const [totalPrice, setTotalPrice] = useState(10);
    const [message, setMessage] = useState('');

    const order = async () => {
        if (name === '' || address === '' || phone === '') {
            toast.error(`Vui l??ng nh???p ?????y ????? th??ng tin`);
            return;
        }
        if (phone <= 99999999 || !isValidNumber(phone, 'VN')) {
            toast.error(`S??? ??i???n tho???i kh??ng h???p l???`);
            return;
        }
        if (address <= 99999999) {
            toast.error(`S??? ??i???n tho???i kh??ng h???p l???`);
            return;
        }
        const order = {
            totalPrice: products.price + (products.price * sumDay) / 2 + products.deposit,
            message: message,
            address: address,
            phone: phone,
            name: name,
            userId: User.id,
            orderDetails: {
                orderBorrowDate: orderBorrowDate,
                orderReturnDate: orderReturnDate,
                productId: products.id,
            },
        };
        console.log(order);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URLS}order/create`, order);
            console.log(response.data);
            toast.success(`?????t h??ng th??nh c??ng!`);
        } catch (error) {
            console.log(error.response.data.message);
            // toast.error(`${error.response.data.message}!`);
            toast.error(`S???n ph???m n??y ???? c?? ng?????i thu??!`);
            console.log('no');
        }
    };

    return (
        <>
            {currentUser ? (
                <div>
                    <div className="pay-main">
                        <ToastContainer />
                        <div className="border-envelop"></div>
                        <div className="pay-header-user-location">
                            {/* <div className="pay-info">
                                Th??ng tin nh???n h??ng:<br></br>
                                <div className="pay-info-item i-name-phone">
                                    <span className="pay-header-user-name">
                                        T??N:
                                        {User.lastName} {User.firstName}
                                    </span>
                                </div>
                                <div className="pay-info-item i-phone">
                                    <span className="pay-header-user-phone"> S??T:{User.phone} </span>
                                </div>
                                <div className="pay-info-item i-phone">
                                    <span className="pay-header-user-phone">?????A CH???{User.address}</span>
                                </div>
                                <div className="pay-info-item i-change">
                                    <a href="" className="pay-change-selected">
                                        <span>Thay ?????i</span>
                                    </a>
                                </div>
                            </div> */}
                            <div className="pay-container">
                                <div className="pay-header-selection header-res">
                                    <div className="pay-product">
                                        <b> S???n ph???m </b>
                                    </div>
                                    <div className="pay-price">????n gi??</div>
                                    <div className="pay-quantity">Ng??y thu??</div>
                                    <div className="pay-total-price">Th??nh ti???n</div>
                                </div>

                                <div className="pay-header-selection">
                                    <div className="pay-product product-selected">
                                        <div className="pay-item-image">
                                            <img
                                                className="image-item"
                                                alt=""
                                                src={products.images ? products.images[0].url : ''}
                                            />
                                        </div>
                                        <div className="pay-item-info-name">{products.name}</div>
                                        <div className="pay-item-info-type">
                                            <span className="pay-item-span-type"> </span>
                                        </div>
                                    </div>
                                    <div className="pay-price">{(products.price * 1).toLocaleString('vi-VN')}</div>
                                    <div className="pay-quantity">
                                        <p> {orderBorrowDate}</p>
                                        <p>{orderReturnDate}</p>
                                        <button onClick={handleOpen}>Ch???n ng??y</button>

                                        <Dialog
                                            // maxWidth={800}
                                            // maxHeight={800}
                                            open={open}
                                            // TransitionComponent={Transition}
                                            keepMounted
                                            onClose={handleClose}
                                            aria-describedby="alert-dialog-slide-description"
                                        >
                                            <DialogTitle></DialogTitle>
                                            <DialogContent>
                                                <DateRange
                                                    editableDateInputs={false}
                                                    onChange={(item) => setState([item.selection])}
                                                    moveRangeOnFirstSelection={false}
                                                    // retainEndDateOnFirstSelection={false}
                                                    // onRangeFocusChange={handleRangeFocusChange}
                                                    ranges={state}
                                                    minDate={new Date()}
                                                    // maxDate={new Date("Aug 1,2023 0:0:1")}
                                                    disabledDates={disabledDates}
                                                />
                                            </DialogContent>
                                            <DialogActions></DialogActions>
                                        </Dialog>
                                    </div>
                                    <div className="pay-total-price">
                                        {(products.price + (products.price * sumDay) / 2).toLocaleString('vi-VN')}
                                    </div>
                                </div>

                                <div className="pay-submit">
                                    <div className="pay-item-voucher">
                                        <div className="pay-notice-voucher"> </div>
                                        <div className="pay-choosing-voucher">
                                            {/* <a className="pay-item-btn-change-boucher"> </a> */}
                                        </div>
                                    </div>
                                    <div className="pay-item-footer">
                                        <div className="pay-item-footer-transport">
                                            <div className=" pay-footer-noting">
                                                <div className="pay-footer-noting-lb">L???i nh???n</div>
                                                <div className="pay-footer-noting">
                                                    <input
                                                        className="pay-footer-noting-txt"
                                                        placeholder="L??u ?? cho ng?????i b??n"
                                                        value={message}
                                                        onChange={(e) => setMessage(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className=" pay-footer-shipping">
                                                <div className="pay-shipping_unit-transport"> </div>

                                                <div className="pay-shipping-info">?????t c???c</div>
                                            </div>
                                            <div div="pay-shipping-change-delivery">
                                                <div className="pay-shipping-change-transporter">
                                                    {/* <dt className="pay-totalprice-label"></dt> */}
                                                    <dd className="pay-total-price-payment">
                                                        {(products.deposit * 1).toLocaleString('vi-VN')}
                                                    </dd>
                                                </div>
                                            </div>
                                        </div>
                                        <div div="pay-shipping-change-delivery">
                                            <div className="pay-shipping-change-transporter">
                                                <dt className="pay-totalprice-label"> T???ng s??? ti???n thanh to??n </dt>
                                                <dd className="pay-total-price-payment" style={{ fontSize: '2.3rem' }}>
                                                    {(
                                                        products.price +
                                                        (products.price * sumDay) / 2 +
                                                        products.deposit
                                                    ).toLocaleString('vi-VN')}
                                                </dd>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pay-info">
                                        <div> Th??ng tin nh???n h??ng:</div>
                                        <div className="pay-info-item">
                                            <input value={name} onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <br />
                                        <div> S??? ??i???n tho???i:</div>
                                        <div className="pay-info-item">
                                            <br />
                                            <input value={phone} onChange={(e) => setPhone(e.target.value)} />
                                        </div>
                                        <br />
                                        <div>?????A CH???:</div>
                                        <div className="pay-info-item">
                                            <span className="pay-header-user-phone">
                                                <input value={address} onChange={(e) => setAddress(e.target.value)} />
                                            </span>
                                        </div>
                                        {/* <div className="pay-info-item i-change">
                                            <a href="" className="pay-change-selected">
                                                <span>Thay ?????i</span>
                                            </a>
                                        </div> */}
                                    </div>
                                    <div className="pay-footer-sunmit divSubmitBtn">
                                        <div className="div-payment">
                                            <input
                                                type="button"
                                                value="Thanh to??n"
                                                className="pay-submit-btn"
                                                onClick={order}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <br></br>
                                <br></br>
                                <br></br>
                                <br></br>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            ) : (
                <></>
            )}
        </>
    );
}

export default Settings;
