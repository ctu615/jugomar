import React, { useState, useEffect } from 'react';

import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';

import { login } from '../actions/userActions';

const LoginScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const userLogin = useSelector(state => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = e => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  /* const registerButtonHandler = e => {
    e.preventDefault();
    navigate(redirect ? `/register?redirect=${redirect}` : '/register');
  };*/

  return (
    <FormContainer>
      <h1 className='text-success'>Sign in</h1>
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form
        onSubmit={submitHandler}
        className='d-grid
                    gap-2 py-3'
      >
        <Form.Group controlId='email'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email ...'
            value={email}
            onChange={e => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password ...'
            value={password}
            onChange={e => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
          type='submit'
          variant='success'
          className='btn-block btn-success size="lg"'
        >
          Sign in
        </Button>
      </Form>
      <h6 className='text-center text-info py-2'>
        New Customer?{' '}
        <Link
          to={redirect ? `/register?redirect=${redirect}` : '/register'}
          className='text-center text-success py-2'
        >
          Sign up
        </Link>
      </h6>
    </FormContainer>
  );
};

export default LoginScreen;
