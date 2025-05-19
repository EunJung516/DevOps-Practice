import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'

const SubUser = () => {
  const [userList, setUserList] = useState([])

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
      })
      .catch((error) => {
        console.error('사용자 목록 가져오기 오류:', error)
        alert('사용자 목록을 가져오는 중 오류가 발생했습니다.')
      })
  }

  return (
    <>
      <UserTitleWrapper>
        <div>사용자 이름</div>
        <div>부서</div>
        <div>만족도</div>
      </UserTitleWrapper>
      <ListItems>
        {userList.map((item, index) => (
          <UserItem
            key={index}
            id={item.id}
            name={item.name}
            department={item.department}
            satisfaction={item.averageRating}
          />
        ))}
      </ListItems>
    </>
  )
}
export default SubUser

const UserItem = ({ name, department, satisfaction }) => {
  return (
    <UserItemWrapper>
      <div>{name}</div>
      <div>{department}</div>
      <div>
        <Tag color="#DD8E1F" backgroundColor="#FBF4E7">
          {satisfaction}
        </Tag>
      </div>
    </UserItemWrapper>
  )
}

const UserTitleWrapper = styled.div`
  display: flex;
  padding: 0.3rem 0 0.5rem;
  align-items: center;
  border-bottom: 1px solid #c0c0c0;
  font-weight: bold;
  font-size: 0.8rem;

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
`
const ListItems = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`
const UserItemWrapper = styled.div`
  display: flex;
  padding: 0.7rem 0;
  align-items: center;
  border-bottom: 1px solid #eeeeee;

  & > div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  & > div:nth-child(1) {
    font-weight: 600;
    font-size: 0.8rem;
    flex: 3;
  }
  & > div:nth-child(2) {
    flex: 3;
    font-weight: 300;
    font-size: 0.8rem;
  }
  & > div:nth-child(3) {
    flex: 2;
    font-weight: 300;
    font-size: 0.8rem;
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
