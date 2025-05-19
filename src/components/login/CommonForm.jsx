import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { NaviLogo } from '../../assets/common'
import { IoMdPricetag } from 'react-icons/io'
import { BiSolidLock, BiSolidBriefcase } from 'react-icons/bi'
import { HiMail } from 'react-icons/hi'
import { FaCircleUser } from 'react-icons/fa6'
import Select from 'react-select'

const departmentList = [
  { value: 'HR', label: '인사팀' },
  { value: 'IR', label: 'IR팀' },
  { value: 'CS', label: 'CS팀' },
  { value: 'Sales1', label: '영업팀1' },
  { value: 'Sales2', label: '영업팀2' },
  { value: 'QA', label: 'QA팀' },
]

const CommonForm = ({ pageType, setUserType }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [department, setDepartment] = useState('')

  const handleSignUp = () => {
    // department("HR", "IR", "CS", "Sales1", "Sales2", "QA"), role (USER)
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/auth/signup`, {
        name,
        employeeId,
        department,
        email,
        password,
        role: 'USER',
      })
      .then((response) => {
        console.log(response.data)
        if (response.data.code == 0) {
          alert('회원가입이 완료되었습니다.')

          setName('')
          setEmail('')
          setDepartment('')
          setEmployeeId('')
          setPassword('')
          navigate('/login')
        } else {
          alert('회원가입에 실패했습니다. 다시 시도해주세요.')
        }
      })
      .catch((error) => {
        console.error('회원가입 오류:', error)
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
      })
  }
  const handleLogin = () => {
    if (employeeId === 'adm' && password === 'adm') {
      setUserType('admin')
    }

    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {
        employeeId,
        password,
      })
      .then((response) => {
        console.log(response.data)
        if (response.data.code == 0) {
          alert('로그인 성공')
          localStorage.setItem('NaviToken', response.data.body.accessToken)
          localStorage.setItem(
            'NaviUserType',
            employeeId === 'adm' && password === 'adm' ? 'admin' : 'user'
          )
          localStorage.setItem('NaviUserId', employeeId)
          navigate('/')
        } else {
          alert('로그인 실패. 아이디와 비밀번호를 확인해주세요.')
        }
      })
      .catch((error) => {
        console.error('로그인 오류:', error)
        alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (pageType === 'login') {
      handleLogin()
    } else {
      handleSignUp()
    }
  }

  // login input 정보
  const loginInput = [
    {
      type: 'text',
      placeholder: '사번을 입력하세요',
      icon: <IoMdPricetag size={30} color="#5C5C5C" />,
      onChange: (e) => setEmployeeId(e.target.value),
      value: employeeId,
    },
    {
      type: 'password',
      placeholder: '비밀번호를 입력하세요',
      icon: <BiSolidLock size={30} color="#5C5C5C" />,
      onChange: (e) => setPassword(e.target.value),
      value: password,
    },
  ]
  // signup input 정보
  const signupInput = [
    {
      type: 'text',
      placeholder: '성명을 입력하세요',
      icon: <FaCircleUser size={30} color="#5C5C5C" />,
      onChange: (e) => setName(e.target.value),
      value: name,
    },
    {
      type: 'text',
      placeholder: '사번을 입력하세요',
      icon: <IoMdPricetag size={30} color="#5C5C5C" />,
      onChange: (e) => setEmployeeId(e.target.value),
      value: employeeId,
    },
    {
      type: 'text',
      placeholder: '부서를 선택하세요',
      icon: <BiSolidBriefcase size={30} color="#5C5C5C" />,
      onChange: (e) => setDepartment(e.target.value),
      value: department,
    },
    {
      type: 'email',
      placeholder: '이메일을 입력하세요',
      icon: <HiMail size={30} color="#5C5C5C" />,
      onChange: (e) => setEmail(e.target.value),
      value: email,
    },
    {
      type: 'password',
      placeholder: '비밀번호를 입력하세요',
      icon: <BiSolidLock size={30} color="#5C5C5C" />,
      onChange: (e) => setPassword(e.target.value),
      value: password,
    },
  ]

  return (
    <FormWrapper>
      {/* 로그인/회원가입  */}
      <H1>{pageType == 'login' ? 'Login' : 'SignUp'} Page</H1>
      <NaviLogo />
      <InfoText>
        Navi에 오신 걸 환영합니다. {pageType == 'login' ? '로그인' : '회원'}{' '}
        정보를 입력하세요
      </InfoText>

      {/* 로그인/회원가입 폼 */}
      <Form>
        {pageType === 'login'
          ? loginInput.map((input, index) => (
              <InputContainer
                key={index}
                type={input.type}
                placeholder={input.placeholder}
                icon={input.icon}
                onChange={input.onChange}
                value={input.value}
              />
            ))
          : signupInput.map((input, index) => (
              <InputContainer
                key={index}
                type={input.type}
                placeholder={input.placeholder}
                icon={input.icon}
                onChange={input.onChange}
              />
            ))}
        <Button type="submit" onClick={handleSubmit}>
          {pageType == 'login' ? '로그인' : '회원가입'}
        </Button>
      </Form>

      {/* 추가 메뉴 */}
      <LoginMenu>
        <ForgotPassword>
          {pageType == 'login'
            ? '비밀번호를 잊으셨나요?'
            : '* 모든 항목은 필수 입력 사항입니다'}
        </ForgotPassword>
        <SignUp
          onClick={() => navigate(pageType == 'login' ? '/sign-up' : '/login')}
        >
          {pageType == 'login' ? '회원가입' : '로그인하기'}
        </SignUp>
      </LoginMenu>
    </FormWrapper>
  )
}
export default CommonForm

const InputContainer = ({ type, placeholder, icon, onChange, value }) => {
  return (
    <>
      {placeholder === '부서를 선택하세요' ? (
        <InputWrapper>
          {icon}
          {/* <Input
            required
            type={type}
            placeholder={placeholder}
            onChange={onChange}
          /> */}
          <StyledSelect
            options={departmentList}
            placeholder={placeholder}
            onChange={(option) => {
              onChange({ target: { value: option.value } })
            }}
          />
        </InputWrapper>
      ) : (
        <InputWrapper>
          {icon}
          <Input
            required
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
          />
        </InputWrapper>
      )}
    </>
  )
}

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  width: 30vw;
  border-radius: 25px;
  padding: 3.5rem 2rem 2.5rem;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  min-width: 20rem;
  position: relative;
  z-index: 10 !important;
`
const H1 = styled.h1`
  display: none;
`
const InfoText = styled.p`
  font-size: 0.8rem;
  margin: 1.5rem 0 0.5rem;
`
const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  svg {
    margin: 0 0.5rem 0 0.3rem;
  }
`
const Input = styled.input`
  width: 100%;
  padding: 0.7rem 1rem;
  margin: 0.5rem 0;
  box-sizing: border-box;
  border: none;
  border-radius: 5px;
  background-color: #f1f1f1;
  &:focus {
    // border: -1px solid #ccc;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);
    background-color: #fff;
    outline: none;
  }
`

const StyledSelect = styled(Select)`
  font-size: 0.8rem;
  width: 100%;
  background-color: #f1f1f1 !important;
  margin-bottom: 0.3rem;
  border: none !important;
  border-radius: 5px;

  & > div {
    padding: 0.1rem 0.35rem;
    border: none !important;
    // box-shadow: none !important;
    background-color: #f1f1f1 !important;
  }
`

const Button = styled.button`
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.8rem;
  background-color: #ff8b8b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  &:hover {
    background-color: #ff6b6b;
  }
  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px rgba(255, 0, 0, 0.5);
  }
`
const LoginMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  justify-content: space-between;
  margin-top: 0.5rem;

  p {
    margin: 0;
    font-size: 0.8rem;
    font-weight: bold;
    color: #666;
    cursor: pointer;
  }
  p:nth-child(1) {
    color: #ff6b6b;
    &:hover {
      color: rgb(255, 85, 85);
    }
  }
  p:nth-child(2) {
    color: #417aff;
    &:hover {
      color: rgb(0, 102, 255);
    }
  }
`
const ForgotPassword = styled.p``
const SignUp = styled.p``
