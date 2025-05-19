import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'

const SubDocument = () => {
  const [documentList, setDocumentList] = useState([])

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
        } else {
          alert('문서 목록을 가져오는 데 실패했습니다.')
        }
      })
      .catch((error) => {
        console.error('문서 목록 가져오기 오류:', error)
        alert('문서 목록을 가져오는 중 오류가 발생했습니다.')
      })
  }

  return (
    <>
      <DocumentTitleWrapper>
        <div>문서명</div>
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
          />
        ))}
      </ListItems>
    </>
  )
}
export default SubDocument

const DocumentItem = ({
  fileName,
  securityLevel,
  registeredDB,
  uploadDate,
  id,
}) => {
  let fileType = fileName.split('.').pop()
  fileType = fileType == 'pdf' ? 'PDF' : 'TEXT'
  const nameWithoutExtension = fileName.slice(0, fileName.lastIndexOf('.'))
  securityLevel =
    securityLevel === 'HIGH' ? '상' : securityLevel === 'MEDIUM' ? '중' : '하'
  registeredDB = registeredDB === 'SPACE' ? '공간' : '법률'
  uploadDate = uploadDate.split('T')[0]
  uploadDate = uploadDate.replace(/-/g, '.')

  return (
    <DocumentItemWrapper>
      <div>{nameWithoutExtension}</div>
      <div>{uploadDate}</div>
    </DocumentItemWrapper>
  )
}

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
    flex: 2;
  }
  & > div:nth-child(2) {
    flex: 1;
  }
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
    font-size: 0.8rem;
    flex: 2;
  }
  & > div:nth-child(2) {
    flex: 1;
    font-weight: 300;
    font-size: 0.8rem;

    display: flex;
    justify-content: center;
    align-items: center;
    height: 0.1rem;
    padding: 0.8rem 0.5rem;
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
