/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { PayPalButton } from 'react-paypal-button-v2';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Col,
  Row,
  Image,
  Button,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  getOrderDetails,
  payOrder,
  deliveryOrder,
} from '../actions/orderActions';
import {
  ORDER_PAY_RESET,
  ORDER_DELIVERY_RESET,
} from '../constants/orderConstants';

const OrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const orderId = id;

  const [sdkReady, setSdkReady] = useState(false);

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const orderDetails = useSelector(state => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector(state => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDelivery = useSelector(state => state.orderDelivery);
  const { loading: loadingDelivery, success: successDelivery } = orderDelivery;

  const convertDecimals = deciNum =>
    (Math.round(deciNum * 100) / 100).toFixed(2);

  if (!loading) {
    /**
     * Price breakdown
     */

    order.itemsPrice = convertDecimals(
      order.orderItems.reduce(
        (accumulator, currentItem) =>
          accumulator + currentItem.price * currentItem.quantity,
        0
      )
    );
  }

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order || successPay || successDelivery || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVERY_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [
    dispatch,
    navigate,
    order,
    orderId,
    successPay,
    userInfo,
    successDelivery,
  ]);

  const successPaymentHandler = paymentResult => {
    //console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };

  const successDeliveryHandler = () => {
    dispatch(deliveryOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1 className='text-info'>
        Order# <span className='text-dark'>{order._id.toUpperCase()}</span>
      </h1>

      <Row>
        <Col md={6}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3 className='text-info'>Shipping</h3>
              <p className='text-info'>
                <strong className='text-success'>Name: </strong>
                {order.user.name}
              </p>
              <p className='text-info'>
                {' '}
                <strong className='text-success'>email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p className='text-info'>
                {' '}
                <strong className='text-success'>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}.
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on{' '}
                  {moment(order.deliveredAt).format('MMM DD, YYYY')}
                </Message>
              ) : (
                <Message variant='danger'>Not delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h3 className='text-info'>Payment</h3>
              <p className='text-info'>
                <strong className='text-success'>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>
                  Paid on {moment(order.paidAt).format('MMM DD, YYYY')}
                </Message>
              ) : (
                <Message variant='danger'>Not paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h3 className='text-info'>Order items</h3>
              {order.orderItems.length === 0 ? (
                <Message>Your order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroupItem key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link
                            to={`/product/${item.product}`}
                            className='text-success'
                            style={{ textDecoration: 'none' }}
                          >
                            <strong> {item.name}</strong>
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.quantity} x{' '}
                          <i className='fa-solid fa-naira-sign' /> {item.price}{' '}
                          = <i className='fa-solid fa-naira-sign' />
                          {item.quantity * item.price}
                        </Col>
                      </Row>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={6}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3 className='text-info'>Order summary</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <ListGroup>
                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>
                        <i className='fa-solid fa-naira-sign' />{' '}
                        {order.itemsPrice}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>
                        <i className='fa-solid fa-naira-sign' />{' '}
                        {convertDecimals(order.shippingPrice)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>
                        <i className='fa-solid fa-naira-sign' />{' '}
                        {convertDecimals(order.taxPrice)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total</Col>
                      <Col>
                        <i className='fa-solid fa-naira-sign' />{' '}
                        {convertDecimals(order.totalPrice)}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
              {loadingDelivery && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item
                    className='d-grid
                    gap-2'
                  >
                    <Button
                      type='button'
                      className='btn-block btn-success size="lg"'
                      onClick={successDeliveryHandler}
                    >
                      Mark as deliverd <i className='fa-solid fa-check' />
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
