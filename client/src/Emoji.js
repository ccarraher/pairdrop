import React from 'react'
import { useState, useEffect } from 'react'

export default function Emoji() {
    const allowedEmojis = ["😀","😁","😂","😃","😄","😅","😆","😇","😈","👿","😉","😊","😋","😌","😍","😎","😏","😐","😑","😒","😓","😔","😕","😖","😗","😘","😙","😚","😛","😜","😝","😞","😟","😠","😡","😢","😣","😤","😥","😦","😧","😨","😩","😪","😫","😬","😭","😮","😯","😰","😱","😲","😳","😴","😵","😶","😷","😸","😹","😺","😻","😼","😽","😾","😿","🙀"];
    const [emoji, setEmoji] = useState();
    useEffect(() => {
        setEmoji(allowedEmojis[Math.floor(Math.random() * allowedEmojis.length)]);
    }, [])
    return (
        <div className="emoji-pic">
            {emoji}
        </div>
    )
}