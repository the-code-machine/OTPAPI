const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const otpModel = require('./model');
const { generateOTPEmailTemplate, resetOTPEmailTemplate } = require('./emailtemplates');

dotenv.config();

const emailsecret = process.env.EMAIL_SECRET;
const passwordsecret = process.env.PASSWORD_SECRET;

function sendOTPEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailsecret, // Your email
      pass: passwordsecret, // Your email password
    },
  });

  const mailOptions = {
    from: 'sarthak25ic049@satiengg.in', // Your email
    to: email,
    subject: 'OTP for Verification',
    html: generateOTPEmailTemplate(otp), // Use the HTML template with the OTP
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

exports.genrateotp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email or mobile number is required' });
  }

  const generatedOTP = generateNumericOTP(6);

  try {
    const newOtp = new otpModel({
      email,
      otp: generatedOTP,
    });

    await newOtp.save();

    // Send OTP email using the new email template
    sendOTPEmail(email, generatedOTP);

    res.json({ message: 'OTP generated and sent to the email' });
  } catch (err) {
    console.error('Error saving OTP to the database:', err);
    res.status(500).json({ message: 'Error saving OTP to the database', error: err });
  }
};

function generateNumericOTP(length) {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  }

  return otp;
}

exports.verifyotp = async (req, res) => {
    const { otp } = req.body;
  
    try {
      const otpRecord = await otpModel.findOne({ otp });
  
      if (!otpRecord) {
        return res.status(401).json({ message: 'Invalid OTP' });
      }
  
      // Delete the OTP after successful verification
      await otpModel.deleteOne({ otp });
  
      res.json({ message: 'OTP verification successful' });
    } catch (error) {
      console.error('Error querying the database:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  function sendRestOTPEmail(email, otp) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailsecret, // Your email
        pass: passwordsecret, // Your email password
      },
    });
  
    const mailOptions = {
      from: 'sarthak25ic049@satiengg.in', // Your email
      to: email,
      subject: 'Password Reset OTP',
      html: resetOTPEmailTemplate(otp), // Use the HTML template with the OTP
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }
  
  exports.genrateResetotp = async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ message: 'Email or mobile number is required' });
    }
  
    const generatedOTP = generateNumericOTP(6);
  
    try {
      const newOtp = new otpModel({
        email,
        otp: generatedOTP,
      });
  
      await newOtp.save();
  
      // Send OTP email using the new email template
      sendRestOTPEmail(email, generatedOTP);
  
      res.json({ message: 'OTP generated and sent to the email' });
    } catch (err) {
      console.error('Error saving OTP to the database:', err);
      res.status(500).json({ message: 'Error saving OTP to the database', error: err });
    }
  };
  
