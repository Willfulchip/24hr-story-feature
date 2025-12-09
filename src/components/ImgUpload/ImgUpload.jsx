import { useEffect, useRef, useState } from 'react';

import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import './ImgUpload.scss';

const fileToDataURL = (file) => {
   return new Promise((resovle, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resovle(reader.result);
      reader.onerror = (error) => reject(error);
   });
};

export function ImgUpload({ uploadIsOpen, setUploadIsOpen, onUpload }) {
   const [preview, setPreview] = useState('');
   const [isDragging, setIsDragging] = useState(false);
   const [isClosing, setIsClosing] = useState(false);

   const inputRef = useRef(null);

   useEffect(() => {
      if (!uploadIsOpen) {
         setIsClosing(false);
      }
   }, [uploadIsOpen]);

   function handleBoxClick() {
      inputRef.current.click();
   }

   function handleFileChange(e) {
      const file = e.target.files;
      if (file.length > 0) {
         handleProcessFile(file[0]);
      }
   }

   function handleCloseUploadBox() {
      setIsClosing(true);
      setTimeout(() => {
         setUploadIsOpen(false);
         setPreview('');
      }, 500);
   }

   function handleDragEnter(e) {
      e.preventDefault();
      setIsDragging(true);
   }

   function handleDragLeave(e) {
      e.preventDefault();
      setIsDragging(false);
   }

   function handleDragOver(e) {
      e.preventDefault();
   }

   function handleDrop(e) {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files;
      if (file.length > 0) {
         handleProcessFile(file[0]);
      }
   }

   async function handleProcessFile(file) {
      if (!file) return;

      try {
         const imgUrl = await fileToDataURL(file);
         setPreview(imgUrl);
         console.log('Process Success');
      } catch (error) {
         console.error('Process fail', error);
      }
   }

   function handleShare() {
      const newStory = {
         id: crypto.randomUUID(),
         username: 'Alex',
         avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=2',
         storyUrl: preview,
         timestamp: Date.now(),
      };

      onUpload(newStory);
      handleCloseUploadBox();
   }

   if (!uploadIsOpen && !isClosing) return null;

   return (
      <>
         <div className={`upload-wrapper ${isClosing ? 'close' : ''}`}>
            <div className='upload-container'>
               <div className='upload-header'>
                  <h2 className='upload-header__title'>Upload Your Moment</h2>
                  <Button
                     icon={<CloseOutlined />}
                     onClick={handleCloseUploadBox}
                     className='upload-header__btn--close'
                  ></Button>
               </div>

               <div
                  className={`upload-area ${isDragging ? 'isDragging' : ''}`}
                  onClick={handleBoxClick}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
               >
                  {preview ? (
                     <img src={preview} className='upload-area__image'></img>
                  ) : (
                     <span className='upload-area__text'>
                        Drag or Click to Upload your Moment
                     </span>
                  )}

                  <input
                     type='file'
                     ref={inputRef}
                     onChange={handleFileChange}
                     style={{ display: 'none' }}
                  />
               </div>

               {preview && (
                  <Button
                     className='share-btn'
                     size='large'
                     onClick={handleShare}
                  >
                     Share
                  </Button>
               )}
            </div>
         </div>
      </>
   );
}
