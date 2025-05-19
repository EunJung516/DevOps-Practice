import React, { useState } from 'react'
import Modal from 'react-modal'
import styled from 'styled-components'
import { RiCloseLargeFill } from 'react-icons/ri'
import { FaStar, FaRegStar } from 'react-icons/fa'

Modal.setAppElement('#root')

const ReviewModal = ({ isOpen, setIsOpen }) => {
  const handleClose = (rating) => {
    setIsOpen(rating)
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={handleClose} style={customStyles}>
      <CloseButton onClick={handleClose}>
        <RiCloseLargeFill size="20" color="#5C5C5C" />
      </CloseButton>
      <section>
        <H2>Navi에 얼만큼 만족하고 계신가요?</H2>
        <Comment>스칼라 님의 소중한 의견이 Navi에게 큰 힘이 돼요.</Comment>
        <StarRating handleClose={(rating) => handleClose(rating)} />
      </section>
    </Modal>
  )
}
export default ReviewModal

const StarRating = ({ handleClose }) => {
  const [rating, setRating] = useState(0) // 실제 클릭된 별점
  const [hoverRating, setHoverRating] = useState(0) // 마우스 호버 중인 별점

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        marginRight: '0.5rem',
        marginLeft: '0.5rem',
      }}
    >
      <GradientDefs />
      {[1, 2, 3, 4, 5].map((num) => {
        const isFilled = hoverRating >= num || (!hoverRating && rating >= num)

        return (
          <ReviewButton
            key={num}
            onClick={() => handleClose(num)}
            onMouseEnter={() => setHoverRating(num)}
            onMouseLeave={() => setHoverRating(0)}
          >
            {isFilled ? <StyledStar /> : <StyledStarOutline />}
          </ReviewButton>
        )
      })}
    </div>
  )
}

const GradientDefs = () => (
  <svg width="0" height="0">
    <defs>
      <radialGradient id="star-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFDA5F" />
        <stop offset="100%" stopColor="#FFC400" />
      </radialGradient>
    </defs>
  </svg>
)

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'fit-content',
    maxWidth: '480px',
    height: 'max-content',
    maxHeight: '90%',
    padding: 20,
    paddingBottom: 40,
    paddingRight: 15,
    paddingLeft: 15,
    margin: 'auto',
    backgroundColor: 'white',
    borderRadius: '20px',
    zIndex: 1000,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
  },
}
const StyledStar = styled(FaStar)`
  width: 40px;
  height: 40px;
  fill: url(#star-gradient);
  filter: drop-shadow(0px 1px 4px #ffda5f);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`
const StyledStarOutline = styled(FaRegStar)`
  width: 40px;
  height: 40px;
  fill: url(#star-gradient);
  filter: drop-shadow(0px 1px 4px #ffda5f);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`
const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: auto;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`
const H2 = styled.h2`
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
  justify-self: center;
  padding: 1rem 0 0.5rem;
`
const Comment = styled.p`
  font-size: 0.7rem;
  margin: 0;
  padding: 0.5rem 0;
  justify-self: center;
  margin-bottom: 1rem;
`
const ReviewButton = styled.button`
  background-color: #fff;
  border: none;
  cursor: pointer;
`
