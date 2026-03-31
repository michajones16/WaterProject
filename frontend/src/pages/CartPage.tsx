import { useNavigate } from "react-router-dom";
import type { CartItem } from "../types/CartItem";
import { useCart } from "../context/CartContext";

function CartPage () {
    const navigate = useNavigate();
    const {cart, removeFromCart} = useCart();

    return (
        <>
            <h2>Your Cart</h2>
            <div>
                {cart.length === 0 ? (
                <p>Your cart is empty</p>
                ) : (
                    <ul>
                        {cart.map((item: CartItem) => (
                            <li key={item.projectId}>
                                {item.projectName}: 
                                ${item.donationAmount.toFixed(2)}
                                <button onClick={() => removeFromCart(item.projectId)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <h3>Total: </h3>
            <button>Checkout</button>
            <button onClick={() => navigate('/projects')}>Continue Browsing</button>
        </>
    )
}

export default CartPage;