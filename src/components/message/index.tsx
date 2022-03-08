import Notification from 'rc-notification'
import { NoticeContent, NotificationInstance } from 'rc-notification/es/Notification'
import 'rc-notification/assets/index.css';
import React from 'react'
import CloseCircleIcon from '../icons/closeCircleIcon';

type MessageType = 'error' | 'success' | 'warning'

interface MessageConfig extends NoticeContent {
  type?: MessageType
  title?: string
}

const Message = (function() {

  let message: NotificationInstance | undefined = undefined
  const config = (config: MessageConfig) => {}
  const remove = (key: string) => {}
  const destroy = () => {}

  const pop = (config: MessageConfig) => {
      
    const {
        title,
        className,
        key, content, onClose,
        closable = true,
        duration = 2,
        type = 'success',
    } = config

    message?.notice({
        duration,
        className: `message-component ${className} ${type}`,
        content: (
          <div>
            <div className='title'>{title? title : type}</div>
            <div className='info'>{content}</div>
          </div>
        ),
        key, closable,
        closeIcon: <CloseCircleIcon />,
        onClose() {
            onClose && onClose()
        }
    })
  }


  if(message) {
    return {
      config, pop, remove, destroy
    }
  }
  // 如果为创建实例，则创建默认实例
  Notification.newInstance({
    style: {top: 80, right: 20}
  }, (notification) => message = notification )

  return {
    config, pop, remove, destroy
  }
})()

export default Message