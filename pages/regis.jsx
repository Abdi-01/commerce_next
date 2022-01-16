import React, { useState } from 'react';
import axios from 'axios';
import Router from 'next/router'; // library routing dari next js sehingga tidak perlu menggunakan react router dom
import { FormGroup, Label, Input, InputGroup, InputGroupText, Button, Toast, ToastHeader, ToastBody } from 'reactstrap';
import { API_URL } from './api/helper';
import HeadPage from '../components/headPage';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const RegisPage = (props) => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confPassword, setConfPassword] = useState('')

    const [state, setState] = useState({
        regPassShow: "Show",
        regPassType: "password",
        toastOpen: false,
        toastHeader: "",
        toastMessage: "",
        toastIcon: ""
    })



    const onBtSubmit = () => {
        // console.log("data",username, email, password, confPassword)
        if (username == "" || email == "" || password == "" || confPassword == "") {
            setState({
                ...state,
                toastOpen: true,
                toastHeader: "Register Warning",
                toastIcon: "warning",
                toastMessage: "Isi semua form"
            })
        } else {
            if (password == confPassword) {
                if (email.includes("@")) {
                    axios.post(`${API_URL}/users`, {
                        username,
                        email,
                        password,
                        role: "user",
                        status: "Active",
                        photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsdD1rK4ZtCJVizS00LaWifgJnY-wzSVBoHw&usqp=CAU",
                        cart: [],
                        wishlist: []
                    }).then((response) => {
                        // setState({
                        //     ...state,
                        //     toastOpen: true,
                        //     toastHeader: "Register Status",
                        //     toastIcon: "success",
                        //     toastMessage: "Registrasi Berhasil ✅"
                        // })
                        // Router.back();// back to previous page
                        props.btCancel()
                        setUsername("")
                        setEmail("")
                        setPassword("")
                        setConfPassword("")
                    }).catch((err) => {
                        console.log(err)
                    })
                } else {
                    setState({
                        ...state,
                        toastOpen: true,
                        toastHeader: "Register Warning",
                        toastIcon: "warning",
                        toastMessage: "Email salah"
                    })
                }
            } else {
                setState({
                    ...state,
                    toastOpen: true,
                    toastHeader: "Register Warning",
                    toastIcon: "warning",
                    toastMessage: "Password tidak sesuai"
                })
            }
        }
    }

    const onBtShowPassRegis = () => {
        if (state.regPassType == "password") {
            setState({
                ...state,
                regPassShow: "Hide",
                regPassType: "text"
            })
        } else {
            setState({
                ...state,
                regPassShow: "Show",
                regPassType: "password"
            })
        }
    }

    return (
        <div className='row m-0'>
            {/* <div className="col-md-3 p-5 m-auto"> */}
                {/* <HeadPage
                    title="Register"
                    description="Create your account for shopping"
                    image=""
                /> */}
                {/* <span className="text-center p-5">
                    <h1 className="mb-5">Register Account</h1>
                    <p className="text-muted m-auto">Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Placeat aperiam quaerat perferendis ullam ducimus itaque, tempore, vel.</p>
                </span> */}
                <div>
                    <Toast isOpen={state.toastOpen} style={{ position: "fixed", top: "2vh", right: 0, marginRight: 12 }}>
                        <ToastHeader icon={state.toastIcon} toggle={() => setState({ ...state, toastOpen: false })}>
                            {state.toastHeader}
                        </ToastHeader>
                        <ToastBody>
                            {state.toastMessage}
                        </ToastBody>
                    </Toast>
                </div>
                <div style={{ margin: "auto" }}>
                    <FormGroup>
                        <Label for="textUsername">Username</Label>
                        <Input type="text" id="textUsername" placeholder="Example : August01"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="textEmail">Email</Label>
                        <Input type="email" id="textEmail" placeholder="Example : edinson@mail.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="textPassword">Password</Label>
                        <InputGroup>
                            <Input type={state.regPassType} id="textPassword" placeholder="min. 6 Character"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <InputGroupText style={{ cursor: "pointer" }} onClick={onBtShowPassRegis}>
                            {
                                    state.regPassShow == "Show" ?
                                        <HiEye />
                                        :
                                        <HiEyeOff />
                                }
                            </InputGroupText>
                        </InputGroup>
                    </FormGroup>
                    <FormGroup>
                        <Label for="textPassword">Confirmation Password</Label>
                        <InputGroup>
                            <Input type={state.regPassType} id="textPassword" placeholder="min. 6 Character"
                                onChange={(e) => setConfPassword(e.target.value)}
                            />
                            <InputGroupText style={{ cursor: "pointer" }} onClick={onBtShowPassRegis}>
                            {
                                    state.regPassShow == "Show" ?
                                        <HiEye />
                                        :
                                        <HiEyeOff />
                                }
                            </InputGroupText>
                        </InputGroup>
                    </FormGroup>
                    <div>
                        <a className="btn btn-outline-secondary" style={{ width: "49%", marginRight: "1%" }} onClick={props.btCancel}>&larr; Cancel</a>
                        <Button style={{ width: "49%", marginLeft: "1%" }} color="primary" onClick={onBtSubmit}>Submit</Button>
                    </div>
                </div>
            {/* </div> */}
        </div>
    )
}

export default RegisPage;