import React, { useEffect, useState } from 'react'
import { Nav } from '../components/common'
import styled from 'styled-components'
import { MainDashboard, MainDocument, MainUser } from '../components/admin'
import { SubDashboard, SubDocument, SubUser } from '../components/admin'
import { IoSearch } from 'react-icons/io5'
import axios from 'axios'

const AdminPage = () => {
  // type: document, user, dashboard
  const [type, setType] = useState('document')

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
        setUserList(response.data.body)
        // if (response.data.code === 200) {
        //   setUserList(response.data.body)
        // } else {
        //   alert('사용자 목록을 가져오는 데 실패했습니다.')
        // }
      })
      .catch((error) => {
        console.error('사용자 목록 가져오기 오류:', error)
        alert('사용자 목록을 가져오는 중 오류가 발생했습니다.')
      })
  }

  const handleUploadRole = (userId, role) => {
    // role: KIOSK, USER, ADMIN
    axios
      .patch(
        `${process.env.REACT_APP_SERVER_URL}/admin/users/${userId}`,
        { role: 'KIOSK' },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('NaviToken')}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data)
        if (response.data.code === 200) {
          alert('롤 업로드 성공')
          fetchUserList()
        } else {
          alert('롤 업로드 실패')
        }
      })
      .catch((error) => {
        console.error('롤 업로드 오류:', error)
        alert('롤 업로드 중 오류가 발생했습니다.')
      })
  }

  return (
    <AdminPageContainer>
      <Nav />

      <Container>
        <Menus>
          {/* 첫번째 서브 메뉴 */}
          <Menu>
            <MenuTop>
              <MenuTitle>
                {type === 'document' || type === 'user'
                  ? 'Navi 대시보드'
                  : '문서 관리'}
              </MenuTitle>
              <ChangeTypeBtn
                onClick={() =>
                  setType(
                    type === 'document' || type === 'user'
                      ? 'dashboard'
                      : 'document'
                  )
                }
              >
                <IoSearch size="28" color="#fff" />
              </ChangeTypeBtn>
            </MenuTop>

            {type === 'document' || type === 'user' ? (
              <SubDashboard />
            ) : (
              <SubDocument />
            )}
          </Menu>

          {/* 두번째 서브 메뉴 */}
          <Menu>
            <MenuTop>
              <MenuTitle>
                {type === 'user' ? '문서 관리' : '사용자 관리'}
              </MenuTitle>
              <ChangeTypeBtn
                onClick={() => setType(type === 'user' ? 'document' : 'user')}
              >
                <IoSearch size="28" color="#fff" />
              </ChangeTypeBtn>
            </MenuTop>

            {type === 'user' ? <SubDocument /> : <SubUser />}
          </Menu>
        </Menus>

        <Main>
          {type === 'document' ? (
            <MainDocument />
          ) : type === 'user' ? (
            <MainUser />
          ) : (
            <MainDashboard />
          )}
        </Main>
      </Container>
    </AdminPageContainer>
  )
}
export default AdminPage

const AdminPageContainer = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
`
const Container = styled.div`
  flex: 1;
  padding: 0 2rem 2rem;
  display: flex;
  gap: 1.2rem;
  min-height: 0px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`
const Menus = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 1.2rem;

  @media (max-width: 900px) {
    flex-direction: row;
  }
`
const Menu = styled.div`
  background-color: #fff;
  width: 17rem;
  padding: 1rem 1.5rem 1rem;
  border-radius: 25px;
  // text-align: center;
  flex: 1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;

  @media (max-width: 900px) {
    flex: 1;
    width: 100%;
    height: 12rem;
  }
`
const MenuTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  min-height: 0;
`
const MenuTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: bold;
  padding-top: 0.5rem;
  margin: 0;
`
const ChangeTypeBtn = styled.button`
  background-color: #ff8b8b;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  margin-right: -0.5rem;
  border-radius: 100%;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);

  &:hover {
    background-color: #ff6b6b;
  }
`
const Main = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #fff;
  border-radius: 25px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  padding: 0.6rem 1.5rem 1rem;
  min-width: 0;

  @media (max-width: 900px) {
    margin-left: 0;
  }
`
