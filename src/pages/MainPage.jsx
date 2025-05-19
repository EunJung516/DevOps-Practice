import React from 'react'
import { Nav } from '../components/common'
import { Main } from '../components/main'
import styled from 'styled-components'
import MainBackground from '../assets/main/img_main_background.svg'

const MainPage = () => {
  return (
    <MainPageContainer>
      <Nav />
      <Main />
    </MainPageContainer>
  )
}
export default MainPage

const MainPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 100vw;
  width: fit-content;
  height: 100vh;
  background-image: url(${MainBackground});
  background-size: cover;
  background-position: center;
`
