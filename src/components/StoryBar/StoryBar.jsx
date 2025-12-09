import { useEffect, useState } from 'react';

import { Avatar, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { ImgUpload } from '../ImgUpload/ImgUpload';
import { StoryViewer } from '../StoryViewer/StoryViewer';

import './StoryBar.scss';

export function StoryBar() {
   const [uploadIsOpen, setUploadIsOpen] = useState(false);
   const [modalOpen, setModalOpen] = useState(false);
   const [stories, setStories] = useState(loadData);
   const [activeId, setActiveId] = useState(null);

   function loadData() {
      const local = localStorage.getItem('stories');
      if (local) {
         try {
            const data = JSON.parse(local);

            const EXPIRATION_TIME = 24 * 60 * 60 * 1000;
            const now = Date.now();

            const validData = data.filter((item) => {
               return now - item.timestamp < EXPIRATION_TIME;
            });

            if (validData.length !== data.length) {
               localStorage.setItem('stories', JSON.stringify(validData));
            }
            return validData;
         } catch (error) {
            console.error(error);
            return [];
         }
      }

      return [];
   }

   function handleOpenUpload() {
      setUploadIsOpen(true);
   }

   function handleAddStory(newStory) {
      const copy = [newStory, ...stories];
      setStories(copy);
      localStorage.setItem('stories', JSON.stringify(copy));
   }

   return (
      <>
         <div className='story-container'>
            <Button
               shape='circle'
               size='large'
               icon={<PlusOutlined />}
               onClick={handleOpenUpload}
               className='story-container__add-btn'
            />

            {stories.map((item) => {
               return (
                  <Avatar
                     key={item.id}
                     size='large'
                     src={item.avatarUrl}
                     alt={`${item.username}`}
                     onClick={() => {
                        setActiveId(item.id);
                        setModalOpen(true);
                     }}
                     className='story-avatar'
                  />
               );
            })}
         </div>

         <StoryViewer
            activeId={activeId}
            setActiveId={setActiveId}
            stories={stories}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
         />

         <ImgUpload
            uploadIsOpen={uploadIsOpen}
            setUploadIsOpen={setUploadIsOpen}
            onUpload={handleAddStory}
         />
      </>
   );
}
