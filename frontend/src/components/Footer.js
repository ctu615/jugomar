import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
const Year = new Date().getFullYear()

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-2'>
            Copyright &copy; {Year} JugoMar. All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
