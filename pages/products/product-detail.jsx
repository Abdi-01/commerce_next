// Contoh penerapan SSR (Server Side Rendering) : program yang berupa JS akan dijadikan sebagai html ketika ada request dari client
import React from 'react';
import axios from 'axios';
import { Button, Collapse, Input, Toast, ToastBody, ToastHeader } from 'reactstrap';
import { API_URL } from '../api/helper';
import Image from 'next/image';
import HeadPage from '../../components/headPage';
import { connect } from 'react-redux';
import { updateUserCart } from '../../redux/actions';
import Router from 'next/router';

class ProductDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detail: {},
            thumbnail: 0,
            openType: false,
            qty: 1,
            selectedType: {},
            toastOpen: false,
            toastMsg: "",
            redirect: false
        }
    }

    renderImages = () => {
        let { images } = this.props.detail
        return images.map((item, index) => {
            // Konfigurasi Image dari nextJs, format dibawah ini digunakan untuk gambar yang diambil dari external URL
            // adanya atribute loader untuk meletakkan url image external
            return (
                <div className='col-3 col-md-12 p-md-0 m-md-0'>
                    <Image
                        className={`select-image mb-1 bg-white rounded ${this.state.thumbnail == index && "image-underline"}`}
                        loader={({ src }) => {
                            return `${item}`
                        }}
                        key={index}
                        src="image-link"
                        alt="product"
                        width="100%%"
                        height="100%"
                        layout='responsive'
                        objectFit={'contain'}
                        onClick={() => this.setState({ thumbnail: index })}
                        style={{ borderBottom: this.state.thumbnail == index && "3px solid #407AB1" }}
                    />
                </div>
            )
        })
    }

    onBtDec = () => {
        if (this.state.qty > 1) {
            this.setState({ qty: this.state.qty -= 1 })
        }
    }

    onBtInc = () => {
        if (this.state.selectedType.qty) {
            if (this.state.qty < this.state.selectedType.qty) {
                this.setState({ qty: this.state.qty += 1 })
            } else {
                this.setState({ toastOpen: !this.state.toastOpen, toastMsg: "Stok produk tidak cukup" })
            }
        } else {
            this.setState({ toastOpen: !this.state.toastOpen, toastMsg: "Pilih tipe produk terlebih dahulu" })
        }
    }

    onBtAddToCart = async () => {
        let { selectedType, qty } = this.state
        let { detail } = this.props
        if (selectedType.type) {
            let dataCart = {
                image: detail.images[0],
                nama: detail.nama,
                brand: detail.brand,
                harga: detail.harga,
                type: selectedType.type,
                qty
            }

            // menggabungkan data cart sebelumnya dari reducer, dengan dataCart baru yg akan ditambahkan
            let temp = [...this.props.cart];
            temp.push(dataCart);

            if (this.props.iduser) {
                let res = await this.props.updateUserCart(temp, this.props.iduser);
                if (res.success) {
                    Router.push("/products")
                }
            } else {
                this.setState({ toastOpen: !this.state.toastOpen, toastMsg: "Silahkan Login Terlebih Dahulu" })
            }

        } else {
            this.setState({ toastOpen: !this.state.toastOpen, toastMsg: "Pilih tipe produk terlebih dahulu" })
        }
    }

    render() {
        // console.log("cek url", window.location.href)
        return (
            <div>
                <HeadPage
                    title={this.props.detail.nama}
                    description={this.props.detail.deskripsi.split(".")[0]}
                    image={this.props.detail.images[this.state.thumbnail]}
                    url={this.props.url}
                />
                <div>
                    <Toast isOpen={this.state.toastOpen} style={{ position: "fixed", right: 10, zIndex: 10 }}>
                        <ToastHeader icon="warning"
                            toggle={() => this.setState({ toastOpen: false, toastMsg: "" })}>
                            Add to cart warning
                        </ToastHeader>
                        <ToastBody>
                            {this.state.toastMsg}
                        </ToastBody>
                    </Toast>
                </div>
                <div className="container row p-2 p-md-5 m-auto shadow bg-white rounded mt-4">
                    {
                        this.props.detail.id &&
                        <>
                            <div className="col-md-8 row text-center p-3 p-md-2 mb-3 mb-md-0">
                                {/* Jika gambar dari external */}

                                <div className='col-10 order-md-2 mb-2 mb-md-0'>
                                    <Image
                                        className="shadow-sm bg-white rounded"
                                        loader={({ src }) => {
                                            return `${this.props.detail.images[this.state.thumbnail]}`
                                        }}
                                        src="image-link"
                                        alt="product"
                                        width="50%"
                                        height="50%"
                                        layout='responsive'
                                        objectFit={'contain'}
                                    />
                                </div>
                                <div className="col-md-2 order-md-1 row">
                                    {this.renderImages()}
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div style={{ borderBottom: '1.5px solid gray' }}>
                                    <h6 className="text-muted">{this.props.detail.kategori}</h6>
                                    <h4 style={{ fontWeight: 'bolder' }}>{this.props.detail.nama}</h4>
                                    <h2 style={{ fontWeight: 'bolder' }}>Rp {this.props.detail.harga.toLocaleString()}</h2>
                                </div>
                                <div style={{ borderBottom: '1.5px solid gray' }}>
                                    <div
                                        style={{ cursor: 'pointer', fontWeight: 'bold' }}
                                        onClick={() => this.setState({ openType: !this.state.openType })}>
                                        Type: {this.state.selectedType.type}</div>
                                    <Collapse isOpen={this.state.openType}>
                                        {
                                            this.props.detail.stock.map((item, index) => {
                                                return (
                                                    <div>
                                                        <Button outline color="secondary" size="sm"
                                                            style={{ width: '100%', border: 'none', textAlign: 'left' }}
                                                            onClick={() => this.setState({ selectedType: item, qty: 1 })}
                                                        > {item.type} : {item.qty}</Button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </Collapse>
                                </div>
                                <p className="my-3" style={{ textAlign: "justify" }}>
                                    {this.props.detail.deskripsi}
                                </p>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span>Jumlah :</span>
                                    <span style={{ width: '30%', display: 'flex', alignItems: 'center' }}>
                                        <span className="material-icons" style={{ cursor: 'pointer' }} onClick={this.onBtDec}>
                                            remove
                                        </span>
                                        <Input size="sm" placeholder="qty" value={this.state.qty} style={{ width: "40%", display: 'inline-block' }} />
                                        <span className="material-icons" style={{ cursor: 'pointer' }} onClick={this.onBtInc}>
                                            add
                                        </span>
                                    </span>
                                </div>
                                <Button type="button" color="warning" style={{ width: '100%' }} onClick={this.onBtAddToCart}>Add to cart</Button>
                            </div>
                        </>
                    }
                </div>
            </div>
        );
    }
}

// Melakukan pengambilan data ketika user request dan kemudian file component yang berupa js di generate menjadi static html didalam server
export const getServerSideProps = async (ctx) => {
    try {
        // console.log("context cek", ctx); // berisi data informasi req page dari client atau front end
        // console.log("Data context", ctx.req.url);
        let res = await axios.get(API_URL + `/products?${ctx.req.url.split("?")[1]}`)
        console.log(res.data)

        return {
            props: {
                url: ctx.req.url,
                detail: res.data[0]
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const mapToProps = ({ userReducer }) => {
    return {
        iduser: userReducer.id,
        cart: userReducer.cart
    }
}

export default connect(mapToProps, { updateUserCart })(ProductDetail);