// Contoh penerapan SSG (Static Site Generation) : program yang berupa JS langsung dijadikan sebagai html
import React, { useCallback, useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import CardProducts from '../../components/cardProducts';
import ButtonPagination from '../../components/pagination';

const ProductsPage = (props) => {
    const dispatch = useDispatch();

    const { idUser, cart, wishlist } = useSelector(({ userReducer }) => {
        return {
            idUser: userReducer.id,
            cart: userReducer.cart,
            wishlist: userReducer.wishlist
        }
    })

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState(props.products);
    const [collapse, setCollapse] = useState(true);
    const [inSearchMin, setInSearchMin] = useState(null);
    const [inSearchMax, setInSearchMax] = useState(null);
    const [inSearchName, setInSearchName] = useState("");

    useEffect(() => {
        dispatch(keepLogin())
    }, [])

    const changePage = useCallback((i) => {
        console.log("Rerender changePagination ❌")
        setPage(i + 1)
    }, [])

    const collapseFilter = () => {
        setCollapse(!collapse)
    }

    const btWishlist = useCallback((idx, idProduct) => {
        console.log("Rerender BtWishlist ❌")
        let temp = [...wishlist]
        let checkProduct = temp.filter(val => val.idProduct == idProduct)
        if (checkProduct.length > 0) {
            temp.splice(temp.findIndex(val => val.idProduct == idProduct), 1)
        } else {
            temp.push({
                idProduct,
                idxProduct: idx
            })
        }

        dispatch(updateWishlist(temp, idUser))
    }, [wishlist])

    const btSearch = () => {
        console.log("Rerender BtSearch ❌")
        let dataFilter = products.filter((value, index) => {
            if (inSearchName && inSearchMax && inSearchMin) {
                return value.nama.includes(inSearchName) && value.harga >= parseInt(inSearchMin) && value.harga <= parseInt(inSearchMax)
            } else if (inSearchMax && inSearchMin) {
                return value.harga >= parseInt(inSearchMin) && value.harga <= parseInt(inSearchMax)
            } else if (inSearchName) {
                return value.nama.toLowerCase().includes(inSearchName.toLowerCase())
            }
        });
        setPage(1);
        setProducts(dataFilter);
    }

    const btReset = () => {
        console.log("Rerender BtReset ❌")
        setInSearchName("")
        setInSearchMax(null)
        setInSearchMin(null)
        setPage(1);
        setProducts(props.products);
    }

    const handleSort = useCallback(({ target }) => {
        let field = target.value.split('-')[0];
        let sortType = target.value.split('-')[1];

        let temp = [...products]

        setPage(1);
        setProducts(sortType == "asc" ?
            temp.sort((a, b) => field == "nama"
                ?
                a[field].charCodeAt() - b[field].charCodeAt()
                : a[field] - b[field])
            :
            temp.sort((a, b) => field == "nama"
                ?
                b[field].charCodeAt() - a[field].charCodeAt()
                : b[field] - a[field])
        );
    }, [])

    return (
        <div className="pt-4 p-md-5">
            <HeadPage
                title="Products"
                description="All Products Collection by Commerce"
                image=""
                url={props.url}
            />
            <div className="container">
                <HeaderComp />
                <div className='row shadow rounded-lg ' style={{ height: "fit-content", borderRadius: 25 }}>
                    <div className="col-md-3 bg-white p-2 rounded mb-3" style={{ height: "fit-content" }}>
                        <div className='row m-auto' style={{ display: "flex", justifyContent: "space-around" }}>
                            <FormGroup className='col-md-12'>
                                <Label>Nama</Label>
                                <Input type="text" id="text" placeholder="Cari produk"
                                    onChange={(e) => setInSearchName(e.target.value)} />
                            </FormGroup>
                            <a style={{ textAlign: "right", cursor: "pointer" }}
                                onClick={collapseFilter}
                            >
                                Other Sort and Filter
                                <HiArrowCircleDown /></a>
                            <Collapse isOpen={collapse}>
                                <FormGroup className='col-md-12'>
                                    <Label>Harga</Label>
                                    <div className="d-flex">
                                        <Input type="number" id="numb1" placeholder="Minimum"
                                            onChange={(e) => setInSearchMin(e.target.value)} />
                                        <Input type="number" id="numb2" placeholder="Maksimum"
                                            onChange={(e) => setInSearchMax(e.target.value)} />
                                    </div>
                                </FormGroup>
                                <FormGroup className='col-5 col-md-12'>
                                    <Label>Sort</Label>
                                    <Input type="select" onChange={handleSort}>
                                        <option value="harga-asc">Harga Asc</option>
                                        <option value="harga-desc">Harga Desc</option>
                                        <option value="nama-asc">A-Z</option>
                                        <option value="nama-desc">Z-A</option>
                                        {/* <option value="id-asc">Reset</option> */}
                                    </Input>
                                </FormGroup>
                            </Collapse>
                            <div className="col-md-12 my-auto pt-3 pt-md-2" style={{ textAlign: "end" }}>
                                <Button outline color="warning" onClick={btReset}>Reset</Button>
                                <Button style={{ marginLeft: 16 }} color="primary" onClick={btSearch}>Filter</Button>
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
                        <CardProducts
                            products={products}
                            btWishlist={btWishlist}
                            page={page}
                            wishlist={wishlist}
                        />
                        <div className="mt-3 mb-3 text-center">
                            <ButtonPagination
                                page={page}
                                changePage={changePage}
                                products={products}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
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


export default ProductsPage;