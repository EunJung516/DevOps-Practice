import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styled, { keyframes } from 'styled-components'
import { IoSearch } from 'react-icons/io5'
import { RiUserForbidFill } from 'react-icons/ri'
import { FaSpinner } from 'react-icons/fa'

const MainUser = () => {
  const [userList, setUserList] = useState([])
  const [searchId, setSearchId] = useState('')
  const [searchName, setSearchName] = useState('')
  const [searchDepartment, setSearchDepartment] = useState('')
  const [searchList, setSearchList] = useState([])

  useEffect(() => {
    fetchUserList()
  }, [])

  const fetchUserList = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('NaviToken')}`,
        },
      })
      .then((response) => {
        console.log(response.data)
        setUserList(response.data)
        setSearchList(response.data)
      })
      .catch((error) => {
        console.error('사용자 목록 가져오기 오류:', error)
        // alert('사용자 목록을 가져오는 중 오류가 발생했습니다.')
      })
  }

  const handleDeleteUser = (userId, setIsDeleted) => {
    axios
      .delete(`${process.env.REACT_APP_SERVER_URL}/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('NaviToken')}`,
        },
      })
      .then((response) => {
        console.log(response.data)
        setIsDeleted(false)
        if (response.data.code === 200) {
          alert('사용자 삭제 성공')
          fetchUserList()
        } else {
          alert('사용자 삭제 실패')
        }
      })
      .catch((error) => {
        setIsDeleted(false)
        console.error('사용자 삭제 오류:', error)
        alert('사용자 삭제 중 오류가 발생했습니다.')
      })
  }

  const handleSearch = () => {
    const filteredUsers = userList.filter((user) => {
      return (
        (searchId ? user.employeeId.includes(searchId) : true) &&
        (searchName ? user.name.includes(searchName) : true) &&
        (searchDepartment ? user.department.includes(searchDepartment) : true)
      )
    })
    setSearchList(filteredUsers)
  }

  return (
    <>
      <TitleTop>
        <H1>사용자 관리</H1>
      </TitleTop>

      <div>
        <SearchTitleWrapper>
          <SubTitle>사용자 검색</SubTitle>
          <SearchBtn onClick={handleSearch}>검색하기</SearchBtn>
        </SearchTitleWrapper>

        <SearchInputs>
          <div>
            <SearchTitle>사번</SearchTitle>
            <SearchInput>
              <Input
                type="text"
                placeholder="사번을 입력하세요"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <IoSearch size={20} color="#5C5C5C" />
            </SearchInput>
          </div>
          <div>
            <SearchTitle>이름</SearchTitle>
            <SearchInput>
              <Input
                type="text"
                placeholder="이름을 입력하세요"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <IoSearch size={20} color="#5C5C5C" />
            </SearchInput>
          </div>
          <div>
            <SearchTitle>부서</SearchTitle>
            <SearchInput>
              <Input
                type="text"
                placeholder="부서를 입력하세요"
                value={searchDepartment}
                onChange={(e) => setSearchDepartment(e.target.value)}
              />
              <IoSearch size={20} color="#5C5C5C" />
            </SearchInput>
          </div>
        </SearchInputs>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <UserTitleWrapper>
          <SubTitle>사용자 목록</SubTitle>
          <UserCount>총 {userList.length}명</UserCount>
        </UserTitleWrapper>

        <UserListWrapper>
          <UserListTitleWrapper>
            <div>사번</div>
            <div>이름</div>
            <div>부서</div>
            <div>이메일</div>
            <div>만족도</div>
            <div>권한</div>
            <div>삭제</div>
          </UserListTitleWrapper>

          <UserListItems>
            {searchList.map((item, index) => (
              <UserItem
                key={index}
                id={item.id}
                employeeId={item.employeeId}
                name={item.name}
                department={item.department}
                email={item.email}
                satisfaction={item.averageRating}
                role={item.role}
                handleDeleteUser={handleDeleteUser}
              />
            ))}
          </UserListItems>
        </UserListWrapper>
      </div>
    </>
  )
}
export default MainUser

const UserItem = ({
  id,
  employeeId,
  name,
  department,
  email,
  satisfaction,
  role,
  handleDeleteUser,
}) => {
  const [isDeleted, setIsDeleted] = useState(false)
  const handleTitleClick = (id) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      setIsDeleted(true)
      handleDeleteUser(id, setIsDeleted)
    }
  }

  return (
    <UserItemWrapper>
      <div>{employeeId}</div>
      <div>{name}</div>
      <div>{department}</div>
      <div>{email}</div>
      <div>
        <Tag color="#DD8E1F" backgroundColor="#FBF4E7">
          {satisfaction}
        </Tag>
      </div>
      <div>
        <Tag
          color={role === 'USER' ? '#586773' : '#CF607B'}
          backgroundColor={role === 'USER' ? '#E1F1FF' : '#FDE9EE'}
        >
          {role}
        </Tag>
      </div>
      <div>
        {isDeleted ? (
          <DeleteBtn onClick={() => handleTitleClick(id)}>
            <SpinnerIcon />
          </DeleteBtn>
        ) : (
          <DeleteBtn onClick={() => handleTitleClick(id)}>
            <RiUserForbidFill size={20} color="#D9D9D9" />
          </DeleteBtn>
        )}
      </div>
    </UserItemWrapper>
  )
}

const spin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`

// 2. 애니메이션이 적용된 Spinner 컴포넌트 생성
const SpinnerIcon = styled(FaSpinner)`
  color: #ff8b8b;
  font-size: 20px;
  animation: ${spin} 1s linear infinite;
`

const TitleTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const H1 = styled.h1`
  font-size: 1.3rem;
  margin: 0.65rem 0 -0.39rem;
`
const SubTitle = styled.h2`
  font-size: 1rem;
  margin: 0;
`
const SearchTitleWrapper = styled.div`
  display: flex;
  padding: 0.3rem 0 0.5rem;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #c0c0c0;
  align-items: flex-end;
`
const SearchBtn = styled.button`
  background-color: #4294ff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #3a7bff;
  }
  &:active {
    background-color: #2f6eff;
  }
`

// search inputs
const SearchInputs = styled.section`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  gap: 0.5rem;

  & > div {
    display: flex;
    flex-direction: column;
    width: 33%;
    min-width: 0;
    overflow-y: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`
const SearchTitle = styled.div`
  font-size: 0.8rem;
  font-weight: bold;
  margin: 0.25rem 0 0.5rem;
`
const SearchInput = styled.div`
  display: flex;
  width: 100%;
  padding: 0.4rem 0.6rem;
  border: 1px solid #c0c0c0;
  border-radius: 5px;
  font-size: 0.8rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4294ff;
    box-shadow: 0px 0px 0px rgba(66, 148, 255, 0.5);
  }
`
const Input = styled.input`
  flex: 1;
  padding: 0;
  border: none;
  border-radius: 5px;
  font-size: 0.8rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border: none;
  }
`

// user list
const UserListWrapper = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  // padding: 0.8rem 1rem;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
  max-height: 80vh;
  min-width: 0;
`
const UserTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0 0.5rem;
  align-items: center;
  font-weight: bold;
  font-size: 0.8rem;
`
const UserCount = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
`
const UserListTitleWrapper = styled.section`
  display: flex;
  padding: 0.3rem 0 0.5rem;
  align-items: center;
  font-weight: bold;
  font-size: 0.8rem;
  padding: 0.8rem;
  background-color: #f5f5f5;
  border-radius: 15px 15px 0 0;

  & > div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  & > div:nth-child(1) {
    flex: 3;
  }
  & > div:nth-child(2) {
    flex: 3;
  }
  & > div:nth-child(3) {
    flex: 2;
  }
  & > div:nth-child(4) {
    flex: 5;
  }
  & > div:nth-child(5) {
    flex: 2;
  }
  & > div:nth-child(6) {
    flex: 2;
  }
  & > div:nth-child(7) {
    flex: 1;
  }
`
const UserListItems = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0.2rem 0.8rem;
`
const UserItemWrapper = styled.section`
  display: flex;
  padding: 0.7rem 0;
  align-items: center;
  border-bottom: 1px solid #eeeeee;
  font-size: 0.8rem;
  font-weight: 500;
  color: #5c5c5c;
  // cursor: pointer;

  &:hover {
    // background-color: #f0f0f0;
  }
  & > div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  & > div:nth-child(1) {
    flex: 3;
    font-weight: bold;
  }
  & > div:nth-child(2) {
    flex: 3;
  }
  & > div:nth-child(3) {
    flex: 2;
  }
  & > div:nth-child(4) {
    flex: 5;
  }
  & > div:nth-child(5) {
    flex: 2;
  }
  & > div:nth-child(6) {
    flex: 2;
  }
  & > div:nth-child(7) {
    flex: 1;
  }
`
const DeleteBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;

  &:hover svg {
    color: #ff8b8b !important;
  }
  &:active svg {
    color: #ff6b6b !important;
  }
  &:focus {
    outline: none;
  }
`
const Tag = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  font-weight: 700;
  font-size: 0.8rem;
  width: fit-content;
  height: 0.1rem;
  padding: 0.8rem 0.5rem;
  color: ${(props) => props.color};
  background-color: ${(props) => props.backgroundColor};
  cursor: default;
`
