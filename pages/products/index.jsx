// Contoh penerapan SSG (Static Site Generation) : program yang berupa JS langsung dijadikan sebagai html
import React from 'react';
import { Button, ButtonGroup, Card, CardBody, CardImg, CardTitle, Collapse, FormGroup, Input, InputGroup, InputGroupText, Label, Spinner } from 'reactstrap'
import axios from 'axios';
import { API_URL } from '../api/helper';
import Link from 'next/link';
import HeaderComp from '../../components/header';
import { connect } from 'react-redux';
import { loginAction, keepLogin, updateWishlist } from '../../redux/actions'
import HeadPage from '../../components/headPage';
import * as gtag from "../../lib/gtag"
import { HiArrowCircleDown, HiHeart, HiOutlineHeart } from 'react-icons/hi';
import Image from 'next/image';
class ProductsPage extends React.Component {
    constructor(props) {
        super(props);
        console
        this.state = {
            page: 1,
            loading: true,
            products: this.props.products,
            collapseFilter: false
        }
    }

    printProducts = () => {
        // console.log("test", this.props.products)
        let { page, products } = this.state
        if (products)
            return products.slice(page > 1 ? (page - 1) * 8 : page - 1, page * 8).map((value, index) => {
                let wishlistProduct = this.props.wishlist.findIndex(val => val.idProduct == value.id)
                console.log(wishlistProduct)
                return <div key={index} className="col-6 col-md-3 mt-3 ">
                    <Card className="shadow" style={{ border: "none", borderRadius: 20 }} onClick={() => gtag.event({
                        action: `view_product`,
                        category: value.kategori,
                        label: "detail_product",
                        value: value.nama,
                    })}>
                        <CardTitle className='bg-primary p-2' style={{ position: "absolute", right: 0, borderBottomLeftRadius: 20, borderTopRightRadius: 20, color: "white", opacity: 0.8 }}>Rp. {value.harga.toLocaleString()}</CardTitle>
                        <Link href={`/products/product-detail?id=${value.id}`}
                        >
                            <CardImg top
                                src={value.images[0]}
                                width="100%"
                                alt={`${value.nama}-${index}`}
                                className="shadow-sm"
                                style={{ borderRadius: 20 }}
                            />
                        </Link>
                        <CardBody>
                            <div>
                                <p className='text-muted d-none d-md-block m-0' style={{ fontSize: value.kategori.split(" ").length > 3 ? "0.58rem" : "0.7rem" }}>{value.kategori}</p>
                                <CardTitle tag="h6" style={{ fontWeight: "bolder" }}>{value.nama}</CardTitle>
                                <CardTitle tag="h3" className='' style={{ fontWeight: "bolder", position: "absolute", right: "5%", bottom: "5%", color: "#d63031" }}>
                                    {
                                        wishlistProduct >= 0 ?
                                            <HiHeart onClick={() => this.btWishlist(index, value.id)} />
                                            :
                                            <HiOutlineHeart onClick={() => this.btWishlist(index, value.id)} />
                                    }

                                </CardTitle>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            })

    }

    printBtPagination = () => {
        // 1-8 data => 1 button
        // 9-16 data => 2 button
        // 17-24 data => 3 button
        let btn = []
        // if (this.props.products)
        for (let i = 0; i < Math.ceil(this.state.products.length / 8); i++) {
            btn.push(<Button outline={this.state.page == i + 1 ? false : true} color='primary' className={`rounded shadow-sm m-1`}
                disabled={this.state.page == i + 1 ? true : false}
                onClick={() => this.setState({ page: i + 1 })}>
                {i + 1}
            </Button>)
        }

        return btn;
    }

    btWishlist = (idx, idProduct) => {
        let temp = [...this.props.wishlist]
        let checkProduct = temp.filter(val => val.idProduct == idProduct)
        if (checkProduct.length > 0) {
            temp.splice(temp.findIndex(val => val.idProduct == idProduct), 1)
        } else {
            temp.push({
                idProduct,
                idxProduct: idx
            })
        }

        this.props.updateWishlist(temp, this.props.idUser)
    }

    btSearch = () => {
        let dataFilter = this.state.products.filter((value, index) => {
            if (this.inSearchName.value && this.inSearchMax.value && this.inSearchMin.value) {
                return value.nama.includes(this.inSearchName.value) && value.harga >= parseInt(this.inSearchMin.value) && value.harga <= parseInt(this.inSearchMax.value)
            } else if (this.inSearchMax.value && this.inSearchMin.value) {
                return value.harga >= parseInt(this.inSearchMin.value) && value.harga <= parseInt(this.inSearchMax.value)
            } else if (this.inSearchName.value) {
                return value.nama.toLowerCase().includes(this.inSearchName.value.toLowerCase())
            }
        })
        this.setState({ page: 1, products: dataFilter })
    }

    btReset = () => {
        this.inSearchName.value = null
        this.inSearchMax.value = null
        this.inSearchMin.value = null
        this.setState({ page: 1, products: this.props.products })
    }

    handleSort = ({ target }) => {
        let field = target.value.split('-')[0];
        let sortType = target.value.split('-')[1];

        let temp = [...this.state.products]

        this.setState({
            page: 1, products:
                sortType == "asc" ?
                    temp.sort((a, b) => field == "nama"
                        ?
                        a[field].charCodeAt() - b[field].charCodeAt()
                        : a[field] - b[field])
                    :
                    temp.sort((a, b) => field == "nama"
                        ?
                        b[field].charCodeAt() - a[field].charCodeAt()
                        : b[field] - a[field])
        })
    }

    componentDidMount() {
        this.props.keepLogin()
    }

    render() {
        // console.log(window.location.href)
        return (
            <div className="pt-4 p-md-5">
                <HeadPage
                    title="Products"
                    description="All Products Collection by Commerce"
                    image=""
                    url={this.props.url}
                />
                <div className="container">
                    <HeaderComp />
                    <div className='row shadow rounded-lg ' style={{ height: "fit-content", borderRadius: 25 }}>
                        <div className="col-md-3 bg-white p-2 rounded mb-3" style={{ height: "fit-content" }}>
                            <div className='row m-auto' style={{ display: "flex", justifyContent: "space-around" }}>
                                <FormGroup className='col-md-12'>
                                    <Label>Nama</Label>
                                    <Input type="text" id="text" placeholder="Cari produk"
                                        innerRef={(element) => this.inSearchName = element} />
                                </FormGroup>
                                <a style={{ textAlign: "right", cursor: "pointer" }}
                                    onClick={() => this.setState({ collapseFilter: !this.state.collapseFilter })}
                                >
                                    Other Sort and Filter
                                    <HiArrowCircleDown /></a>
                                <Collapse isOpen={this.state.collapseFilter}>
                                    <FormGroup className='col-md-12'>
                                        <Label>Harga</Label>
                                        <div className="d-flex">
                                            <Input type="number" id="numb1" placeholder="Minimum"
                                                innerRef={(element) => this.inSearchMin = element} />
                                            <Input type="number" id="numb2" placeholder="Maksimum"
                                                innerRef={(element) => this.inSearchMax = element} />
                                        </div>
                                    </FormGroup>
                                    <FormGroup className='col-5 col-md-12'>
                                        <Label>Sort</Label>
                                        <Input type="select" onChange={this.handleSort}>
                                            <option value="harga-asc">Harga Asc</option>
                                            <option value="harga-desc">Harga Desc</option>
                                            <option value="nama-asc">A-Z</option>
                                            <option value="nama-desc">Z-A</option>
                                            {/* <option value="id-asc">Reset</option> */}
                                        </Input>
                                    </FormGroup>
                                </Collapse>
                                <div className="col-md-12 my-auto pt-3 pt-md-2" style={{ textAlign: "end" }}>
                                    <Button outline color="warning" onClick={this.btReset}>Reset</Button>
                                    <Button style={{ marginLeft: 16 }} color="primary" onClick={this.btSearch}>Filter</Button>
                                </div>
                            </div>
                            <div className="p-5 d-none d-md-block">
                                <Image
                                    className="shadow-sm bg-white rounded "
                                    src={require('../../assets/shopping.svg')}
                                    alt="product"
                                    layout='responsive'
                                    objectFit={'contain'}
                                />
                            </div>
                        </div>
                        <div className='col-md-9'>
                            <div className="row">
                                {this.printProducts()}
                            </div>
                            <div className="mt-3 mb-3 text-center">
                                <ButtonGroup>
                                    {
                                        this.printBtPagination()
                                    }
                                </ButtonGroup>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// Melakukan pengambilan data sebelum file component yang berupa js di generate menjadi static html
export const getStaticProps = async (ctx) => {
    try {

        let res = await axios.get(API_URL + "/products");
        return {
            props: {
                products: res.data, // data yang didapatkan akan masuk kedalam props
                // url: ctx.req.url
            },
            revalidate: 1 //untuk melakukan validasi ulang jika ada perubahan pada API
        }
    } catch (error) {
        console.log(error)
    }
}

const mapToProps = ({ userReducer }) => {
    return {
        idUser: userReducer.id,
        cart: userReducer.cart,
        wishlist: userReducer.wishlist
    }
}

export default connect(mapToProps, { loginAction, keepLogin, updateWishlist })(ProductsPage);