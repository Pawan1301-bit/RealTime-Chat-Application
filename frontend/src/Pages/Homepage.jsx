import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom'

const Homepage = () => {
  const [userdata, setuserdata] = useState({ name: '', email: '', password: '', confirmpassword: '', pic: null })
  const [login, setLogin] = useState(true);

  const navigate = useNavigate();

   useEffect(() => {
        const UserInfo = localStorage.getItem("UserInfo");
        if(UserInfo){
          //move them back to the login page
          navigate('/chats');
        }
  
    }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setuserdata({
      ...userdata,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setuserdata({
      ...userdata,
      image: file, // Store the selected image
    });
  };

  const notify = () =>   toast('Account created successfully 🥳');
  

  const signUpHandler = async () => {
    if (userdata.password === userdata.confirmpassword) {
      //now we will send the data to backend
      const { confirmpassword, ...dataToSend } = userdata;
      try {
        const response = await axios.post('http://localhost:5000/api/user', dataToSend);
        console.log(`response : ${response}`);
        notify();
      } catch (error) {
        console.log("error sending data", error);
      }
      setuserdata({ name: '', email: '', password: '', confirmpassword: '', pic: null });
    } else {
      alert('the conformation password does not match')
      setuserdata({ name: '', email: '', password: '', confirmpassword: '', pic: null });
    }
  }

  const loginHandler = async () => {
    const { email, password } = userdata;
    try {
      const {data} = await axios.post('http://localhost:5000/api/user/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      const storedData = localStorage.getItem("UserInfo");
      console.log("Verification - Data stored in localStorage:", storedData);
      
      navigate('/chats');
    } catch (e) {
      alert('login failed');
      console.log('error : ', e);
    }
    setuserdata({ name: '', email: '', password: '', confirmpassword: '', pic: null });
  }


  return (<>

    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      Type="success"
    />

    <div className='flex justify-center items-center h-screen bg-orange-100'>

      <div >
        <h2 className='text-4xl font-bold text-center p-4'> Chit-Chat🦜🦜</h2>

        <div className="box border-2 border-black p-8 h-[72vh] w-[35vw] rounded-3xl bg-white">


          {login && (<><h2 className='text-2xl font-bold text-orange-500 py-5'> Welcome Back login to your account</h2></>)}
          {!login && (<><h2 className='text-2xl font-bold text-orange-500 py-2'> Create Account</h2></>)}


          <label htmlFor="email"
            className='my-2'>email : </label>
          <input type="email"
            placeholder='enter Your email address'
            name='email'
            onChange={handleChange}
            value={userdata.email}
            className='border-black border-2 px-2 py-1.5 w-[30vw] rounded-full' />

          {!login && (<>
            <label htmlFor="name"
              className='my-2'>name : </label>
            <input type="text"
              placeholder='enter the  username name'
              name='name'
              value={userdata.name}
              onChange={handleChange}
              className='border-black border-2 px-2 py-1.5 w-[30vw] rounded-full' /></>)}



          <label htmlFor="password"
            className='my-2'>password : </label>
          <input type="password"
            placeholder='enter the password'
            name='password'
            onChange={handleChange}
            value={userdata.password}
            className='border-black border-2 px-2 py-1.5 w-[30vw] rounded-full' />

          {!login && (<> <label htmlFor="confirmpassword"
            className='my-2'>confirmpassword : </label>
            <input type="password"
              onChange={handleChange}
              name='confirmpassword'
              value={userdata.confirmpassword}
              placeholder='confirm password'
              className='border-black border-2 px-2 py-1.5 w-[30vw] rounded-full' /></>)}


          {!login && (<> <label htmlFor="image" className='my-2 w-[30vw]'>Profile photo : </label>
            <input type="file"
              placeholder='choose file'
              accept="image/*"
              onChange={handleImageChange}
              className='my-4' /></>)}

          {login && (<><div className="btn text-center ">
            <button onClick={loginHandler} className='my-6 w-[15vw] border-black border-2 px-2 py-1.5 mx-3 rounded-full bg-orange-600 text-white'>login</button>
            {/* <button className='my-6 w-[15vw] border-orange-600 border-2 px-2 py-1.5 mx-3 rounded-full  text-orange-700'>Signup</button> */}
          </div></>)}

          {!login && (<><div className="btn text-center ">
            {/* <button className='my-6 w-[15vw] border-black border-2 px-2 py-1.5 mx-3 rounded-full bg-orange-600 text-white'>login</button> */}
            <button onClick={signUpHandler} className='my-6 w-[15vw] border-orange-600 border-2 px-2  py-1.5 mx-3 rounded-full  text-orange-500 hover:text-orange-700 hover:border-orange-600'>Signup</button>
          </div></>)}

          <div className="switch text-center">
            {login && (<>I don't have a account <button onClick={() => { setLogin(false) }} className='text-orange-600 border-b-2 border-orange-400 border-dashed'>create account</button></>)}
            {!login && (<>I already have a account <button onClick={() => { setLogin(true) }} className='text-orange-600 border-b-2 border-orange-400 border-dashed'>login account</button></>)}

          </div>
        </div>
      </div>

    </div>

  </>
  )
}

export default Homepage
