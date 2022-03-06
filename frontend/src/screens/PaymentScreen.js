import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../actions/cartActions';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector(state => state.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress) {
    navigate('/shipping');
  }
  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const submitHandler = e => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1 className='text-success'>Payment method</h1>
      <Form
        onSubmit={submitHandler}
        className='d-grid
                    gap-2 '
      >
        <Form.Group>
          <Form.Label as='legend'>Select payment method</Form.Label>

          <Col>
            <Form.Check
              className='success'
              type='radio'
              label='PayPal or Credit card'
              id='PayPal'
              name='paymentMethod'
              value='PayPal'
              checked
              onChange={e => setPaymentMethod(e.target.value)}
            ></Form.Check>

            {/*<Form.Check
              className='success'
              type='radio'
              label='Stripe'
              id='Stripe'
              name='paymentMethod'
              value='Stripe'
              onChange={e => setPaymentMethod(e.target.value)}
            ></Form.Check>*/}
          </Col>
        </Form.Group>

        <Button type='submit' className='btn-block btn-success size="lg"'>
          Proceed to place order
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
