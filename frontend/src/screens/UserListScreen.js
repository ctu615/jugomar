import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { listUsers, deleteUser } from '../actions/userActions';

const UserListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userList = useSelector(state => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector(state => state.userDelete);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo, successDelete]);

  const deleteHandler = id => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <>
   
      <h1 className='text-success'>Users</h1>
     
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'> {error} </Message>
      ) : (<>
         <h4 className='text-success'>You have {users.length} unique users</h4>
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID#</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADIM</th>
              <th>EDIT/DELETE</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <i className='fas fa-check' style={{ color: 'green' }} />
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-edit' />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(user._id)}
                  >
                    <i className='fas fa-trash' />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>)}
    </>
  );
};

export default UserListScreen;
