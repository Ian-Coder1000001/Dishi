

import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "https://dishi-backend-ppkp.onrender.com"
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredFoodList, setFilteredFoodList] = useState([]);

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } })
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } })
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data);
        setFilteredFoodList(response.data.data); // Initialize filtered list with all items
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
        setCartItems(response.data.cartData);
    }

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setFilteredFoodList(food_list);
        } else {
            const filtered = food_list.filter(item =>
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.description.toLowerCase().includes(query.toLowerCase()) ||
                item.category.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredFoodList(filtered);
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }, [])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        searchQuery,
        setSearchQuery,
        handleSearch,
        filteredFoodList
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
