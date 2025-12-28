'use client';
import {useState} from 'react';
export default function LikeButton () {
    const [likes,SetLikes] = useState(0);
    
    function HandleClick() {
        SetLikes(likes+2);
    }
    return <button onClick={HandleClick}>Like ({likes})</button>
}
