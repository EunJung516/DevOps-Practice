import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { FolderIcon } from '../../assets/common'
import axios from 'axios'
import Select from 'react-select'

const categoryList = [
  { value: 'REGULATION', label: '법률' },
  { value: 'SPACE', label: '공간' },
]
const securityList = [
  { value: 'HIGH', label: '상' },
  { value: 'MEDIUM', label: '중' },
  { value: 'LOW', label: '하' },
]

const FileUploader = ({ fetchDocumentList }) => {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [selectedSecurity, setSelectedSecurity] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const [isLoading, setIsLoading] = useState(false)

  const handleUploadFile = () => {
    if (!uploadedFile) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', uploadedFile)
    formData.append('category', selectedCategory.value)
    formData.append('security', selectedSecurity.value)

    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('NaviToken')}`,
        },
      })
      .then((response) => {
        console.log(response.data)
        setIsLoading(false)

        setUploadedFile(null)
        setSelectedCategory(null)
        setSelectedSecurity(null)

        if (response.data.code === 0) {
          alert('파일 업로드 성공')

          fetchDocumentList()
        } else {
          alert('파일 업로드 실패')
        }
      })
      .catch((error) => {
        setIsLoading(false)
        console.error('파일 업로드 오류:', error)
        alert('파일 업로드 중 오류가 발생했습니다.')
      })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) setUploadedFile(file)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setUploadedFile(file)
  }

  return (
    <>
      <StyledSelect
        options={categoryList}
        placeholder="문서 종류"
        onChange={(option) => {
          setSelectedCategory(option)
        }}
        value={selectedCategory}
        disabled={isLoading}
        isLoading={isLoading}
      />
      <StyledSelect
        options={securityList}
        placeholder="보안 등급"
        onChange={(option) => {
          setSelectedSecurity(option)
        }}
        value={selectedSecurity}
        disabled={isLoading}
        isLoading={isLoading}
      />
      <Wrapper>
        <DropArea
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          isDragging={isDragging}
        >
          <FolderIconWrapper src={FolderIcon} alt="upload" />

          {uploadedFile ? (
            <UploadComment
              style={{
                fontWeight: 'bold',
                fontSize: '0.7rem',
                margin: '0 0.5rem',
              }}
            >
              {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)
            </UploadComment>
          ) : (
            <>
              <UploadComment>파일을 드래그 해서</UploadComment>
              <UploadComment>업로드 하세요</UploadComment>
            </>
          )}

          <UploadButton
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            파일 선택
          </UploadButton>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </DropArea>

        <SubmitButton
          onClick={handleUploadFile}
          disabled={
            !uploadedFile || !selectedCategory || !selectedSecurity || isLoading
          }
        >
          업로드
        </SubmitButton>
      </Wrapper>
    </>
  )
}
export default FileUploader

const SubmitButton = styled.button`
  margin-top: 0.3rem;
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: #ff8b8b;
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background-color: #ff6b6b;
  }
  &:active {
    background-color: #ff4b4b;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  &:focus {
    outline: none;
  }
  &:focus-visible {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.5);
    border-radius: 6px;
  }
  &:focus:not(:focus-visible) {
    box-shadow: none;
  }
`

const StyledSelect = styled(Select)`
  font-size: 0.8rem;
  margin-bottom: 0.3rem;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
  border: none !important;
  border-radius: 5px;

  & > div {
    border: none !important;
    // box-shadow: none !important;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-height: 0;
  width: 100%;
`

const DropArea = styled.div`
  border: 2px dashed #caccd4;
  border-color: ${({ isDragging }) => (isDragging ? '#bac1dd' : '#caccd4')};
  text-align: center;
  border-radius: 8px;
  background-color: ${({ isDragging }) => (isDragging ? '#eef2ff' : '#F9FAFD')};
  transition: background-color 0.2s;
  flex: 1;
  min-height: 0;
  width: 100%;
  align-content: center;
  overflow: auto;
`
const UploadButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #4394ff;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 1rem;

  &:hover {
    background-color: #3a7bff;
  }
  &:active {
    background-color: #2f6eff;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`
const FolderIconWrapper = styled.img`
  width: 4rem;
  height: 4rem;
  margin-bottom: 1rem;
  padding-top: 1rem;
`
const UploadComment = styled.p`
  font-size: 0.8rem;
  margin: 0;
  margin-bottom: 0.3rem;
`
