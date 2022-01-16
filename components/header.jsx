import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { Badge, Button, Dropdown, Input, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, Modal, ModalBody, TabPane, TabContent, Nav, NavItem, NavLink, ModalHeader } from 'reactstrap';
import { logoutAction, updateUserCart } from '../redux/actions';
import { HiShoppingCart } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi";
import Link from 'next/link';
import LoginPage from '../pages/login';
import RegisPage from '../pages/regis';
import Image from 'next/image';

const HeaderComp = (props) => {

    const dispatch = useDispatch()

    const { username, cart, iduser, photo } = useSelector((state) => {
        console.log("cek get data", state)
        return {
            username: state.userReducer.username,
            cart: state.userReducer.cart,
            iduser: state.userReducer.id,
            photo: state.userReducer.photo
        }
    })

    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [modal, setModal] = useState(false);

    const [tabBar, setTabBar] = useState("1");

    useEffect(() => {
        console.log("logout", username)
        // if (!username) {
        //     Router.push('/')
        // }
    })

    const onBtInc = (idx) => {
        let temp = [...cart]
        temp[idx].qty++

        dispatch(updateUserCart(temp, iduser))
    }

    const onBtDec = (idx) => {
        let temp = [...cart]
        if (temp[idx].qty > 1) {
            temp[idx].qty--
        } else {
            temp.splice(idx, 1)
        }
        dispatch(updateUserCart(temp, iduser))
    }

    const onBtRemove = (idx) => {
        let temp = [...cart]
        temp.splice(idx, 1)

        dispatch(updateUserCart(temp, iduser))
    }

    const printCart = () => {
        return cart.map((value, index) => {
            return (
                <div key={index} className='cart-width'>
                    <div className="shadow-sm p-1 bg-white rounded" >
                        <div className='row'>
                            <div className="col-3 col-md-2">
                                <img src={value.image} width="100%" />
                            </div>
                            <div className="col-9 col-md-10 d-flex justify-content-center flex-column">
                                <p style={{ fontWeight: 'bolder', fontSize: 12, margin: 0 }}>{value.nama} <span className="d-none d-lg-inline">| {value.type}</span><span className="d-none d-lg-inline">| Rp {value.harga.toLocaleString()}</span></p>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: "center", width: "fit-content" }}>
                                        <span className="material-icons" style={{ cursor: 'pointer' }} onClick={() => onBtDec(index)}>
                                            remove
                                        </span>
                                        <Input className='p-0' disabled placeholder="qty" value={value.qty} style={{ display: 'inline-block', textAlign: 'center', fontSize: "0.9em" }} />
                                        <span className="material-icons" style={{ cursor: 'pointer' }} onClick={() => onBtInc(index)}>
                                            add
                                        </span>
                                    </span>
                                    <p className='text-center w-100 my-auto' style={{ fontWeight: "bold", fontSize: "0.8em" }}>Rp {(value.harga * value.qty).toLocaleString()}</p>
                                    <HiOutlineTrash color='orange' style={{ cursor: 'pointer', fontSize: "2.5em" }} onClick={() => onBtRemove(index)} />
                                </div>
                            </div>
                            {/* <div className="col-md-4 d-flex align-items-center ">
                                <div className="d-none d-lg-block">
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: "center", width: "fit-content" }}>
                                        <span className="material-icons" style={{ cursor: 'pointer' }} onClick={() => onBtDec(index)}>
                                            remove
                                        </span>
                                        <Input placeholder="qty" value={value.qty} style={{ width: "50%", display: 'inline-block', textAlign: 'center' }} />
                                        <span className="material-icons" style={{ cursor: 'pointer' }} onClick={() => onBtInc(index)}>
                                            add
                                        </span>
                                    </span>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            )
        })
    }

    setTimeout(() => setLoading(true), 2000)

    const onBtTabBar = (num) => {

    }

    if (loading) {
        return (
            <div className='mb-4'>
                <Modal className='shadow' isOpen={modal} toggle={() => setModal(!modal)}>
                    <ModalBody className='p-0'>
                        {/* <div>
                            <h5 className='bg-primary p-2 shadow m-auto' style={{ position: "relative", width: "fit-content", borderRadius: 20, color: "white", top: "-75%" }}>
                                Welcome to Commerce
                            </h5>
                        </div> */}
                        <div className='row'>
                            <div className='col-11 px-3 py-4'>
                                <Nav tabs>
                                    <NavItem style={{ width: "50%" }}>
                                        <NavLink className={`${tabBar == 1 ? "active" : ""} text-center`} onClick={() => setTabBar("1")}>
                                            Login
                                        </NavLink>
                                    </NavItem>
                                    <NavItem style={{ width: "50%" }}>
                                        <NavLink className={`${tabBar == 2 ? "active" : ""} text-center`} onClick={() => setTabBar("2")}>
                                            Register
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={tabBar}>
                                    <TabPane tabId="1">
                                        <Image
                                            className="rounded p-3 p-md-4"
                                            src={require('../assets/signin.svg')}
                                            alt="product"
                                            layout='responsive'
                                            objectFit={'contain'}
                                        />
                                        <LoginPage btCancel={() => setModal(!modal)} />
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <Image
                                            className="rounded p-3 p-md-4"
                                            src={require('../assets/signup.svg')}
                                            alt="product"
                                            layout='responsive'
                                            objectFit={'contain'}
                                        />
                                        <RegisPage btCancel={() => setModal(!modal)} />
                                    </TabPane>
                                </TabContent>
                            </div>
                            <div className='col-1 text-center bg-primary shadow p-1' style={{ writingMode: "vertical-rl", color: "white", fontWeight: "bold" }} >
                                Welcome
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                {
                    iduser ?
                        <div className='d-md-flex justify-content-between align-items-center'>
                            <div className="d-flex justify-content-end order-md-2">
                                <Dropdown isOpen={visible} toggle={() => setVisible(!visible)}>
                                    <DropdownToggle outline color='primary' onClick={() => setVisible(!visible)} style={{ border: 0 }}>
                                        <HiShoppingCart size={24} />
                                        <Badge color='warning'>{cart.length}</Badge>
                                    </DropdownToggle>
                                    <DropdownMenu right style={{ maxHeight: "40vh", overflowY: "scroll", overflowX: "hidden" }}>
                                        {
                                            cart.length > 0 ?
                                                printCart()
                                                :
                                                <DropdownItem disabled style={{ border: 0 }}>
                                                    No Products
                                                </DropdownItem>
                                        }
                                    </DropdownMenu>
                                </Dropdown>
                                <Button className='p-2'
                                    outline color='danger'
                                    size='sm' style={{ height: "fit-content" }} onClick={() => dispatch(logoutAction())}>
                                    Logout
                                </Button>
                            </div>
                            <div className='order-1 d-flex align-items-center'>
                                <img className='shadow mx-4 rounded-circle' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGn_Y-UR4bB-Zj7XTbhjtRHjTgM_Fil22NQ0sCBz6Ul8_0L2gTzUjgqCMuJ_LTiMpqm0&usqp=CAU"
                                    width="70px" height="70px" alt="logo-brand" />
                                <h2 style={{ color: "#34495e" }}>Hai, <span style={{ color: "#0070F3" }}>{username}</span>
                                    <h2 >What do you want to shop today? ?</h2>
                                </h2>
                            </div>
                        </div>
                        :
                        <div>
                            <h2 className='order-1' style={{ color: "#34495e" }}>
                                Do you want to shop ?
                            </h2>
                            <Button outline color='primary' onClick={() => setModal(!modal)}>
                                Login &rarr;
                            </Button>
                            {/* <Link href="/" style={{ color: "#0070F3" }}> Login  &rarr;</Link> */}
                        </div>
                }
            </div>
        )
    }
    return (
        <div className='container mb-4' >
            <h2 className='text-muted loading-fade' >Welcome...</h2>
        </div>
    )
}

export default HeaderComp;