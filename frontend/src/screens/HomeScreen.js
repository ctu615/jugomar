import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { listProducts } from '../actions/productActions';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { term } = useParams();
  const { pageNumber } = useParams();

  const pageNumberOptions = pageNumber || 1;

  const productList = useSelector(state => state.productList);
  const { loading, error, products, pages, page } = productList;

  useEffect(() => {
    dispatch(listProducts(term, pageNumberOptions));
  }, [dispatch, term, pageNumberOptions]);

  return (
    <>
      <Meta />
      {!term ? (
        <ProductCarousel />
      ) : (
        <Link className='btn btn-outline-success' to='/'>
          <i className='fas fa-home' />
          Home
        </Link>
      )}
      <h1 className='text-info'>Current Product Offerings</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row>
            {products.map(product =>
              product.name === 'Sample name' ? (
                ''
              ) : (
                <Col
                  key={product._id}
                  sm={12}
                  md={6}
                  lg={4}
                  xl={3}
                  style={{ marginBottom: '25px' }}
                >
                  <Product product={product} />
                
                </Col>
              )
            )}
          </Row>
          <Row>
            <Paginate pages={pages} page={page} term={term ? term : ''} />
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
