import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Chatbox from '../components/misllanisous/Chatbox'
import Chatsearch from '../components/misllanisous/Chatsearch'
import Searchbox from '../components/misllanisous/Searchbox'
import { ChatState } from '../Context/Temprary.jsx';

const Chatpage = () => {
    return (
        <>
            {/* const {user} = ChatState(); */}
            <div className=' bg-orange-100 w-100%'>
                <div className='w-100% border-black border-2 bg-slate-100 p-2 '>
                    <Searchbox />
                </div>
                <div className='flex justify-between h-[90vh] my-2 mx-4'>
                    <Chatsearch />
                    <Chatbox />
                </div>
            </div>
        </>
    )
}

export default Chatpage


