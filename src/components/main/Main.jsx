import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { WorkspaceImg, BuildingImg, BalanceImg } from '../../assets/main'
import { ChatInput } from '../chat'

const Main = () => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const input = document.querySelector('input')
    if (input) {
      input.focus()
    }
  }, [])

  return (
    <MainContent>
      <GreetingSection>
        <H1>Navi 채팅 메인 화면</H1>
        <SubGreeting>안녕하세요, 스칼라 님</SubGreeting>
        <MainGreeting>무엇을 도와드릴까요?</MainGreeting>
      </GreetingSection>

      <ChatInput setMessages={setMessages} />

      <ExampleSection>
        <H2>예시 대화</H2>
        {exampleList.map((example, index) => (
          <Example
            key={index}
            img={example.img}
            title={example.title}
            content={example.content}
          />
        ))}
      </ExampleSection>
    </MainContent>
  )
}
export default Main

const Example = ({ img, title, content }) => {
  return (
    <ExampleContainer>
      <ExampleContent>
        <ExampleImg src={img} alt={title} />
        <ExampleTitle>{title}</ExampleTitle>
      </ExampleContent>
      {content.split('\n').map((line, index) => (
        <ExampleText key={index}>
          {line}
          {index !== content.split('\n').length - 1 && <br />}
        </ExampleText>
      ))}
    </ExampleContainer>
  )
}

const exampleList = [
  {
    img: WorkspaceImg,
    title: '조직도',
    content: '보람 매니저 님 자리가\n어디에 있는지 궁금해요',
  },
  {
    img: BalanceImg,
    title: '내규 정보',
    content: '휴가를 언제 사용한지\n가능한지 알고 싶어요',
  },
  {
    img: BuildingImg,
    title: '사옥 정보',
    content: 'SK C&C 사내 카페가\n몇 층인지 알려주세요',
  },
]

const MainContent = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 80px);
  padding-bottom: 15vh;
`
const GreetingSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`
const H1 = styled.h1`
  display: none;
`
const H2 = styled.h2`
  display: none;
`
const SubGreeting = styled.p`
  font-size: 1.8rem;
  font-weight: 500;
  margin: 0;
  margin-top: 1rem;
`
const MainGreeting = styled.p`
  font-size: 2.8rem;
  font-weight: 700;
  margin: 0.7rem 0 2rem;
`
const ExampleSection = styled.section`
  width: 60vw;
  max-width: 38rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  cursor: pointer;
`
const ExampleContainer = styled.div`
  background-color: #f7f7f7;
  flex: 1;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  height: 7.5rem;
  overflow-y: auto;
  border-radius: 25px;
  padding: 0.5rem 1.2rem 0.8rem;
`
const ExampleContent = styled.p`
  display: flex;
  width: 100% !important;
  justify-content: space-between !important;
  box-sizing: border-box;
  padding: 0 0.3rem;
  align-items: center;
  justify-content: center;
`
const ExampleTitle = styled.p`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
`
const ExampleImg = styled.img`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
`
const ExampleText = styled.p`
  font-size: 0.8rem;
  font-weight: 400;
  margin: 0;
`
