import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { Badge, Button, Dropdown, Input, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { logoutAction } from '../redux/actions';
import { HiShoppingCart } from "react-icons/hi";
import Link from 'next/link';

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

    useEffect(() => {
        console.log("logout", username)
        // if (!username) {
        //     Router.push('/')
        // }
    })

    const printCart = () => {
        return cart.map((value, index) => {
            return (
                <DropdownItem key={index} style={{ width: "25vw", padding: 5 }}>
                    <div className="shadow-sm p-1 bg-white rounded" >
                        <div className='row'>
                            <div className="col-6 col-lg-2">
                                <img src={value.image} width="100%" />
                            </div>
                            <div className="col-6 col-lg-6 d-flex justify-content-center flex-column">
                                <p style={{ fontWeight: 'bolder', fontSize: 12, margin: 0 }}>{value.nama} | <p style={{ fontWeight: 'bolder', fontSize: 12, margin: 0 }}>{value.type}</p></p>
                                <p style={{ fontWeight: 'bolder', fontSize: 12 }}>Rp {value.harga.toLocaleString()}</p>
                            </div>
                            <div className="col-md-4 d-flex align-items-center ">
                                <div className="d-none d-lg-block">
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: "center", width: "fit-content" }}>
                                        <span className="material-icons" style={{ cursor: 'pointer' }} onClick={() => this.onBtDec(index)}>
                                            remove
                                        </span>
                                        <Input placeholder="qty" value={value.qty} style={{ width: "50%", display: 'inline-block', textAlign: 'center' }} />
                                        <span className="material-icons" style={{ cursor: 'pointer' }} onClick={() => this.onBtInc(index)}>
                                            add
                                        </span>
                                    </span>
                                    <p className='text-center w-100'>Rp {(value.harga * value.qty).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <Button outline size='sm' color="warning" style={{ width: "100%" }} onClick={() => this.onBtRemove(index)}>Remove</Button>
                    </div>
                </DropdownItem>
            )
        })
    }

    setTimeout(() => setLoading(true), 2000)

    if (loading) {
        return (
            <div className='mb-4'>
                {
                    iduser ?
                        <div className='d-md-flex justify-content-between align-items-center'>
                            <div className="d-flex justify-content-end order-md-2">
                                <UncontrolledDropdown>
                                    <DropdownToggle outline color='primary' style={{ border: 0 }}>
                                        <HiShoppingCart size={24} />
                                        <Badge color='warning'>{cart.length}</Badge>
                                    </DropdownToggle>
                                    <DropdownMenu right >
                                        {
                                            cart.length > 0 ?
                                                printCart()
                                                :
                                                <DropdownItem disabled style={{ border: 0 }}>
                                                    No Products
                                                </DropdownItem>
                                        }
                                    </DropdownMenu>
                                </UncontrolledDropdown>
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
                                    <h2 >Mau belanja apa hari ini ?</h2>
                                </h2>
                            </div>
                        </div>
                        :
                        <div>
                            <h2 className='order-1' style={{ color: "#34495e" }}>
                                Mau belanja apa hari ini ?
                            </h2>
                            <Link href="/" style={{ color: "#0070F3" }}>Silahkan Login  &rarr;</Link>
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