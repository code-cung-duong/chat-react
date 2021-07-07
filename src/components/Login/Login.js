import { FacebookFilled, GoogleOutlined } from '@ant-design/icons';
import firebase from '@firebase/app';
import { Button, Col, Row, Typography } from 'antd';
import React from 'react';
import { auth } from '../../firebase/Config';
import { generateKeywords, setDocuments } from '../../firebase/Service';
const { Title } = Typography


const fbProvider = new firebase.auth.FacebookAuthProvider();
const ggProvider = new firebase.auth.GoogleAuthProvider();


function Login() {
    const handleLoginGoogle = async () => {
        if (Notification.permission === "granted") {
            const { additionalUserInfo, user } = await auth.signInWithPopup(ggProvider);
            if (additionalUserInfo.isNewUser) {
                setDocuments('users', {
                    displayName: user.displayName,
                    email: user.email,
                    photoUrl: user.photoURL,
                    uid: user.uid,
                    providerId: additionalUserInfo.providerId,
                    keywords: generateKeywords(user.displayName?.toLowerCase()),
                    countNotify: [],
                    status: '',
                    last_changed: '',
                })
                setDocuments('notifys',{
                    countNotify: [],
                    uid: user.uid
                });

            }
        } else {
            alert("Vui lòng cho phép thông báo");
            Notification.requestPermission();
        }

    }
    
    const handleLoginFacebook = () => {
        auth.signInWithPopup(fbProvider);
    };

    return (
        <div>
            <Row justify='center'
                style={
                    { height: 800 }
                }>
                <Col span={10}>
                    <Title style={
                        {
                            textAlign: 'center',
                            margin: '30px'
                        }
                    }
                        level={2}>
                        Đăng nhập để tham gia với chúng tôi
                    </Title>
                    <Button icon={<GoogleOutlined />}
                        style={
                            {
                                width: '100%',
                                fontSize: '16px',
                                color: 'red',
                                height: '40px'

                            }
                        }
                        onClick={
                            () => handleLoginGoogle()
                        }>
                        Đăng nhập bằng Google
                    </Button>
                    <Button icon={<FacebookFilled />}
                        style={
                            {
                                marginTop: '5px',
                                width: '100%',
                                fontSize: '16px',
                                color: 'blue',
                                height: '40px'
                            }
                        }
                        onClick={handleLoginFacebook}>
                        Đăng nhập bằng Facebook (beta)
                    </Button>
                </Col>
            </Row>
        </div>
    );
}

export default Login;
