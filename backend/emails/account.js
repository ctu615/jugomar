import sgMail from '@sendgrid/mail';
import moment from 'moment';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const intlNumFormat = new Intl.NumberFormat('en-US');

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'jugomarltd@gmail.com',
    subject: 'Welcome to JugoMar!!',
    text: `Welcome to JugoMar Nourishing Nutritionals, ${name}. You can explore and continue shopping at https://www.jugomar.com .`,
  });
};
const sendOrderPaymentEmail = (
  orderNumber,
  address,
  city,
  postalCode,
  country,
  email,
  name,
  paymentMethod,
  orderTotal
) => {
  sgMail.send({
    to: email,
    from: 'jugomarltd@gmail.com',
    subject: `Your Jugomar.com order #${orderNumber}`,
    text: ` Hello ${name},

      Thank you for shopping with us here at JugoMar Nourishing Nutritionals. 
      We’ll send a confirmation email when your items are delivered.

      Order Details: 
        
      Order #: ${orderNumber}

      Payment Method: ${paymentMethod}
      
      Ship to: ${address}, ${city}, ${postalCode}, ${country}.

      Order Total: # ${intlNumFormat.format(orderTotal)} 
     `,
  });
};

const sendOrderShippedEmail = (
  orderNumber,
  address,
  city,
  postalCode,
  country,
  email,
  trackingNumber,
  name,
  orderTotal
) => {
  sgMail.send({
    to: email,
    from: 'jugomarltd@gmail.com',
    subject: `Shipped your Jugomar.com order #${orderNumber}`,
    text: `
    Hello ${name},
    
      Thank you for shopping with us here at JugoMar Nourishing Nutritionals. 
      Your item(s) have been shipped.

      Order Details:

      Order # ${orderNumber}

      Items are shipping to: ${address}, ${city}, ${postalCode}, ${country}.
      
      Order Tracking Number: ${
        trackingNumber ? trackingNumber : 'Tracking number is unavailable!'
      }

      Order Total: #${intlNumFormat.format(orderTotal)}
     `,
  });
};

const sendOrderDeliveryEmail = (
  orderNumber,
  address,
  city,
  postalCode,
  country,
  email,
  trackingNumber,
  name,
  orderTotal
) => {
  sgMail.send({
    to: email,
    from: 'jugomarltd@gmail.com',
    subject: `Delivered your Jugomar.com order #${orderNumber}`,
    text: `Hello ${name},

     Thank you for shopping with us here at JugoMar Nourishing Nutritionals. 
     Your item(s) were delivered.

     Order Details:

      Order # ${orderNumber}

      Items were deliverd to: ${address}, ${city}, ${postalCode}, ${country}.
      
       Order Tracking Number: ${
         trackingNumber ? trackingNumber : 'Tracking number is unavailable!'
       }

      Order delivery time: ${moment(Date.now()).format('MMM DD, YYYY')}

      Order Total: #${intlNumFormat.format(orderTotal)}
     `,
  });
};

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'jugomarltd@gmail.com',
    subject: 'We are sad to see you go!',
    text: `Hi ${name}, thank you for being a valued JugoMar customer. We are sad that you have decided to deactivate your account, is there anything we could do better to keep you active? Please let us know how we can improve.`,
  });
};

export {
  sendWelcomeEmail,
  sendOrderPaymentEmail,
  sendOrderShippedEmail,
  sendOrderDeliveryEmail,
  sendCancellationEmail,
};
