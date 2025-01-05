import React from 'react'
import RegistrationForm from '../components/RegistrationForm'
import { useNavigate } from 'react-router-dom'

const RegistrationPage = () => {
    const navigate = useNavigate();
  return (
    <RegistrationForm onComplete={() => navigate('/profile')} />
  )
}

export default RegistrationPage