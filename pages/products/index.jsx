// Contoh penerapan SSG (Static Site Generation) : program yang berupa JS langsung dijadikan sebagai html
import React from 'react';
import { Button, ButtonGroup, Card, CardBody, CardImg, CardTitle, FormGroup, Input, InputGroup, InputGroupText, Label, Spinner } from 'reactstrap'
import axios from 'axios';
import { API_URL } from '../api/helper';
import Link from 'next/link';
import HeaderComp from '../../components/header';
import { connect } from 'react-redux';
import { loginAction, keepLogin } from '../../redux/actions'
import HeadPage from '../../components/headPage';

class ProductsPage extends React.Component {
    constructor(props) {
        super(props);
        console
        this.state = {
            page: 1,
            loading: true,
            products: this.props.products
        }
    }

    printProducts = () => {
        // console.log("test", this.props.products)
        let { page, products } = this.state
        if (products)
            return products.slice(page > 1 ? (page - 1) * 8 : page - 1, page * 8).map((value, index) => {
                return <div className="col-md-3 mt-3">
                    <Card className="shadow" style={{ border: "none" }}>
                        <Link href={`/products/product-detail?id=${value.id}`}
                            style={{ textDecoration: "none", color: "black" }}>
                            <CardImg top
                                src={value.images[0]}
                                width="100%"
                                alt={`${value.nama}-${index}`}
                                className="shadow-sm"
                            />
                        </Link>
                        <CardBody>
                            <div>
                                <p className='text-muted m-0'>{value.kategori}</p>
                                <CardTitle tag="h5" style={{ fontWeight: "bolder" }}>{value.nama}</CardTitle>
                                <CardTitle tag="h6" style={{}}>Rp. {value.harga.toLocaleString()}</CardTitle>
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
            btn.push(<Button outline color="primary"
                disabled={this.state.page == i + 1 ? true : false}
                onClick={() => this.setState({ page: i + 1 })}>
                {i + 1}
            </Button>)
        }

        return btn;
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
        return (
            <div className="pt-5">
                <HeadPage
                    title="Products"
                    description="All Products Collection by Commerce"
                    image=""
                />
                <div className="container">
                    <HeaderComp />
                    <div className="shadow bg-white p-2 rounded mb-3">
                        <div className='row m-auto' style={{ display: "flex", justifyContent: "space-around" }}>
                            <FormGroup className='col-md-2'>
                                <Label>Nama</Label>
                                <Input type="text" id="text" placeholder="Cari produk"
                                    innerRef={(element) => this.inSearchName = element} />
                            </FormGroup>
                            <FormGroup className='col-md-5'>
                                <Label>Harga</Label>
                                <div className="d-flex">
                                    <Input type="number" id="numb1" placeholder="Minimum"
                                        innerRef={(element) => this.inSearchMin = element} />
                                    <Input type="number" id="numb2" placeholder="Maksimum"
                                        innerRef={(element) => this.inSearchMax = element} />
                                </div>
                            </FormGroup>
                            <FormGroup className='col-md-2'>
                                <Label>Sort</Label>
                                <Input type="select" onChange={this.handleSort}>
                                    <option value="harga-asc">Harga Asc</option>
                                    <option value="harga-desc">Harga Desc</option>
                                    <option value="nama-asc">A-Z</option>
                                    <option value="nama-desc">Z-A</option>
                                    {/* <option value="id-asc">Reset</option> */}
                                </Input>
                            </FormGroup>
                            <div className="col-md-3 my-auto pt-2" style={{ textAlign: "end" }}>
                                <Button outline color="warning" onClick={this.btReset}>Reset</Button>
                                <Button style={{ marginLeft: 16 }} color="primary" onClick={this.btSearch}>Filter</Button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {this.printProducts()}
                    </div>
                    <div className="my-5 text-center">
                        <ButtonGroup>
                            {
                                this.printBtPagination()
                            }
                        </ButtonGroup>
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
                products: res.data // data yang didapatkan akan masuk kedalam props
            },
            revalidate: 1 //untuk melakukan validasi ulang jika ada perubahan pada API
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

export default connect(mapToProps, { loginAction, keepLogin })(ProductsPage);