import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from 'react-bootstrap';
import Rating from '../components/Rating';
import { detailProducts, createProductReview } from '../actions/productActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';

const ProductScreen = () => {
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const productDetails = useSelector(state => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const productCreateReview = useSelector(state => state.productCreateReview);
  const { success: successProductReview, error: errorProductReview } =
    productCreateReview;

  useEffect(() => {
    if (successProductReview) {
      alert('Review submitted!');
      setRating(0);
      setComment('');
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(detailProducts(id));
  }, [dispatch, id, successProductReview]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?quantity=${quantity}`);
  };
  const submitReviewHandler = e => {
    e.preventDefault();
    dispatch(createProductReview(id, { rating, comment }));
    //navigate(`/cart/${id}?quantity=${quantity}`);
  };

  return (
    <>
      <Link className='btn btn-outline-success' to='/'>
        <i className='fas fa-home' />
        Home
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Meta title={`JugoMar - ${product.name}`} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup>
                <ListGroup.Item>
                  <h3 className='text-success'>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  Price:{' '}
                  <img src={require('../img/naira_icon_14.png')} alt='Naira' />
                  {product.price
                    ? product.price.toFixed(2)
                    : 'Price unavailable'}
                </ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col className='fw-bolder'>
                        {product.price
                          ? product.price.toFixed(2)
                          : 'Price unavailable'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock >= 6 ? (
                          <p className='text-success'>In Stock</p>
                        ) : product.countInStock === 0 ? (
                          <p className='text-danger'>Out Of Stock</p>
                        ) : (
                          <p className='text-warning'>Out Of Stock Soon</p>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          Quantity:
                          <Form.Control
                            as='select'
                            className='form-select'
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(i => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item
                    className='d-grid
                    gap-2'
                  >
                    <Button
                      className='btn-block btn-success size="lg"'
                      onClick={addToCartHandler}
                      disabled={product.countInStock === 0}
                    >
                      Add to cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2 className='text-success'>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant='flush'>
                {product.reviews.map(review => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item>
                  <h2 className='text-dark'>Write a customer review</h2>
                  {errorProductReview && (
                    <Message variant='danger'>{errorProductReview}</Message>
                  )}
                  {userInfo ? (
                    <Form
                      onSubmit={submitReviewHandler}
                      className='d-grid
                    gap-2'
                    >
                      <Form.Group controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          value={rating}
                          onChange={e => setRating(e.target.value)}
                        >
                          <option value={''}>Select ... </option>
                          <option value={'1'}>1 - Poor </option>
                          <option value={'2'}>2 - Fair </option>
                          <option value={'3'}>3 - Good </option>
                          <option value={'4'}>4 - Great </option>
                          <option value={'5'}>5 - Excellent </option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId='comment'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          value={comment}
                          row='3'
                          onChange={e => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        className='btn-block btn-success size="lg"'
                        type='submit'
                        variant='success'
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to='/login'>Sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
