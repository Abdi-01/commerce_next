import axios from "axios"
import { API_URL } from "../../pages/api/helper"

export const loginAction = (data) => {
    return {
        type: "LOGIN_SUCCESS",
        payload: data
    }
}

export const logoutAction = () => {
    localStorage.removeItem("next_commerce")
    return {
        type: "LOGOUT"
    }
}

export const keepLogin = () => {
    return async (dispatch, getState) => {
        try {
            let token = JSON.parse(localStorage.getItem("next_commerce"));
            if (token.id) {
                let res = await axios.get(`${API_URL}/users?id=${token.id}`)
                dispatch({
                    type: "LOGIN_SUCCESS",
                    payload: res.data[0]
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export const updateUserCart = (data, iduser) => {
    return async (dispatch, getState) => {
        try {
            // console.log("test")
            let res = await axios.patch(`${API_URL}/users/${iduser}`, {
                cart: data
            })

            dispatch({
                type: "UPDATE_CART_USER",
                payload: res.data.cart
            })

            return { success: true, message: "Add to cart success" }

        } catch (error) {
            console.log(error)
        }
    }
}

export const updateWishlist = (data, iduser) => {
    return async (dispatch, getState) => {
        try {
            // console.log("test")
            let res = await axios.patch(`${API_URL}/users/${iduser}`, {
                wishlist: data
            })

            dispatch({
                type: "UPDATE_WISHLIST_USER",
                payload: res.data.wishlist
            })

            return { success: true, message: "Add to cart success" }

        } catch (error) {
            console.log(error)
        }
    }
}