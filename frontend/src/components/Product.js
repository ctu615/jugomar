import React from 'react';
import { Link } from 'react-router-dom';

import { Card } from 'react-bootstrap';

import Rating from './Rating';

const Product = ({ product }) => {
 const intlNumFormat = new Intl.NumberFormat('en-US');
  return (
    <>
      <Card className='my-3 py-3 mx-1 rounded' style={{ height: '32rem' }}>
        <Link to={`/product/${product._id}`}>
          <Card.Img src={product.image} variant='top' />
        </Link>
        <Card.Body className='mycard-body'>
          <Link
            to={`/product/${product._id}`}
            style={{ textDecoration: 'none' }}
          >
            <Card.Title className='text-success' as='div'>
              {' '}
              <strong> {product.name}</strong>
              <p className='text-success'>{product.subname}</p>
            </Card.Title>
          </Link>
          <Card.Text as='div'>
            <Rating
              value={product.rating}
              text={`${product.numReviews} 
            reviews`}
            />
          </Card.Text>

          <Card.Text as='h3' className='text-dark'>
            <i className='fa-solid fa-naira-sign' />
            {intlNumFormat.format(product.price)}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};
export default Product;
