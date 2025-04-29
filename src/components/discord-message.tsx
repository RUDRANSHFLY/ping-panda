import React from 'react'

interface DiscordMessageProps {
    avatarSrc : string;
    avatarAlt : string;
    userName : string;
    timeStamp : string;
    badgeText? : string;
    badgeColor? : string;
    title : string;
    content : {
        [key:string] : string
    }
}

const DiscordMessage = ({avatarAlt,avatarSrc,content,timeStamp,title,userName,badgeColor = "#43b581",badgeText} : DiscordMessageProps) => {
  return (
    <div className='w-full flex items-start justify-start'>
        <div className='flex items-center mb-2'>

        </div>
    </div>
  )
}

export default DiscordMessage