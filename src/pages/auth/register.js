import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage = ({ handleError }) => {
  return <RegisterForm handleError={handleError} />;
};

export default RegisterPage;