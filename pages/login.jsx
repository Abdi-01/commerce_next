import axios from 'axios';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { FormGroup, Label, Input, InputGroup, InputGroupText, Button, Toast, ToastHeader, ToastBody } from 'reactstrap';
import HeadPage from '../components/headPage';
import { loginAction } from '../redux/actions';
import { API_URL } from './api/helper';

const LoginPage = (props) => {

    const dispatch = useDispatch()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [state, setState] = useState({
        logPassShow: "Show",
        logPassType: "password",
        toastOpen: false,
        toastHeader: "",
        toastMessage: "",
        toastIcon: ""
    })

    const { username, iduser } = useSelector((state) => {
        console.log("cek get data", state)
        return {
            username: state.userReducer.username,
            iduser: state.userReducer.id
        }
    });

    const onBtSubmit = () => {
        // console.log("data",username, email, password, confPassword)
        if (email == "" || password == "") {
            setState({
                ...state,
                toastOpen: true,
                toastHeader: "Login Warning",
                toastIcon: "warning",
                toastMessage: "Isi semua form"
            })
        } else {

            if (email.includes("@")) {
                axios.get(`${API_URL}/users?email=${email}&password=${password}`)
                    .then((response) => {
                        // setState({
                        //     ...state,
                        //     toastOpen: true,
                        //     toastHeader: "Register Status",
                        //     toastIcon: "success",
                        //     toastMessage: "Registrasi Berhasil ✅"
                        // })
                        if (response.data.length > 0) {
                            console.log("cek data login", response.data)
                            dispatch(loginAction(response.data[0]))
                            localStorage.setItem("next_commerce", JSON.stringify(response.data[0]))
                            // Redirect ke page products
                            // Router.push digunakan untuk mengganti path pada url route
                            Router.push('/products');
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
            } else {
                setState({
                    ...state,
                    toastOpen: true,
                    toastHeader: "Login Warning",
                    toastIcon: "warning",
                    toastMessage: "Email salah"
                })
            }
        }
    }

    const onBtShowPassLogin = () => {
        if (state.logPassType == "password") {
            setState({
                ...state,
                logPassShow: "Hide",
                logPassType: "text"
            })
        } else {
            setState({
                ...state,
                logPassShow: "Show",
                logPassType: "password"
            })
        }
    }

    useEffect(() => {
        if (iduser) {
            Router.push("/products")
        }
    })

    return (
        <div className="container p-5">
            <HeadPage
                title="Login"
                description="Login to start bought your needed"
                image=""
            />
            <span className="text-center p-5">
                <h1 className="mb-5">Login Account</h1>
                <p className="text-muted w-50 m-auto">Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Placeat aperiam quaerat perferendis ullam ducimus itaque, tempore, vel,
                    officia atque adipisci quas aliquid explicabo beatae accusamus iusto saepe earum nobis fugit?</p>
            </span>
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
            <div style={{ width: "20vw", margin: "auto", paddingTop: "5vh" }}>
                <FormGroup>
                    <Label for="textEmail">Email</Label>
                    <Input type="email" id="textEmail" placeholder="Example : edinson@mail.com"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="textPassword">Password</Label>
                    <InputGroup>
                        <Input type={state.logPassType} id="textPassword" placeholder="min. 6 Character"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputGroupText style={{ cursor: "pointer" }} onClick={onBtShowPassLogin}>
                            {state.logPassShow}
                        </InputGroupText>
                    </InputGroup>
                </FormGroup>
                <div>
                    <a className="btn btn-outline-secondary" href="/" style={{ width: "49%", marginRight: "1%" }}>&larr; Cancel</a>
                    <Button style={{ width: "49%", marginLeft: "1%" }} color="primary" onClick={onBtSubmit}>Login</Button>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;