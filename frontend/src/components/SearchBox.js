import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();
  const [term, setTerm] = useState('');

  const searchSubmitHandler = e => {
    e.preventDefault();
    if (term.trim()) {
      navigate(`/search/${term}`);
    } else {
      navigate('/');
    }
  };

  return (
    <Form
      onSubmit={searchSubmitHandler}
      className='d-flex form shadow-md p-1 mb-2 bg-success rounded  align-middle'
    >
      <Form.Control
        type='search'
        name='q'
        onChange={e => setTerm(e.target.value)}
        placeholder='Search products ...'
        className='me-2'
        aria-label='Search'
      />
      <Button type='submit' variant='outline-secondary'>
        <i className='fa-solid fa-magnifying-glass' />
      </Button>
    </Form>
  );
};

export default SearchBox;
