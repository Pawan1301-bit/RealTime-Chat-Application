import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { FaBell } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { ChatState } from '../../Context/Temprary';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { configs } from 'eslint-plugin-react-refresh';
// import SideDrawer from '../others/SideDrawer.jsx'


const Searchbox = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loadingChat, setloadingChat] = useState(false);

    const [userInfo, setUserInfo] = useState()
    const [search, setSearch] = useState('')
    const [searchUsers, setSearchUsers] = useState([])
    const [loading, setLoading] = useState()
    const [selectedChat, setselectedChat] = useState()

    const navigate = useNavigate();
    const drawerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                setIsDrawerOpen(false);
            }
        };

        if (isDrawerOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDrawerOpen]);

    useEffect(() => {
      setSearchUsers([]);
    }, [isDrawerOpen])
    


    const getInitials = (name) => {
        if (!name || typeof name !== "string") return "NA";

        const trimmed = name.trim();
        if (trimmed === "") return "NA";

        const parts = trimmed.split(" ");
        const first = parts[0]?.[0] || "";
        const second = parts[1]?.[0] || "";

        const initials = (first + second).toUpperCase();
        return initials || "NA";
    };

    const handleuser = () => {
        setIsDrawerOpen(true)
    }

    const accessChat=(userId)=>{
        try {
            setloadingChat(true);

            const config = {
                headers: {
                    "Content-type" :"application/json",          
                    Authorization: `Bearer ${userInfo.token}` 
                }
            }

            const {data} = axios.post('http://localhost:5000/api/chat', {userId}, config);
            setselectedChat(data);
            setloadingChat(false);

        } catch (error) {
            alert(`errror accessing chat`);
            console.log(`error : ${error}`);
        }   
        
        setIsDrawerOpen(false)
    }

    const handleSearch = async (e) => {
        setSearch(e.target.value);
        if (search === '') {
           alert('please enter something!!!');
        } else {
            try {
                setLoading(true);
                const config = {
                    headers:{
                        Authorization: `Bearer ${userInfo.token}`
                    }
                }
                const {data} = await axios.get(`http://localhost:5000/api/user/?search=${search}`, config );
                setSearchUsers(data);
                setLoading(false);
            } catch (error) {
                console.log(`error occured searching user ${error}`);
                setLoading(false);
            }
            
        }
    }



    useEffect(() => {
        const storedInfo = JSON.parse(localStorage.getItem('userInfo'));
        setUserInfo(storedInfo);

        if (!storedInfo) {
            navigate('/');
        } else {
            console.log(storedInfo);
        }
    }, []);

    return (<>

        {isModalOpen && (
            <div className="text-center fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-lg  w-96 h-[40vh] relative">
                    <button
                        className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
                        onClick={() => setIsModalOpen(false)}
                    >
                        &times;
                    </button>
                    <h2 className="text-3xl font-bold mb-4">Profile Info</h2>
                    <p className='text-xl my-1'>{userInfo?.name}</p>
                    <p className='flex font-bold  p-2 ml-[7vw]'>{userInfo.pic ? userInfo.pic : <CgProfile size={120} />}</p>
                    <p className='text-xl'><strong>Email:</strong> {userInfo?.email}</p>
                    <div>
                    </div>

                </div>
            </div>
        )}

        {isDrawerOpen && (
            <div
                ref={drawerRef}
                className={`fixed top-0 left-0 h-full w-96 bg-white shadow-lg p-4 z-50 overflow-y-scroll transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}

            >
                <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="absolute top-4 right-4 text-xl text-gray-500 hover:text-red-600"
                >
                    &times;
                </button>
                <h2 className="text-xl font-semibold mb-4">Search for the User</h2>
                <input type="text"
                    placeholder='search user by name or id 🔎'
                    name='serach'
                    value={search}
                    onChange={(e) => { setSearch(e.target.value) }}
                    className='border-black border-2 p-2 rounded-full' />

                <button
                    onClick={handleSearch}
                    className='border-black border-2 mx-4 px-2 py-1.5 rounded-3xl hover:scale-105 duration-300 '>go</button>


                {loading ? (<>
                    <div className='h-10 bg-gray-200 my-4'></div>
                    <div className='h-10 bg-gray-200 my-4'></div>
                    <div className='h-10 bg-gray-200 my-4'></div>
                    <div className='h-10 bg-gray-200 my-4'></div>
                    <div className='h-10 bg-gray-200 my-4'></div>
                    <div className='h-10 bg-gray-200 my-4'></div>
                    <div className='h-10 bg-gray-200 my-4'></div>
                    <div className='h-10 bg-gray-200 my-4'></div>
                    <div className='h-10 bg-gray-200 my-4'></div>
                    <div className='h-10 bg-gray-200 my-4'></div>
                    <div className='h-10 bg-gray-200 my-4'></div>
                    </>
                ): (
                    searchUsers.length > 0 > 0 && searchUsers.map((user_i)=>(
                       <div onClick={()=>{accessChat(user_i.name)}} key={user_i._id} className='flex justify-center   h-10 my-4 bg-gray-700 py-2 hover:bg-orange-500 text-white'>
                            <div className='px-2'><CgProfile size={24}/></div>
                            {user_i.name}
                       </div> 
                    ))
                )}
            </div>
        )}


        <div className='flex justify-between'>
            <div className='m-0' >
                <button onClick={handleuser}
                    className='border-black border-2 p-2 rounded-xl mx-8 hover:scale-105 duration-500 bg-slate-200'>
                    Search Users 🔎
                </button>
            </div>

            <h2 className='font-bold text-3xl p-1'>Chit-Chat🦜🦜</h2>

            <ul className=' flex gap-4'>
                <li className='pt-2.5'><FaBell title='No Latest Notification' size={24} /></li>

                <li className='pt-2'>
                    {userInfo?.image ? (
                        <img
                            src={userInfo.image}
                            alt='Profile'
                            className='w-8 h-8 rounded-full object-cover'
                        />
                    ) : (
                        <div className='flex  mb-1'>

                            <div className='h-8 w-8 rounded-full bg-green-700 flex items-center justify-center text-white font-semibold'>
                                {getInitials(userInfo?.name)}

                            </div>
                            <label htmlFor="profile"></label>
                            <select name="profile" id="profile"
                                onChange={(e) => {
                                    if (e.target.value === 'logout') {
                                        localStorage.removeItem("userInfo");
                                        navigate('/');

                                    } else if (e.target.value === 'profile') {
                                        setIsModalOpen(true);
                                    }
                                    e.target.value = "";
                                }}
                                className='w-4'>
                                <option value=""></option>
                                <option value="profile">My Profile</option>
                                <option value="logout">Logout</option>
                            </select>
                        </div>
                    )}
                </li>
            </ul>

        </div>

    </>
    )
}

export default Searchbox



{/* 
 */}

//  <label htmlFor="profile"><CgProfile size={25} /></label>
//                             <select name="profile" id="" className='w-4 mx-2'>
//                                 <option value=""></option>
//                                 <option value="">logout</option>
//                                 <option value="">viewprofile
//                                 </option>
//                             </select>
