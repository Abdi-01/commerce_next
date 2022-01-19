const INITIAL_STATE = {
    id: null,
    username: "",
    email: "",
    role: "",
    status: "",
    photo: "",
    cart: [],
    wishlist: []
}

export const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            // console.log("direducer", action.payload)
            // console.log("test reducer", { ...state, ...action.payload })
            return { ...state, ...action.payload }
        case "LOGOUT":
            return INITIAL_STATE;
        case "UPDATE_CART_USER":
            return { ...state, cart: action.payload }
        case "UPDATE_WISHLIST_USER":
            return { ...state, wishlist: action.payload }
        default:
            return state
    }
}