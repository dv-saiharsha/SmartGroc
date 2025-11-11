import React, { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const initialState = {
  items: [],
  total: 0,
  itemCount: 0
}

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return action.payload
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      let updatedItems
      
      if (existingItem) {
        updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
      } else {
        updatedItems = [...state.items, action.payload]
      }
      
      const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return { items: updatedItems, total, itemCount }
    }
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload)
      const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return { items: updatedItems, total, itemCount }
    }
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0)
      
      const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return { items: updatedItems, total, itemCount }
    }
    case 'CLEAR_CART':
      return initialState
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) })
    }
  }, [])

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(state))
  }, [state])

  const addItem = (product, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      }
    })
  }

  const removeItem = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId })
  }

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}