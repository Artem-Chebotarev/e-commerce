import {
  ADD_GOOD,
  DELETE_GOOD,
  GET_GOOD,
  GET_GOODS,
  FILTER_GOODS,
  FILTER_GOODS_SAGA,
  SELLER_ADD_GOOD,
} from "../types/goodTypes";

export const getGoods = (goods) => {
  return {
    type: GET_GOODS,
    payload: goods,
  };
};

export const getGood = (good) => {
  return {
    type: GET_GOOD,
    payload: good,
  };
};

export const addGood = (good) => {
  return {
    type: ADD_GOOD,
    payload: good,
  };
};

export const deleteGood = (good) => {
  return {
    type: DELETE_GOOD,
    payload: good,
  };
};

export const getGoodsFromServer = (id, sorting, searchResult) => {
  if (searchResult) {
    if (sorting === "price") {
      return (dispatch) =>
        dispatch(getGoods(searchResult.sort((a, b) => a.price - b.price)));
    } else if (sorting === "price_desc") {
      return (dispatch) =>
        dispatch(getGoods(searchResult.sort((a, b) => b.price - a.price)));
    } else if (sorting === "rating") {
      return (dispatch) =>
        dispatch(getGoods(searchResult.sort((a, b) => b.rating - a.rating)));
    } else
      return (dispatch) =>
        dispatch(getGoods(searchResult.sort((a, b) => a.price - b.price)));
  } else {
    if (sorting === "price") {
      return (dispatch) => {
        fetch(`http://localhost:3001/api/v1/categories/${id}`)
          .then((response) => response.json())
          .then((goodsFromServer) =>
            dispatch(
              getGoods(goodsFromServer.sort((a, b) => a.price - b.price))
            )
          );
      };
    } else if (sorting === "price_desc") {
      return (dispatch) => {
        fetch(`http://localhost:3001/api/v1/categories/${id}`)
          .then((response) => response.json())
          .then((goodsFromServer) =>
            dispatch(
              getGoods(goodsFromServer.sort((a, b) => b.price - a.price))
            )
          );
      };
    } else if (sorting === "rating") {
      return (dispatch) => {
        fetch(`http://localhost:3001/api/v1/categories/${id}`)
          .then((response) => response.json())
          .then((goodsFromServer) =>
            dispatch(
              getGoods(goodsFromServer.sort((a, b) => b.rating - a.rating))
            )
          );
      };
    } else
      return (dispatch) => {
        fetch(`http://localhost:3001/api/v1/categories/${id}`)
          .then((response) => response.json())
          .then((goodsFromServer) =>
            dispatch(
              getGoods(goodsFromServer.sort((a, b) => a.price - b.price))
            )
          );
      };
  }
};

export const getGoodDetailsFromServer = (id) => {
  return (dispatch) => {
    fetch(`http://localhost:3001/api/v1/goods/${id}`)
      .then((response) => response.json())
      .then((oneGoodFromServer) => dispatch(getGood(oneGoodFromServer)));
  };
};

export const filterGoods = (input) => ({
  type: FILTER_GOODS,
  payload: input,
});

export const filterGoodsSaga = (input) => ({
  type: FILTER_GOODS_SAGA,
  payload: input,
});

export const sellerAddGood = (newGood) => {
  return {
    type: SELLER_ADD_GOOD,
    payload: newGood,
  };
};

export const sellerAddGoodToServer = ({
  name,
  quantity,
  price,
  description,
  category,
  photo,
  rating
}) => {
  return (
    fetch('http://localhost:3001/api/v1/add_new_good', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        name,
        quantity,
        price,
        description,
        category,
        photo,
        rating
      })
    }).then(response => response.status === 200 ? console.log('Ответ с сервера 200: товар добавлен ') : console.log('Ответ с сервера 500: товар не добавлен')) 
  )
};
