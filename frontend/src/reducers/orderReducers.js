import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_RESET,
  MY_ORDER_LIST_REQUEST,
  MY_ORDER_LIST_SUCCESS,
  MY_ORDER_LIST_FAIL,
  MY_ORDER_LIST_RESET,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_SHIPPED_REQUEST,
  ORDER_SHIPPED_SUCCESS,
  ORDER_SHIPPED_FAIL,
  ORDER_SHIPPED_RESET,
  ORDER_DELIVERY_REQUEST,
  ORDER_DELIVERY_SUCCESS,
  ORDER_DELIVERY_FAIL,
  ORDER_DELIVERY_RESET,
  ORDER_UPDATE_TRACKING_REQUEST,
  ORDER_UPDATE_TRACKING_SUCCESS,
  ORDER_UPDATE_TRACKING_FAIL,
  ORDER_UPDATE_TRACKING_RESET,
} from '../constants/orderConstants';

export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return {
        loading: true,
      };
    case ORDER_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        order: action.payload,
      };
    case ORDER_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const orderDetailsReducer = (
  state = { loading: true, orderItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ORDER_DETAILS_SUCCESS:
      return {
        loading: false,
        order: action.payload,
      };
    case ORDER_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const orderPayReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_PAY_REQUEST:
      return {
        loading: true,
      };
    case ORDER_PAY_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case ORDER_PAY_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case ORDER_PAY_RESET:
      return {};
    default:
      return state;
  }
};

export const orderDeliveryReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_DELIVERY_REQUEST:
      return {
        loading: true,
      };
    case ORDER_DELIVERY_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case ORDER_DELIVERY_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case ORDER_DELIVERY_RESET:
      return {};
    default:
      return state;
  }
};

export const orderTrackingReducer = (state = { order: {} }, action) => {
  switch (action.type) {
    case ORDER_UPDATE_TRACKING_REQUEST:
      return { loading: true };
    case ORDER_UPDATE_TRACKING_SUCCESS:
      return { loading: false, success: true,/* order: action.payload*/ };
    case ORDER_UPDATE_TRACKING_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_UPDATE_TRACKING_RESET:
      return { order: {}};
    default:
      return state;
  }
};

export const orderShippedReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_SHIPPED_REQUEST:
      return {
        loading: true,
      };
    case ORDER_SHIPPED_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case ORDER_SHIPPED_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case ORDER_SHIPPED_RESET:
      return {};
    default:
      return state;
  }
};

export const myOrderListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case MY_ORDER_LIST_REQUEST:
      return {
        loading: true,
      };
    case MY_ORDER_LIST_SUCCESS:
      return {
        loading: false,
        orders: action.payload,
      };
    case MY_ORDER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case MY_ORDER_LIST_RESET:
      return {
        orders: [],
      };
    default:
      return state;
  }
};

export const orderListReducer = (state = { orders: [] }, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case ORDER_LIST_REQUEST:
      return { loading: true };
    case ORDER_LIST_SUCCESS:
      return { loading: false, orders: action.payload };
    case ORDER_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
