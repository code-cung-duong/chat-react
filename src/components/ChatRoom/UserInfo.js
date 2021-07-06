import { PoweroffOutlined } from '@ant-design/icons';
import { Avatar, Button, Tooltip, Typography } from 'antd';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../../context/AppProvider';
import { AuthContext } from '../../context/AuthProvider';
import firebase, { auth } from '../../firebase/Config';


const UserInfoStyled = styled.div` 
display: flex;
justify-content: space-between;
align-items: center;
padding: 12px 16px;
border-bottom: 1px solid #ccc;
box-shadow: -4px -1px 9px 1px #ccc;

.username {
  margin-left: 10px;
  font-size: 16pt;
  font-weight: 700;
}

.logout:hover{
    color: red;
    border-radius: 50%;
}

.logout{
    border-radius: 50%;
}
`;


function UserInfo() {

    const {
        user: {
            displayName,
            photoURL,
            uid
        }
    } = useContext(AuthContext);
    const { clearState } = useContext(AppContext);

    if (uid !== undefined) {
        var userRef = firebase.firestore().doc('/users/' + uid);
    }
    var isOfflineForFirestore = {
        status: 'offline',
        last_changed: firebase.firestore.FieldValue.serverTimestamp()
    };

    return (
        <UserInfoStyled>
            <div>
                <Tooltip placement="right"
                    title={displayName}>
                    <Avatar size='large'
                        src={photoURL}>
                        {
                            photoURL ? '' : displayName?.charAt(0)
                        }</Avatar>
                </Tooltip>

                <Typography.Text className="username">Chat</Typography.Text>
            </div>
            <Tooltip title="Đăng xuất" placement="top">
                <Button className="logout"
                    icon={<PoweroffOutlined />}
                    style={
                        { border: 'none' }
                    }
                    onClick={
                        () => {

                            auth.signOut();
                            clearState();
                            userRef.update(isOfflineForFirestore);

                        }
                    }></Button>
            </Tooltip>

        </UserInfoStyled>
    );
}

export default UserInfo;
