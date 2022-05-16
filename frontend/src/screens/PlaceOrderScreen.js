import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Card,
  Col,
  Row,
  Image,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector(state => state.cart);

  const convertDecimals = deciNum =>
    (Math.round(deciNum * 100) / 100).toFixed(2);

  /**
   * Price breakdown
   */

  cart.itemsPrice = convertDecimals(
    cart.cartItems.reduce(
      (accumulator, currentItem) =>
        accumulator + currentItem.price * currentItem.quantity,
      0
    )
  );

  cart.shippingPrice = convertDecimals(cart.cartItems > 500000 ? 1000 : 10000);
  cart.taxPrice = convertDecimals(Number(0.15 * cart.itemsPrice));
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  const orderCreate = useSelector(state => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`);
    }
    // eslint-disable-next-line
  }, [navigate, success]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );
    cart.cartItems = [];
  };
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={6}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3 className='text-info'>Shipping</h3>
              <p>
                {' '}
                <strong className='text-success'>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}.
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3 className='text-info'>Payment</h3>
              <p>
                <strong className='text-success'>Method: </strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3 className='text-info'>Order items</h3>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
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
                        <i className='fa-solid fa-naira-sign' />

                        {cart.itemsPrice}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>
                        <i className='fa-solid fa-naira-sign' />

                        {cart.shippingPrice}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>
                        <i className='fa-solid fa-naira-sign' />

                        {cart.taxPrice}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total</Col>
                      <Col>
                        <i className='fa-solid fa-naira-sign' />

                        {cart.totalPrice}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </ListGroup.Item>

              {error && <Message variant='danger'>{error}</Message>}

              <ListGroup.Item className='d-grid gap-2 '>
                <Button
                  type='submit'
                  className='btn-block btn-success size="lg"'
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
