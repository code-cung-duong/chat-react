import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Modal from 'antd/lib/modal/Modal';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppContext } from '../context/AppProvider';
import { AuthContext } from '../context/AuthProvider';

const LinkStyled = styled(Typography.Text)`
  display: block;
  margin-bottom: 5px;
  color: blue;
`;

const DivStyled = styled.div`
    display: flex;
    margin: 15px 10px 10px 0px;
    align-item: center;
    .user{
        color: #123;
        margin: 7px 15px 9px 15px;
        font-weight: 500;
    }
    .status{
      color: #123;
      position: absolute;
      right: 8%;
    }
    p{
        margin-top:6px;
    }

    .baChamIcon{
        font-size:'15pt';
        margin-top:'3px';
    }
`;

export default function ListMember() {

    const { members, setIsShowMembersVisible, isShowMembersVisible } = useContext(AppContext);
    const { user: {
        uid
    } } = useContext(AuthContext);
    const handleOk = () => {
        setIsShowMembersVisible(false);
    }

    return (
        <Modal title={
            "Danh sách thành viên (" + Array.from(members).length + ")"
        }
            visible={isShowMembersVisible}
            onCancel={handleOk}
            onOk={handleOk}>
            {
                Array.from(members).map((user) => (
                    <DivStyled key={
                        user.uid
                    }>
                        <Avatar size="large"
                            src={
                                user.photoUrl
                            }>
                            {
                                user.photoUrl ? '' : user.displayName.charAt(0)
                            }</Avatar>
                        <LinkStyled className="user">
                            {
                                uid === user.uid ? 'Bạn' : user.displayName
                            }</LinkStyled>
                        <Button style={
                            {
                                borderRadius: '50%',
                                float: 'right',
                                position: 'absolute',
                                left: '85%',
                                marginTop: '2px'
                            }
                        }
                            icon={
                                <EllipsisOutlined
                                    className="baChamIcon" />
                            }></Button>
                        { } </DivStyled>
                ))
            } </Modal>
    )
}
