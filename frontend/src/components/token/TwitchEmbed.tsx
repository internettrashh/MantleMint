import React from 'react';

interface TwitchEmbedProps {
  twitchUrl: string;
}

export default function TwitchEmbed({ twitchUrl }: TwitchEmbedProps) {
  const channelName = twitchUrl.split('/').pop() || '';
  
  return (
    <div className="w-full">
      <div className="aspect-video">
        <iframe
          src={`https://player.twitch.tv/?channel=${channelName}&parent=${window.location.hostname}`}
          frameBorder="0"
          allowFullScreen
          scrolling="no"
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
}