import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatInput, ReviewModal } from '../components/chat'
import { Nav } from '../components/common'
import styled from 'styled-components'
import axios from 'axios'

const ChatPage = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [modalType, setModalType] = useState('')
  const [isFetchMessages, setIsFetchMessages] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('NaviToken')
    if (!token) {
      alert('로그인이 필요합니다.')
      navigate('/login')
    } else {
      fetchMessages()
    }
  }, [])

  useEffect(() => {
    // messages가 바뀔 때마다 가장 아래로 스크롤
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const scrollRef = useRef(null)

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/chat/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('NaviToken')}`,
        },
      })
      .then((response) => {
        console.log('메시지 가져오기 성공:', response.data.body)
        setMessages(response.data.body)
        setIsFetchMessages(true)
      })
      .catch((error) => {
        console.error('메시지 가져오기 오류:', error)
      })
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = (rating) => {
    setIsOpen(false)

    if (!rating) {
      return
    }
    if (!messages.length) {
      alert('리뷰를 제출할 수 없습니다.')
      if (modalType === 'logout') {
        localStorage.removeItem('NaviToken')
        alert('로그아웃 되었습니다.')
        navigate('/login')
      } else {
        navigate('/')
      }
      return
    }

    axios
      .post(
        `${process.env.REACT_APP_SERVER_URL}/chat/reviews`,
        {
          messageId: messages[messages.length - 1].id,
          rating: rating,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('NaviToken')}`,
          },
        }
      )
      .then((response) => {
        console.log('리뷰 제출 성공:', response.data)
        alert('리뷰 제출 성공')

        if (modalType === 'logout') {
          localStorage.removeItem('NaviToken')
          alert('로그아웃 되었습니다.')
          navigate('/login')
        } else {
          navigate('/')
        }
      })
      .catch((error) => {
        console.error('리뷰 제출 오류:', error)
        if (modalType === 'logout') {
          localStorage.removeItem('NaviToken')
          alert('로그아웃 되었습니다.')
          navigate('/login')
        } else {
          navigate('/')
        }
      })
  }
  return (
    <ChatPageContainer>
      <Nav modalOpen={handleOpen} setModalType={setModalType} />

      <ChatContainer>
        <ChatContent ref={scrollRef}>
          {messages.map((item, index) => {
            const currentDate = new Date(item.createdAt).toDateString()
            const prevDate =
              index > 0
                ? new Date(messages[index - 1].createdAt).toDateString()
                : null

            const shouldShowDate = currentDate !== prevDate

            return (
              <React.Fragment key={item.id}>
                {shouldShowDate && (
                  <ChatDate>
                    {new Date(item.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long',
                    })}
                  </ChatDate>
                )}
                <ChatItem
                  content={item.message}
                  role={item.sender}
                  isStreaming={item.isStreaming}
                  setMessages={setMessages}
                  index={index}
                  onContentUpdate={scrollToBottom}
                />
              </React.Fragment>
            )
          })}
        </ChatContent>

        <ChatInput
          setMessages={setMessages}
          messages={messages}
          isFetchMessages={isFetchMessages}
        />

        <AlertComment>
          Navi는 실수를 할 수 있습니다. 중요한 정보는 재차 확인하세요.
        </AlertComment>

        <ReviewModal
          isOpen={isOpen}
          setIsOpen={(rating) => handleClose(rating)}
        />
      </ChatContainer>
    </ChatPageContainer>
  )
}
export default ChatPage

const ChatItem = ({
  content,
  role,
  isStreaming,
  setMessages,
  index,
  onContentUpdate,
}) => {
  const [displayedContent, setDisplayedContent] = useState(
    isStreaming ? '' : content
  )
  const scrollRef = useRef(null)

  const safeContent = typeof content === 'string' ? content : ''
  const fullContent = safeContent.replace(/^"|"$/g, '').replace(/\\n/g, '\n') // ← 여기서 \\n을 실제 줄바꿈으로

  useEffect(() => {
    setDisplayedContent(isStreaming ? '' : fullContent)
  }, [content, isStreaming, fullContent])

  useEffect(() => {
    if (!isStreaming || role !== 'AGENT') return

    let i = 0
    const interval = setInterval(() => {
      i++
      if (i > fullContent.length) {
        clearInterval(interval)
        setMessages((prev) =>
          prev.map((msg, idx) =>
            idx === index ? { ...msg, isStreaming: false } : msg
          )
        )
        return
      }
      setDisplayedContent(fullContent.slice(0, i))
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
      if (onContentUpdate) onContentUpdate()
    }, 10)

    return () => clearInterval(interval)
  }, [isStreaming, fullContent, role, setMessages, index])

  const formatBold = (text) =>
    text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  const paragraphs = displayedContent.split(/\n{2,}/) // 문단 구분

  return (
    <ChatItemContainer ref={scrollRef} $role={role}>
      {paragraphs.map((paragraph, pIndex) => (
        <ChatItemContent key={pIndex}>
          {paragraph.split('\n').map((line, lIndex, arr) => (
            <React.Fragment key={lIndex}>
              <span dangerouslySetInnerHTML={{ __html: formatBold(line) }} />
              {lIndex !== arr.length - 1 && <br />}
            </React.Fragment>
          ))}
          {pIndex !== paragraphs.length - 1 && (
            <div style={{ height: '1em' }} />
          )}
        </ChatItemContent>
      ))}
    </ChatItemContainer>
  )
}

const ChatPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 100vw;
  width: fit-content;
  height: 100vh;
`
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 9rem);
`
const AlertComment = styled.p`
  font-size: 0.8rem;
  margin: 1rem 0 1.5rem;
  box-sizing: border-box;
`

const ChatDate = styled.p`
  font-size: 0.8rem;
  font-weight: 700;
  margin: 0;
  justify-self: center;
`
const ChatContent = styled.div`
  flex: 1;
  width: 100vw;
  margin-bottom: 0.2rem;
  max-width: 60rem;
  overflow-y: auto;
`
const ChatItemContainer = styled.div`
  display: flex;
  width: fit-content;
  max-width: 80%;
  flex-direction: column;
  padding: 0.8rem 1rem;
  margin: 0.5rem 1.25rem !important;
  margin-left: ${(props) =>
    props.$role === 'USER' ? 'auto' : '1.25rem'} !important;
  background-color: ${(props) => (props.$role === 'USER' ? '#F7F7F7' : '#fff')};
  border-radius: 25px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
`
const ChatItemContent = styled.p`
  font-size: 0.9rem;
  margin: 0;
`
