

import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {
    const { filteredFoodList, searchQuery } = useContext(StoreContext);

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near you</h2>
            {searchQuery && (
                <p className="search-results-info">
                    Showing results for: <strong>"{searchQuery}"</strong>
                    {filteredFoodList.length === 0 && " - No items found"}
                </p>
            )}
            <div className="food-display-list">
                {filteredFoodList.map((item, index) => {
                    if (category === "All" || category === item.category) {
                        return (
                            <FoodItem
                                key={index}
                                id={item._id}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                image={item.image}
                            />
                        )
                    }
                    return null;
                })}
            </div>
        </div>
    )
}

export default FoodDisplay