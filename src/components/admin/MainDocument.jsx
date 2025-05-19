import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { FileUpload } from '.'
import { SlArrowUp, SlArrowDown } from 'react-icons/sl'
import { ImBoxRemove } from 'react-icons/im'
import axios from 'axios'
import { FaSpinner } from 'react-icons/fa'

const MainDocument = () => {
  const [documentList, setDocumentList] = useState([])
  const [editList, setEditList] = useState([])
  const [textFileCount, setTextFileCount] = useState(0)
  const [pdfFileCount, setPdfFileCount] = useState(0)

  useEffect(() => {
    fetchDocumentList()
  }, [])

  const fetchDocumentList = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/documents`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('NaviToken')}`,
        },
      })
      .then((response) => {
        console.log(response.data)
        if (response.data.code === 0) {
          setDocumentList(response.data.body)

          const textFiles = response.data.body.filter(
            (item) => item.title.split('.').pop() === 'txt'
          )
          const pdfFiles = response.data.body.filter(
            (item) => item.title.split('.').pop() === 'pdf'
          )
          setTextFileCount(textFiles.length)
          setPdfFileCount(pdfFiles.length)
        } else {
          alert('문서 목록을 가져오는 데 실패했습니다.')
        }
      })
      .catch((error) => {
        console.error('문서 목록 가져오기 오류:', error)
        alert('문서 목록을 가져오는 중 오류가 발생했습니다.')
      })
  }

  const handleDelete = (id, setIsDeleted) => {
    axios
      .delete(`${process.env.REACT_APP_SERVER_URL}/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('NaviToken')}`,
        },
      })
      .then((response) => {
        console.log(response.data)
        setIsDeleted(false)
        if (response.data.code === 0) {
          alert('문서 삭제 성공')
          fetchDocumentList()
        } else {
          alert('문서 삭제 실패')
        }
      })
      .catch((error) => {
        setIsDeleted(false)
        console.error('문서 삭제 오류:', error)
        alert('문서 삭제 중 오류가 발생했습니다.')
      })
  }

  const handleTitleClick = (id, setIsDeleted) => {
    handleDelete(id, setIsDeleted)
  }

  return (
    <>
      <TitleTop>
        <H1>문서 관리</H1>
        {/* <SaveBtn>저장하기</SaveBtn> */}
      </TitleTop>

      <Container>
        <LeftContent>
          {/* <div>
            <SubTitle>최근 수정 날짜</SubTitle>

            <Wrapper>
              <BoldText>2025년 5월 8일 목요일</BoldText>
              <LightText style={{ margin: '0.4rem 0 0' }}>
                오전 9시 20분
              </LightText>
            </Wrapper>
          </div> */}

          <div>
            <SubTitle>총 문서 수</SubTitle>
            <Wrapper>
              <LightText>
                <div>PDF 파일</div>
                <div>{pdfFileCount}개</div>
              </LightText>
              <LightText style={{ margin: '0.4rem 0 0.6rem' }}>
                <div>Text 파일</div>
                <div>{textFileCount}개</div>
              </LightText>
              <BoldText>
                <div>총 문서 수</div>
                <div>{documentList.length}개</div>
              </BoldText>
            </Wrapper>
          </div>

          <FileUploadWrapper>
            <SubTitle>파일 업로드</SubTitle>
            <FileUpload fetchDocumentList={fetchDocumentList} />
          </FileUploadWrapper>
        </LeftContent>

        <RightContent>
          <RightContentWrapper style={{ flex: 1 }}>
            <SubTitle>문서 목록</SubTitle>
            <Wrapper style={{ flex: 1, minHeight: 0 }}>
              <DocumentTitleWrapper>
                <div>문서명</div>
                <div>파일형식</div>
                <div>보안등급</div>
                <div>등록DB</div>
                <div>업로드 날짜</div>
                <div>삭제</div>
              </DocumentTitleWrapper>
              <ListItems>
                {documentList.map((item, index) => (
                  <DocumentItem
                    key={index}
                    id={item.id}
                    fileName={item.title}
                    securityLevel={item.security}
                    registeredDB={item.category}
                    uploadDate={item.createdAt}
                    handleTitleClick={handleTitleClick}
                  />
                ))}
              </ListItems>
            </Wrapper>
          </RightContentWrapper>

          {/* <EditBtns>
            <DownBtn>
              <SlArrowDown size="25" color="#fff" />
            </DownBtn>
            <UpBtn>
              <SlArrowUp size="25" color="#fff" />
            </UpBtn>
          </EditBtns>

          <RightContentWrapper style={{ flex: 1 }}>
            <SubTitle>수정 문서 목록</SubTitle>
            <Wrapper style={{ flex: 1, minHeight: 0 }}>
              <DocumentTitleWrapper>
                <div>문서명</div>
                <div>파일형식</div>
                <div>보안등급</div>
                <div>등록DB</div>
                <div>업로드 날짜</div>
              </DocumentTitleWrapper>
              <ListItems>
                {documentList.map((item, index) => (
                  <DocumentItem
                    key={index}
                    id={item.id}
                    fileName={item.title}
                    securityLevel={item.security}
                    registeredDB={item.category}
                    uploadDate={item.createdAt}
                    handleTitleClick={handleTitleClick}
                  />
                ))}
              </ListItems>
            </Wrapper>
          </RightContentWrapper> */}
        </RightContent>
      </Container>
    </>
  )
}
export default MainDocument

const DocumentItem = ({
  fileName,
  securityLevel,
  registeredDB,
  uploadDate,
  id,
  handleTitleClick,
}) => {
  let fileType = fileName.split('.').pop()
  fileType = fileType == 'pdf' ? 'PDF' : 'TEXT'
  const nameWithoutExtension = fileName.slice(0, fileName.lastIndexOf('.'))
  securityLevel =
    securityLevel === 'HIGH' ? '상' : securityLevel === 'MEDIUM' ? '중' : '하'
  registeredDB = registeredDB === 'SPACE' ? '공간' : '법률'
  uploadDate = uploadDate.split('T')[0]
  uploadDate = uploadDate.replace(/-/g, '.')
  const [isDeleted, setIsDeleted] = useState(false)

  const handleTitleClickCustom = (id) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      setIsDeleted(true)
      handleTitleClick(id, setIsDeleted)
      // setIsDeleted(false)
    }
  }

  return (
    <DocumentItemWrapper>
      <div>{nameWithoutExtension}</div>
      <div>
        <Tag
          color={fileType === 'PDF' ? '#6D5C9D' : '#5C5C5C'}
          backgroundColor={fileType === 'PDF' ? '#E9E1FF' : '#EDEDED'}
        >
          {fileType}
        </Tag>
      </div>
      <div>
        <Tag
          color={
            securityLevel === '상'
              ? '#CF607B'
              : securityLevel === '중'
              ? '#DD8E1F'
              : '#586773'
          }
          backgroundColor={
            securityLevel === '상'
              ? '#FDE9EE'
              : securityLevel === '중'
              ? '#FBF4E7'
              : '#E1F1FF'
          }
        >
          {securityLevel}
        </Tag>
      </div>
      <div>
        <Tag
          color={registeredDB === '법률' ? '#D47624' : '#5F9650'}
          backgroundColor={registeredDB === '법률' ? '#FFE3CB' : '#E4F6DF'}
        >
          {registeredDB}
        </Tag>
      </div>
      <div>{uploadDate}</div>
      <div onClick={() => handleTitleClickCustom(id)}>
        {isDeleted ? <SpinnerIcon /> : <ImBoxRemove size="20" />}
      </div>
    </DocumentItemWrapper>
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
  margin: 0.6rem 0;
`
const SaveBtn = styled.button`
  background-color: #4294ff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  color: white;
  border: none;
  padding: 0.9rem 1.5rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 15px;
  cursor: pointer;

  &:hover {
    background-color: #3a7bff;
  }
  &:active {
    background-color: #2f6eff;
  }
`
const SubTitle = styled.h2`
  font-size: 1rem;
  margin: 0;
  margin-bottom: 0.5rem;
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 0.8rem 1rem;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
  // max-height: 95vh;
  min-width: 0;
`
const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  gap: 2rem;
  box-sizing: border-box;
  min-height: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0;
    gap: 1rem;
    margin-top: 1rem;
  }
`
const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 10rem;
  max-width: 10rem;
`
const RightContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
  min-width: 0;
`

const BoldText = styled.p`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin: 0;
  font-size: 0.9rem;
`
const LightText = styled.p`
  display: flex;
  justify-content: space-between;
  margin: 0;
  font-size: 0.9rem;
`

const RightContentWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
`
const ListItems = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`
const DocumentItemWrapper = styled.div`
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
    font-size: 0.85rem;
    flex: 4;
  }
  & > div:nth-child(2) {
    flex: 2;
  }
  & > div:nth-child(3) {
    flex: 2;
  }
  & > div:nth-child(4) {
    flex: 2;
  }
  & > div:nth-child(5) {
    flex: 3;
    font-weight: 300;
    font-size: 0.8rem;
  }
  & > div:nth-child(6) {
    flex: 1;
    font-weight: 300;
    font-size: 0.8rem;
    color: #ff8b8b;
    cursor: pointer;

    &:hover {
      color: #ff7b7b;
    }
    &:active {
      color: #ff6b6b;
    }
  }
`
const DocumentTitleWrapper = styled.div`
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
    flex: 4;
  }
  & > div:nth-child(2) {
    flex: 2;
  }
  & > div:nth-child(3) {
    flex: 2;
  }
  & > div:nth-child(4) {
    flex: 2;
  }
  & > div:nth-child(5) {
    flex: 3;
  }
  & > div:nth-child(6) {
    flex: 1;
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
const FileUploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`

const EditBtns = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
`
const EditBtn = styled.button`
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 100%;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
`
const UpBtn = styled(EditBtn)`
  background-color: #ff8b8b;
  &:hover {
    background-color: #ff7b7b;
  }
  &:active {
    background-color: #ff6b6b;
  }
`
const DownBtn = styled(EditBtn)`
  background-color: #5c5c5c;
  &:hover {
    background-color: #4c4c4c;
  }
  &:active {
    background-color: #3c3c3c;
  }
`
