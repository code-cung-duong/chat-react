import { LockTwoTone, UnlockTwoTone } from '@ant-design/icons';
import { Button, Collapse, Tooltip, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import styled from 'styled-components';
import { AppContext } from '../../context/AppProvider';
import { AuthContext } from '../../context/AuthProvider';
import { db } from '../../firebase/Config';

const { Panel } = Collapse

const PanelStyled = styled(Panel)`
  


  &&& {
    .ant-collapse-header
    ,
    p {
      color: blue;
      font-weight: 500;
    }

    .ant-collapse-content-box {
      padding: 0 10px;
      max-height: 290px;
      overflow-y: auto;
    }
    .ant-typography:hover {
      textShadow: rgb(222 222 222) 0px 0px 7px;
      background-color: #f1f1f1;
      transition: color 0.2s;
    }

    .ant-typography{
      color: #000;
      font-weight: 400;
    }

    .add-room {
      color: #456;
      margin: 15px 0 10px 90px;
      padding: 3px 8px 5px 8px;      
      border: 1px solid #aaa;
    }

    .add-room:hover{
      color: #fff;
      background-color: #ccc;
      border: 1px solid #bbb;
      box-shadow: 1px 1px 8px 0px #bbb;
    }
 
  }
`;

const LinkStyled = styled(Typography.Link)`
  display: block;
  margin-bottom: -1px;
  color: #ddd; 
  padding: 15px 10px 15px 10px;
  border-radius: 5px;
  
`;

const CollapseStyled = styled(Collapse)`
    border-bottom: 1px solid #ccc;
    box-shadow: 0px 9px 7px -9px #ccc;
    ::-webkit-scrollbar {
        width: 10px;
    }
     
    /* Track */
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
        -webkit-border-radius: 10px;
        border-radius: 10px;
    }
     
    /* Handle */
    ::-webkit-scrollbar-thumb {
        -webkit-border-radius: 10px;
        border-radius: 10px;
        background: #ccc; 
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
    }
    ::-webkit-scrollbar-thumb:window-inactive {
        background: rgba(255,0,0,0.4); 
    }

`;


function RoomLists() {
    const { rooms, setIsAddRoomVisible, setSelectedRoomId, selectedRoomId } = useContext(AppContext);
    const { user: {
        uid
    } } = useContext(AuthContext);
    // const [rooms2, setRooms2] = useState();
    useEffect(() => {console.log(rooms);
        const abc = db.collection('notifys').doc(uid).onSnapshot((snap) => {
            snap.data().countNotify.forEach((item) => {
                
                const de = rooms.map((item2) => item2);
                console.log(de);
                return;
            })

            return abc;
        })

        return abc;
    }, [])

    return (

        <CollapseStyled defaultActiveKey="0" ghost>
            <PanelStyled header="Nhóm của bạn" key="1">
                {
                    rooms.length !== 0 ? <>{
                        rooms.map((room) => (
                            <LinkStyled key={
                                room.id
                            }
                                onClick={
                                    () => setSelectedRoomId(room.id)
                                }
                                style={
                                    room.id === selectedRoomId ? {
                                        textShadow: 'rgb(222 222 222) 0px 0px 7px',
                                        backgroundColor: '#f1f1f1',
                                        transition: 'all 0.2s',
                                        color: '#000',
                                        // fontWeight: '500'
                                    } : {}
                                }
                                className="chu">
                                {
                                    room.name
                                }
                                <> {
                                    Array.from(room.members).length === 1 ? <Tooltip title="Nhóm chỉ có mình bạn, hãy mời thêm bạn bè." placement="right">
                                        <LockTwoTone style={
                                            {
                                                fontSize: '16pt',
                                                float: 'right'
                                            }
                                        } />
                                    </Tooltip> : <Tooltip title="Nhóm có cả bạn bè của bạn" placement="right">
                                        <UnlockTwoTone style={
                                            {
                                                fontSize: '16pt',
                                                float: 'right'
                                            }
                                        } />
                                    </Tooltip>
                                } </>

                            </LinkStyled>
                        ))
                    }</> : <p style={
                        {
                            color: 'gray',
                            margin: '10px 0px 7px 30px'
                        }
                    }>Bạn chưa tham gia nhóm nào</p>
                }
                <Button type='text' className='add-room'
                    onClick={
                        () => setIsAddRoomVisible(true)
                    }>
                    Tạo nhóm
                </Button>
                <ReactAudioPlayer src="mess.mp3" className="audio" />

            </PanelStyled>
        </CollapseStyled>
    );
}

export default RoomLists;
