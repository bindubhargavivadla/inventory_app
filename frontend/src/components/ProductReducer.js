const ProductReducer = (state, action) => {
    console.log(state);
    console.log(action);
    if (action.type === 'set-products') {
        return { products: [...action.productList] };
    } else if (action.type == 'add') {
        state = { ...state.products, products: action.products };
        console.log(state);
        return state;
    } else if (action.type == 'edit') {
        console.log(state.products[action.index]);
        console.log('error');
        state.products[action.index] = { ...action.updatedProduct };
        console.log(state.products[action.index]);
        return state;
    } else if (action.type == 'delete') {
        console.log('delte index');
        console.log(action.index);
        console.log(state.products[action.index]);
        let filteredData = state.products.filter((val, index) => {
            if (index !== action.index) {
                return true;
            }
            return false;
        });
        state = { ...state, products: filteredData };
        console.log(filteredData);
        return state;
    } else if (action.type == 'checkToken') {
    } else {
        return state;
    }
};
export default ProductReducer;
