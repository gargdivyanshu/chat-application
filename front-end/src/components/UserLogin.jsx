import { useState } from 'react'
import '../style.css'
import _ from 'lodash'

const UserLogin = ({setUser}) => {
    const [userName, setUserName] = useState()
    const handleUser = async () => {
        if(!userName) return;
        localStorage.setItem('user', userName)
        setUser(userName)
        const avatarUrl = `https://picsum.photos/id/${_.random(1,1000)}/200/300`;
        localStorage.setItem('avatar', avatarUrl)

        try {
            await fetch('http://localhost:3002/saveUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: userName,
                    avatarUrl: avatarUrl,
                }),
            });
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }
  return (
    <div className='login_container'>
        <div className='login_title'>
            <h1>Chat App</h1>
        </div>
        <div className='login_form'>
            <input type="text" placeholder='Enter a Unique Name'
            onChange={(e) => setUserName(e.target.value)}/>
            <button onClick={handleUser}>Login</button>
        </div>
    </div>
  )
}

export default UserLogin