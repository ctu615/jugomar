import React, { useEffect } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listOrders } from '../actions/orderActions';

const OrderListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderList = useSelector(state => state.orderList);
  const { loading, error, orders } = orderList;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  const intlNumFormat = new Intl.NumberFormat('en-US');
  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo]);

  return (
    <>
      <h1 className='text-success'>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'> {error} </Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>DATE</th>
              <th>ID#</th>
              <th>USER</th>
              <th>TOTAL</th>
              <th>PAID ON</th>
              <th>DELIVERED</th>
              <th>DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{moment(order.createdAt).format('MMM DD, YYYY')}</td>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>
                  <i className='fa-solid fa-naira-sign' /> {' '}
                  {intlNumFormat.format(order.totalPrice)}
                </td>
                <td>
                  {order.isPaid ? (
                    moment(order.paidAt).format('MMM DD, YYYY')
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    moment(order.deliveredAt).format('MMM DD, YYYY')
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <LinkContainer
                    to={`/order/${order._id}`}
                    className='d-grid
                    gap-2'
                  >
                    <Button variant='info' className='btn-block size="lg"'>
                      <i className='fas fa-folder' />
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
