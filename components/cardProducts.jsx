import React, { memo } from 'react';
import { Button, ButtonGroup, Card, CardBody, CardImg, CardTitle, Collapse, FormGroup, Input, InputGroup, InputGroupText, Label, Spinner } from 'reactstrap'
import { HiArrowCircleDown, HiHeart, HiOutlineHeart } from 'react-icons/hi';
import Image from 'next/image';
import Link from 'next/link';
import * as gtag from "../lib/gtag";

const CardProducts = memo(({ products, btWishlist, page, wishlist }) => {
    console.log("Rerender Products ❌")

    const printProducts = () => {
        return products.slice(page > 1 ? (page - 1) * 8 : page - 1, page * 8).map((value, index) => {
            let wishlistProduct = wishlist.findIndex(val => val.idProduct == value.id)

            return <div key={index} className="col-6 col-md-3 mt-3 ">
                <Card className="shadow" style={{ border: "none", borderRadius: 20 }} onClick={() => gtag.event({
                    action: `view_product`,
                    category: value.kategori,
                    label: "detail_product",
                    value: value.nama,
                })}>
                    <CardTitle className='bg-primary p-2'
                        style={{
                            position: "absolute",
                            zIndex:1,
                            right: 0,
                            borderBottomLeftRadius: 20,
                            borderTopRightRadius: 20,
                            color: "white",
                            opacity: 0.8
                        }}>
                        Rp. {value.harga.toLocaleString()}
                    </CardTitle>
                    <Link href={`/products/product-detail?id=${value.id}`}
                    >
                        {/* <CardImg top
                            src={value.images[0]}
                            width="100%"
                            className="shadow-sm"
                            style={{ borderRadius: 20 }}
                            /> */}
                        <Image
                            className="shadow-sm bg-white rounded"
                            loader={({ src }) => {
                                return value.images[0]
                            }}
                            src="image-link"
                            alt={`${value.nama}-${index}`}
                            width="100%"
                            height="100%"
                            layout='responsive'
                            objectFit={'contain'}
                        />
                    </Link>
                    <CardBody>
                        <div>
                            <p className='text-muted d-none d-md-block m-0' style={{ fontSize: value.kategori.split(" ").length > 3 ? "0.58rem" : "0.7rem" }}>{value.kategori}</p>
                            <CardTitle tag="h6" style={{ fontWeight: "bolder" }}>{value.nama}</CardTitle>
                            <CardTitle tag="h3" className='' style={{ fontWeight: "bolder", position: "absolute", right: "5%", bottom: "5%", color: "#d63031" }}>
                                {
                                    wishlistProduct >= 0 ?
                                        <HiHeart onClick={() => btWishlist(index, value.id)} />
                                        :
                                        <HiOutlineHeart onClick={() => btWishlist(index, value.id)} />
                                }

                            </CardTitle>
                        </div>
                    </CardBody>
                </Card>
            </div>
        })
    }

    return <div className="row">
        {printProducts()}
    </div>
})

export default CardProducts;