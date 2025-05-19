import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { NaviLogo } from '../../assets/common'
import { FaPowerOff } from 'react-icons/fa'

const Nav = ({ modalOpen, setModalType }) => {
  const navigate = useNavigate()

  const handleClickHomeBtn = () => {
    if (setModalType) setModalType('home')
    if (modalOpen) {
      modalOpen()
      console.log('handleOpen')
    } else navigate('/')
  }

  const handleLogoutBtn = () => {
    if (setModalType) setModalType('logout')
    if (modalOpen) {
      modalOpen()
      console.log('handleOpen')
    } else {
      localStorage.removeItem('NaviToken')
      localStorage.removeItem('NaviUserType')
      alert('로그아웃 되었습니다.')
      navigate('/login')
    }
  }

  return (
    <NavSection>
      <HomeBtn onClick={handleClickHomeBtn}>
        <NaviLogo />
      </HomeBtn>
      <NavItems>
        <UserName>{localStorage.getItem('NaviUserId')} 님</UserName>

        <ExitBtn onClick={handleLogoutBtn}>
          <FaPowerOff size={30} color="#FF8B8B" />
        </ExitBtn>
      </NavItems>
    </NavSection>
  )
}
export default Nav

const NavSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem 3rem;
  box-sizing: border-box;
`
const HomeBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 7rem;
  height: 7rem;
`
const NavItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`
const UserName = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
`
const ExitBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: #fff;
  border-radius: 100%;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);

  &:hover {
    background-color: #f0f0f0;
  }
  &:active {
    background-color: #e0e0e0;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`
