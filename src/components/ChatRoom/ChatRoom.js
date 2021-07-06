import { Col, Row } from 'antd';
import React from 'react';
import ChatWindow from './ChatWindow';
import SideBar from './SideBar';

function ChatRoom() {


    return (
        <div>
            <Row>
                <Col span="5">
                    <SideBar />
                </Col>
                <Col span="19">
                    <ChatWindow />
                </Col>
            </Row>
        </div>
    );
}

export default ChatRoom;
