import React, { useEffect } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
  ListGroupItem,
} from 'react-bootstrap';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../actions/cartActions';

const CartScreen = () => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartSelector = useSelector(state => state.cart);

  const productId = id;
  const { cartItems } = cartSelector;

  //console.log(cartItems);

  const quantity = location.search ? Number(location.search.split('=')[1]) : 1;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, quantity));
    }
  }, [dispatch, productId, quantity]);

  const removeFromCartHandler = id => {
    //console.log('removed');
    dispatch(removeFromCart(id));
  };
  const checkoutHandler = id => {
    navigate('/login?redirect=/shipping');
  };
  const intlNumFormat = new Intl.NumberFormat('en-US');

  return (
    <>
      <Row>
        <Col md={8}>
          <h1 className='text-success'>Shopping Cart</h1>
          <hr />
          {cartItems.length === 0 ? (
            <Message>
              {' '}
              Your cart is empty, please add items.{' '}
              <Link to='/'>Return To Products </Link>
            </Message>
          ) : (
            <ListGroup variant='flush'>
              {cartItems.map(item => (
                <ListGroupItem key={item.product}>
                  <Row>
                    <Col md={2}>
                      <Link
                        to={`/product/${item.product}`}
                        style={{ textDecoration: 'none' }}
                        className='text-success fw-bolder'
                      >
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Link>
                    </Col>
                    <Col md={3}>
                      <Link
                        to={`/product/${item.product}`}
                        style={{ textDecoration: 'none' }}
                        className='text-success fw-bolder'
                      >
                        {item.name}
                      </Link>
                    </Col>
                    <Col md={2}>
                      <i className='fa-solid fa-naira-sign' />{' '}
                      {intlNumFormat.format(item.price)}
                    </Col>

                    <Col md={2}>
                      <Form.Control
                        as='select'
                        className='form-select'
                        value={item.quantity}
                        onChange={e =>
                          dispatch(
                            addToCart(item.product, Number(e.target.value))
                          )
                        }
                      >
                        {[...Array(item.countInStock).keys()].map(i => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <Button
                        type='button'
                        variant='light'
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        <i className='fas fa-trash' />
                      </Button>
                    </Col>
                  </Row>
                </ListGroupItem>
              ))}
            </ListGroup>
          )}
          <hr />
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup varaint='flush'>
              <ListGroup.Item>
                <h2 className='text-success'>
                  Subtotal (
                  {cartItems.reduce(
                    (accumulator, currentItem) =>
                      accumulator + currentItem.quantity,
                    0
                  )}
                  ) items
                </h2>
                <span className='fw-bolder'>
                  {' '}
                  <i className='fa-solid fa-naira-sign' />
                  {intlNumFormat.format(
                    cartItems.reduce(
                      (accumulator, currentItem) =>
                        accumulator + currentItem.quantity * currentItem.price,
                      0
                    )
                  )}
                </span>
              </ListGroup.Item>
              <ListGroup.Item
                className='d-grid
                    gap-2 '
              >
                <Button
                  className='btn-block btn-success size="lg"'
                  type='button'
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed to checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CartScreen;
