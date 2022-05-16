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
  Form,
} from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  getOrderDetails,
  payOrder,
  shippedOrder,
  deliveryOrder,
  updateTrackingOrder,
} from '../actions/orderActions';
import {
  ORDER_PAY_RESET,
  ORDER_SHIPPED_RESET,
  ORDER_DELIVERY_RESET,
  ORDER_UPDATE_TRACKING_RESET,
} from '../constants/orderConstants';

const OrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const orderId = id;

  const [sdkReady, setSdkReady] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const orderDetails = useSelector(state => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector(state => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderTracking = useSelector(state => state.orderTracking);
  const { loading: loadingTracking, success: successTracking } = orderTracking;

  const orderShipped = useSelector(state => state.orderShipped);
  const { loading: loadingShipped, success: successShipped } = orderShipped;

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

    if (
      !order ||
      successPay ||
      successShipped ||
      successTracking ||
      successDelivery ||
      order._id !== orderId
    ) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_SHIPPED_RESET });
      dispatch({ type: ORDER_DELIVERY_RESET });
      dispatch({ type: ORDER_UPDATE_TRACKING_RESET });

      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    } else {
      setTrackingNumber(order.trackingNumber);
    }
  }, [
    dispatch,
    navigate,
    order,
    orderId,
    successPay,
    userInfo,
    successDelivery,
    successShipped,
    successTracking,
  ]);

  const successPaymentHandler = paymentResult => {
    //console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };

  const successShippedHandler = () => {
   // console.log(order);
    dispatch(shippedOrder(order));
  };

  const successDeliveryHandler = () => {
    dispatch(deliveryOrder(order));
  };

  const submitTrackingHandler = e => {
    e.preventDefault();
    if (window.confirm('Please confirm tracking number!')) {
      dispatch(
        updateTrackingOrder({
          id: order._id,
          user: order.user._id,
          orderItems: order.orderItems,
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod,
          itemsPrice: order.itemsPrice,
          taxPrice: order.taxPrice,
          trackingNumber,
          shippingPrice: order.shippingPrice,
          totalPrice: order.totalPrice,
          isDelivered: order.isDelivered,
          isPaid: order.isPaid,
          isShipped: order.isShipped,
        })
      );
    }
    //navigate('/admin/orderlist');
  };

  const intlNumFormat = new Intl.NumberFormat('en-US');

  return (
    <>
      {loading ? (
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
                    <a href={`mailto:${order.user.email}`}>
                      {order.user.email}
                    </a>
                  </p>
                  <p className='text-info'>
                    {' '}
                    <strong className='text-success'>Address: </strong>
                    {order.shippingAddress.address},{' '}
                    {order.shippingAddress.city},{' '}
                    {order.shippingAddress.postalCode},{' '}
                    {order.shippingAddress.country}.
                  </p>
                  {order.trackingNumber !== 'SAMPLETRACKING' ? (
                    <Message variant='success'>
                      <img
                        src={require('../img/trackingNumber.png')}
                        alt='tracking number'
                      />{' '}
                      Tracking Number: <strong>{order.trackingNumber}</strong>
                    </Message>
                  ) : (
                    <Message variant='primary'>
                      Tracking # will be added soon!
                    </Message>
                  )}
                  {order.isShipped ? (
                    <Message variant='success'>
                      <img
                        src={require('../img/outdelivery.png')}
                        alt='shipped'
                      />{' '}
                      Shipped on{' '}
                      {moment(order.shippedAt).format('MMM DD, YYYY')}
                    </Message>
                  ) : (
                    <Message variant='danger'>Not shipped</Message>
                  )}

                  {order.isDelivered ? (
                    <Message variant='success'>
                      <img
                        src={require('../img/packagedelivered.png')}
                        alt='delivered'
                      />{' '}
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
                      <img src={require('../img/paid.png')} alt='paid' /> Paid
                      on {moment(order.paidAt).format('MMM DD, YYYY')}
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
                              <i className='fa-solid fa-naira-sign' />{' '}
                              {item.price} ={' '}
                              <i className='fa-solid fa-naira-sign' />
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
                            <i className='fa-solid fa-naira-sign' /> $
                            {intlNumFormat.format(order.itemsPrice)}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>Shipping</Col>
                          <Col>
                            <i className='fa-solid fa-naira-sign' />{' '}
                            {intlNumFormat.format(
                              convertDecimals(order.shippingPrice)
                            )}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>Tax</Col>
                          <Col>
                            <i className='fa-solid fa-naira-sign' />{' '}
                            {intlNumFormat.format(
                              convertDecimals(order.taxPrice)
                            )}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col>Total</Col>
                          <Col>
                            <i className='fa-solid fa-naira-sign' />{' '}
                            {intlNumFormat.format(
                              convertDecimals(order.totalPrice)
                            )}
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
                  {loadingTracking && <Loader />}
                  {userInfo &&
                    userInfo.isAdmin &&
                    order.isPaid && (
                      <>
                        <ListGroup.Item
                          className='d-grid
                    gap-2'
                        >
                          <Form
                            onSubmit={submitTrackingHandler}
                            className='d-grid
                    gap-2'
                          >
                            <Form.Group controlId='trackingNumber'>
                              <Form.Label>Update Tracking #</Form.Label>
                              <Form.Control
                                type='trackingNumber'
                                placeholder='Enter Tracking info ...'
                                value={trackingNumber}
                                required
                                onChange={e =>
                                  setTrackingNumber(e.target.value)
                                }
                              ></Form.Control>
                            </Form.Group>
                            <Button
                              type='submit'
                              variant='success'
                              className='btn-block btn-success size="lg"'
                            >
                              Enter tracking info
                            </Button>
                          </Form>
                        </ListGroup.Item>
                      </>
                    )}
                  {loadingShipped && <Loader />}
                  {userInfo &&
                    userInfo.isAdmin &&
                    order.isPaid &&
                    order.trackingNumber &&
                    !order.isShipped && (
                      <ListGroup.Item
                        className='d-grid
                    gap-2'
                      >
                        <Button
                          type='button'
                          className='btn-block btn-success size="lg"'
                          onClick={successShippedHandler}
                        >
                          Mark as shipped{' '}
                          <img
                            src={require('../img/shipped.png')}
                            alt='shipped'
                          />
                        </Button>
                      </ListGroup.Item>
                    )}

                  {loadingDelivery && <Loader />}
                  {userInfo &&
                    userInfo.isAdmin &&
                    order.isPaid &&
                    order.trackingNumber &&
                    order.isShipped &&
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
                          Mark as deliverd{' '}
                          <img
                            src={require('../img/delivered.png')}
                            alt='delivered'
                          />
                        </Button>
                      </ListGroup.Item>
                    )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}{' '}
    </>
  );
};

export default OrderScreen;
