import { Col, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';
import RoomLists from './RoomLists';
import UserInfo from './UserInfo';
import UserLists from "./UserLists";

const SidebarStyled = styled.div`
  background: #fff;
  color: black;
  height: 100vh;
  border-right: 1px solid #ccc;
  magrin: 20px
`;


function SideBar() {
    return (
        <SidebarStyled>
            <Row>
                <Col span="24">
                    <UserInfo />
                    <RoomLists />
                    <UserLists />
                </Col>
            </Row>
        </SidebarStyled>
    );
}

export default SideBar;
