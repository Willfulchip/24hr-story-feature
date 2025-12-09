import { useEffect, useState, useMemo } from 'react';

import { Button } from 'antd';
import {
   CloseOutlined,
   LeftCircleOutlined,
   RightCircleOutlined,
} from '@ant-design/icons';

import './StoryViewer.scss';

export function StoryViewer({
   activeId,
   setActiveId,
   stories,
   modalOpen,
   setModalOpen,
}) {
   const [isClosing, setIsClosing] = useState(false);
   const currentIndex = stories.findIndex((item) => item.id === activeId);
   const story = stories[currentIndex];

   useEffect(() => {
      if (!modalOpen || !story) return;

      const timer = setTimeout(() => {
         handleNextStory();
      }, 3000);

      return () => clearTimeout(timer);
   }, [currentIndex, modalOpen, story]);

   const [startX, setStartX] = useState(0);
   const [endX, setEndX] = useState(0);

   const diff = useMemo(() => startX - endX, [startX, endX]);

   useEffect(() => {
      if (diff < -150) {
         handlePrevStory();
      } else if (diff > 150) {
         handleNextStory();
      }
   }, [diff]);

   if (!modalOpen || !story) return;

   const diffMs = Date.now() - story.timestamp;
   const diffMins = Math.floor(diffMs / 1000 / 60);
   const diffHours = Math.floor(diffMins / 60);

   function handleTouchStart(e) {
      setStartX(e.touches[0].clientX);
   }

   function handleTouchEnd(e) {
      setEndX(e.changedTouches[0].clientX);
   }

   function handleAnimationEnd() {
      if (isClosing) {
         setModalOpen(false);
         setIsClosing(false);
         setStartX(0);
         setEndX(0);
      }
   }

   function handlePrevStory() {
      if (currentIndex > 0) {
         setActiveId(stories[currentIndex - 1].id);
      } else {
         setActiveId(stories[0].id);
      }
   }

   function handleNextStory() {
      if (currentIndex < stories.length - 1) {
         setActiveId(stories[currentIndex + 1].id);
      } else {
         setIsClosing(true);
      }
   }

   return (
      <>
         <div
            className={`story-display-wrapper ${isClosing ? 'close' : ''}`}
            onAnimationEnd={handleAnimationEnd}
         >
            <div
               className='story-display-container'
               onTouchStart={handleTouchStart}
               onTouchEnd={handleTouchEnd}
            >
               <div className='progress-bar-container'>
                  {stories.map((item, index) => {
                     let status = '';
                     if (index < currentIndex) {
                        status = 'completed';
                     } else if (index === currentIndex) {
                        status = 'active';
                     } else {
                        status = 'waiting';
                     }

                     return (
                        <div
                           key={item.id}
                           className={`progress-item ${status}`}
                        >
                           <div className='progress-fill'></div>
                        </div>
                     );
                  })}
               </div>

               <div className='story-display'>
                  <div className='story-display--info'>
                     <span>{story.username}</span>

                     <span>
                        {diffHours > 0
                           ? `${diffHours}h ${Math.floor(
                                diffMins - diffHours * 60
                             )}m`
                           : `${diffMins}m`}{' '}
                        ago
                     </span>

                     <Button
                        icon={<CloseOutlined />}
                        onClick={() => setIsClosing(true)}
                        style={{}}
                     ></Button>
                  </div>

                  <img
                     src={story.storyUrl}
                     alt={story.username || ''}
                     className='story-display--img'
                  />
               </div>

               <div className='pagination-container'>
                  <Button
                     className='prev-story-btn'
                     onClick={handlePrevStory}
                     icon={<LeftCircleOutlined />}
                     size='large'
                  ></Button>

                  <Button
                     className='next-story-btn'
                     onClick={handleNextStory}
                     icon={<RightCircleOutlined />}
                     size='large'
                  ></Button>
               </div>
            </div>
         </div>
      </>
   );
}
