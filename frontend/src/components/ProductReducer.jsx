/* eslint-disable no-param-reassign */
const ProductReducer = (state, action) => {
    console.log(state);
    console.log(action);
    if (action.type === 'set-products') {
        return { products: [...action.productList] };
    }
    if (action.type === 'add') {
        // eslint-disable-next-line no-param-reassign
        state = { ...state.products, products: action.products };
        console.log(state);
        return state;
    }
    if (action.type === 'edit') {
        console.log(state.products[action.index]);
        console.log('error');
        state.products[action.index] = { ...action.updatedProduct };
        console.log(state.products[action.index]);
        return state;
    }
    if (action.type === 'delete') {
        console.log('delte index');
        console.log(action.index);
        console.log(state.products[action.index]);
        const filteredData = state.products.filter((_val, index) => {
            if (index !== action.index) {
                return true;
            }
            return false;
        });
        state = { ...state, products: filteredData };
        console.log(filteredData);
        return state;
        // eslint-disable-next-line no-empty
    }
    return state;
};
export default ProductReducer;