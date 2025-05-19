import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import CommonForm from '../components/login/CommonForm'
import { SKLogo } from '../assets/common'
import backgroundImg from '../assets/login/img_login_background.svg'

const LoginPage = ({ setUserType }) => {
  // login or signup
  const [pageType, setPageType] = useState('login')
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/login') setPageType('login')
    else setPageType('signup')
  }, [location.pathname])

  return (
    <LoginPageContainer>
      <Circle1 $pageType={pageType} />
      <Circle2 $pageType={pageType} />
      <Circle3 $pageType={pageType} />

      <Logo />
      <CommonForm
        pageType={pageType}
        setPageType={setPageType}
        setUserType={setUserType}
      />
    </LoginPageContainer>
  )
}
export default LoginPage

const CircleBase = styled.div`
  position: absolute;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: -3px 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 0;
  transition: all 0.5s ease-in-out;
`
const Circle1 = styled(CircleBase)`
  bottom: ${(props) => (props.$pageType === 'login' ? '50%' : '55%')};
  left: ${(props) => (props.$pageType === 'login' ? '7%' : '7%')};
  width: 5vw;
  height: 5vw;
`
const Circle2 = styled(CircleBase)`
  bottom: ${(props) => (props.$pageType === 'login' ? '15%' : '10%')};
  left: ${(props) => (props.$pageType === 'login' ? '20%' : '15%')};
  width: 15vw;
  height: 15vw;
`
const Circle3 = styled(CircleBase)`
  bottom: ${(props) => (props.$pageType === 'login' ? '35%' : '40%')};
  right: ${(props) => (props.$pageType === 'login' ? '10%' : '5%')};
  width: 5vw;
  height: 5vw;
  box-shadow: 3px 4px 10px rgba(0, 0, 0, 0.1);
`
const LoginPageContainer = styled.div`
  background-image: url(${backgroundImg});
  background-size: cover;
  background-position: center;
  height: 100vh;
  min-width: 100vw;
  width: fit-content;
  align-content: center;
  justify-items: center;
`
const Logo = styled(SKLogo)`
  position: absolute;
  top: 2rem;
  right: 3rem;
  width: 5rem;
  height: 5rem;
  z-index: 10;
`
