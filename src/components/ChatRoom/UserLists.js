import { Avatar, Collapse, Typography } from 'antd';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthProvider';
import UseFirestore from '../../hooks/UseFirestore';

const { Panel } = Collapse

const PanelStyled = styled(Panel)`

  


  &&& {
    .ant-collapse-header{
        color: blue;
        font-weight: 500;
    }
    p {
      font-weight: 500;
      
    }

    .ant-collapse-content-box {
      padding: 0 40px;
      max-height: 290px;
      overflow-y: auto;
    }

    .add-room {
      color: #123;
      padding: 0;
    }
  }
`;

const LinkStyled = styled(Typography.Link)`
  display: block;
  margin-bottom: 5px;
  color: blue;
  
`;

const DivStyled = styled.div`
    display: flex;
    margin: 15px 10px 10px 0px;
    .user{
        color: #123;
        margin-left: 10px;
    }
    .status{
      color: blue;
      position: absolute;
      right: 8%;
    }
    .status1{
        color: #555;
        position: absolute;
        right: 8%;
      }
    .status2{
        color: #999;
        position: absolute;
        right: 8%;
    }
`;

const CollapseStyled = styled(Collapse)`
border-bottom: 1px solid #ccc;
box-shadow: 0px 9px 7px -9px #ccc;

`;

function UserLists() {

    const { user: {
        uid
    } } = useContext(AuthContext);

    const users = UseFirestore('users','');
    
    return (
        <CollapseStyled defaultActiveKey="1" ghost>
            <PanelStyled header="Danh sách bạn bè" key="1">
                {
                    Array.from(users).filter(user => user.uid !== uid).map((user) => {

                        return (
                            <DivStyled key={
                                user.uid
                            }>

                                <Avatar size="small"
                                    src={
                                        user.photoUrl
                                    }>
                                    {
                                        user.photoUrl ? '' : user.displayName.charAt(0)
                                    }</Avatar>
                                <LinkStyled className="user">
                                    {
                                        user.displayName
                                    }</LinkStyled>

                                {
                                    user.status === 'online' ? <p className="status">Online</p> : <></>
                                }

                                {
                                    user.status === 'offline' ? <p className="status2">Offline</p> : <></>
                                }
                                {
                                    user.status === 'away' ? <p className="status1">Sleep</p> : <></>
                                } </DivStyled>
                        )
                    })
                } </PanelStyled>
        </CollapseStyled>
    );
}

export default UserLists;
