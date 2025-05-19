import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { FaQuestion } from 'react-icons/fa'
import { IoMicSharp, IoSend } from 'react-icons/io5'
import axios from 'axios'

const ChatInput = ({ setMessages, isFetchMessages }) => {
  const location = useLocation()
  const { message } = location.state || {}
  const [isComposing, setIsComposing] = useState(false)
  const [currentPage, setCurrentPage] = useState(window.location.pathname)

  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setCurrentPage(window.location.pathname)
  }, [window.location.pathname])

  useEffect(() => {
    setInputValue('')
  }, [currentPage])

  useEffect(() => {
    if (isFetchMessages && currentPage === '/chat' && message) {
      console.log('inputValue:', message)

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'PC',
          sender: 'USER',
          message: message,
          createdAt: new Date().toISOString(),
        },
      ])
      axios
        .post(
          `${process.env.REACT_APP_SERVER_URL}/chat/messages`,
          {
            role: 'PC',
            sender: 'USER',
            message: message,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('NaviToken')}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data)
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              ...response.data.body,
              isStreaming: true,
            },
          ])
          if (response.data.code == 0) {
            navigate('/chat')
          } else {
            alert('질문 전송에 실패했습니다. 다시 시도해주세요.')
          }
        })
        .catch((error) => {
          console.error('질문 전송 오류:', error)
          alert('질문 전송 중 오류가 발생했습니다. 다시 시도해주세요.')
        })
    }
  }, [isFetchMessages])

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    if (inputValue.trim() === '') return

    const prvMessage = inputValue
    setInputValue('')

    if (currentPage === '/') {
      navigate('/chat', {
        state: { message: prvMessage },
      })
    }

    const sendMessage = inputValue
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: 'PC',
        sender: 'USER',
        message: inputValue,
        createdAt: new Date().toISOString(),
      },
    ])
    setInputValue('')

    axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}/chat/messages`,
        {
          role: 'PC',
          sender: 'USER',
          message: sendMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('NaviToken')}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data)
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...response.data.body,
            isStreaming: true,
          },
        ])

        if (response.data.code == 0) {
          navigate('/chat')
        } else {
          alert('질문 전송에 실패했습니다. 다시 시도해주세요.')
        }
      })
      .catch((error) => {
        console.error('질문 전송 오류:', error)
        alert('질문 전송 중 오류가 발생했습니다. 다시 시도해주세요.')
      })
  }

  return (
    <InputSection
      $currentPage={currentPage}
      onClick={() => document.querySelector('input').focus()}
    >
      <H2>질문하기</H2>
      <Input
        type="text"
        placeholder="무엇이든 물어보세요"
        onChange={handleInputChange}
        value={inputValue}
        onKeyDown={(e) => {
          if (isComposing) return
          if (e.key === 'Enter') {
            handleSubmit()
          }
        }}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        isComposing={false}
      />
      <Btns>
        <QuestionBtn>
          <FaQuestion color="#fff" size={15} />
        </QuestionBtn>
        <RightBtns>
          <VoiceBtn>
            <IoMicSharp color="#5c5c5c" size={25} />
          </VoiceBtn>
          <SubmitBtn type="submit" onClick={handleSubmit}>
            <IoSend color="#fff" size={14} />
          </SubmitBtn>
        </RightBtns>
      </Btns>
    </InputSection>
  )
}
export default ChatInput

const H2 = styled.h2`
  display: none;
`
const InputSection = styled.section`
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  width: ${(props) =>
    props.$currentPage == '/chat' ? 'calc(100vw - 40px)' : '60vw'};
  max-width: ${(props) =>
    props.$currentPage == '/chat' ? 'calc(60rem - 2.5rem)' : '38rem'};
  padding: 1.5rem 1.5rem 1rem;
  box-sizing: border-box;
  margin: 0 20px;
`
const Input = styled.input`
  margin-bottom: 1rem;
  border: none;
  width: 100%;
  font-size: 0.9rem;
  height: 1.1rem;

  &:focus {
    outline: none;
  }
`
const Btns = styled.div`
  display: flex;
`
const RightBtns = styled.div`
  margin-left: auto;
  display: flex;
`
const Button = styled.button`
  border: none;
  border-radius: 100%;
  width: 2rem;
  height: 2rem;
  background-color: #5c5c5c;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`
const QuestionBtn = styled(Button)``
const VoiceBtn = styled(Button)`
  margin-right: 1rem;
  background-color: #fff;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25);
`
const SubmitBtn = styled(Button)``
