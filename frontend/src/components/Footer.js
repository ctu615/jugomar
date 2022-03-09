import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
const Year = new Date().getFullYear();

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-2'>
            <ul class='social'>
              <li>
                <h6 className='text-info'>Contact us:</h6>
              </li>
              <li>
                <a href={`mailto:jugomarltd@gmail.com`}>
                  <img src={require('../img/email.png')} alt='' />{' '}
                  jugomarltd@gmail.com
                </a>
              </li>
              <li>
                <a href={`https://api.whatsapp.com/send?phone=+2348033395195`}>
                  <img
                    src={require('../img/whatsapp.png')}
                    alt='+234 (803) 339-5195'
                  />{' '}
                  +234 (803) 339-5195
                </a>
              </li>
              <li>
                <a href={`tel:+2348033395195`}>
                  <img
                    src={require('../img/phone.png')}
                    alt='+234 (803) 339-5195'
                  />{' '}
                  +234 (803) 339-5195
                </a>
              </li>
            </ul>
          </Col>
        </Row>
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
