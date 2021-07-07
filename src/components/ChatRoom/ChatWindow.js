import {
    ChromeOutlined,
    Loading3QuartersOutlined,
    LogoutOutlined,
    SendOutlined,
    SettingOutlined,
    UsergroupAddOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    Button,
    Dropdown,
    Form,
    Input,
    Menu,
    Result
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { delay } from 'lodash';
import React, {
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import ReactAudioPlayer from 'react-audio-player';
import styled from 'styled-components';
import { AppContext } from '../../context/AppProvider';
import { AuthContext } from '../../context/AuthProvider';
import firebase, { db } from '../../firebase/Config';
import { addDocuments } from '../../firebase/Service';
import UseFirestore from '../../hooks/UseFirestore';
import IMessage from './IMessage ';
import Message from './Message';


const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);
  box-shadow: -3px 13px 6px -10px rgb(230 230 230);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }

  .load{
    fontSize: '56px',
    color: '#08c',
    position: 'absolute',
    top: '50%',
    left: '50%'
  }

  .settingIcon{
      font-size: '15px';
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;


function ChatWindow() {
    const [inputValue, setInputValue] = useState('');
    const [form1] = useForm();
    const {
        selectedRoom,
        selectedRoomId,
        setSelectedRoomId,
        setIsInviteMemberVisible,
        setIsAddRoomVisible,
        setIsShowMembersVisible,
        members
    } = useContext(AppContext);
    const {
        user: {
            uid,
            displayName,
            photoURL,
            countNotify
        }
    } = useContext(AuthContext);

    const inputRef = useRef(null);
    const [isLoadingMes, setIsLoadingMes] = useState(true);
    const messageListRef = useRef(null);
    const [tab, setTab] = useState('');

    const messagesCondition = useMemo(() => {
        return { fieldName: 'roomId', operator: '==', compareValue: selectedRoomId };
    }, [selectedRoomId])

    const messages = UseFirestore('messages', messagesCondition);


    useEffect(() => {
        setIsLoadingMes(true);
        if (selectedRoomId) {
            inputRef.current.focus();
        }


    }, [selectedRoomId])


    const userRef = firebase.firestore().doc('/users/' + uid);

    var isOfflineForFirestore = useMemo(() => ({ status: 'offline', last_changed: firebase.firestore.FieldValue.serverTimestamp() }), []);

    var isOnlineForFirestore = useMemo(() => ({ status: 'online', last_changed: firebase.firestore.FieldValue.serverTimestamp() }), []);

    var isAwayForFirestore = useMemo(() => ({ status: 'away', last_changed: firebase.firestore.FieldValue.serverTimestamp() }), []);

    useEffect(() => {
        const abc = firebase.database().ref('.info/connected').on('value', function (snapshot) {
            if (snapshot?.val() === false && uid !== undefined) {
                userRef?.update(isOfflineForFirestore);
                return;
            };
            if (uid === undefined) {
                userRef?.update(isOfflineForFirestore);
            } else if (uid !== undefined && tab !== 'hidden') {
                firebase.database().ref('/status/' + uid)?.onDisconnect().update(isOfflineForFirestore).then(function () {
                    userRef?.update(isOnlineForFirestore);
                });
            }
        });

        return abc;


    }, [uid])


    window.addEventListener("unload", () => {
        userRef?.update(isOfflineForFirestore);
    })

    const abc = useCallback(() => {
        if (uid === undefined) {
            userRef?.update(isOfflineForFirestore);
        } else if (document.visibilityState === 'hidden' && tab !== 'hidden' && uid !== undefined) {
            userRef?.update(isAwayForFirestore);
            setTab('hidden');
        } else if (document.visibilityState === 'visible' && tab !== 'visible' && uid !== undefined) {
            setTab('visible');
            userRef?.update(isOnlineForFirestore);
        }

    }, []);

    useEffect(() => {
        document.addEventListener('visibilitychange', abc, false);
    }, [abc])


    useEffect(() => {
        delay(() => {
            setIsLoadingMes(false);
        }, 10, '');

        return () => { }
    }, [messages])


    useEffect(() => {
        const abc = db.collection('notifys').doc(uid).onSnapshot((snap) => {
            const oldData = snap?.data()?.countNotify;
            if (selectedRoomId && oldData !== undefined) {
                db.collection('notifys')?.doc(uid).update({
                    countNotify: [...Array.from(oldData).filter((u) => u !== selectedRoomId)]
                })
                console.log("da xem");
            }
            return abc;
        })
        return abc;
    }, [selectedRoomId])

    useLayoutEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    })

    const loadMessage = () => {
        const load = messages.map((ms) => {
            return ms.uid === uid ? <IMessage key={
                ms.id
            }
                text={
                    ms.text
                }
                photoURL={
                    ms.photoURL
                }
                displayName={
                    ms.displayName
                }
                createdAt={
                    ms.createAt
                } /> : <Message key={
                    ms.id
                }
                    text={
                        ms.text
                    }
                    photoURL={
                        ms.photoURL
                    }
                    displayName={
                        ms.displayName
                    }
                    createdAt={
                        ms.createAt
                    } />

        })
        return load;

    }

    useEffect(() => {
        const abc = db.collection('notifys').doc(uid).onSnapshot((snap) => {
            console.log("tin nhan moi");
            const oldData = snap?.data()?.countNotify;
            if (document.visibilityState !== 'visible') {
                document.getElementsByClassName("audio")[0]?.play();
            }

            document.title = oldData.length === 0 ? 'Fake Messenger' : "(" + oldData.length + ") Fake Messenger";

            return abc;
        })
        return abc;
    }, [])


    const loadingListMessage = () => (isLoadingMes === true ? <Loading3QuartersOutlined spin
        style={
            {
                fontSize: '56px',
                color: '#08c',
                position: 'absolute',
                top: '45%',
                left: '50%'
            }
        } /> : <MessageListStyled className="listMessage"
            ref={messageListRef}>
        {
            loadMessage()
        } </MessageListStyled>)


    const handleOnSubmit = () => {
        if (inputValue.trim().length) {

            addDocuments('messages', {
                text: inputValue,
                uid,
                photoURL,
                displayName,
                roomId: selectedRoomId
            });

            members?.filter((u) => u.uid !== uid).forEach((user) => {
                db.collection('notifys').doc(user.id).get().then((doc) => {
                    db.collection('notifys').doc(user.id).update({
                        countNotify: [
                            ...doc.data().countNotify,
                            selectedRoomId
                        ],
                        createAt: firebase.firestore.FieldValue.serverTimestamp()
                    })
                });
            })

            form1.setFieldsValue({ message: '' });
            inputRef.current.focus();
        }
    }

    const handleOnChange = (e) => {
        setInputValue(e.target.value);
    }


    const menu = useMemo(() => (
        <Menu>
            <Menu.Item onClick={
                () => setIsShowMembersVisible(true)
            }
                icon={<UserOutlined />}
                key="1">Xem thành viên</Menu.Item>
            <Menu.Item onClick={
                () => setIsInviteMemberVisible(true)
            }
                icon={<UsergroupAddOutlined />}
                key="2">Mời bạn bè</Menu.Item>
            <Menu.Item onClick={
                () => setSelectedRoomId('')
            }
                icon={<LogoutOutlined />}
                key="3">Thoát</Menu.Item>
        </Menu>
    ), [setIsShowMembersVisible, setIsInviteMemberVisible, setSelectedRoomId]);

    const noSelectRoom = () => (
        <Result icon={
            <ChromeOutlined
                spin />
        }
            title="Click chọn một nhóm để bắt đầu nào"
            style={
                { color: 'red' }
            }
            extra={
                <Button
                    type="primary"
                    ghost
                    onClick={
                        () => setIsAddRoomVisible(true)}>
                    Bạn có thể tạo nhóm và mời bạn bè vào tại đây</Button>
            } />
    )

    const sendForm = () => (
        <FormStyled form={form1}>
            <Form.Item name='message'>
                <Input ref={inputRef}
                    onChange={handleOnChange}
                    onPressEnter={handleOnSubmit}
                    placeholder='Nhấn tổ hợp Window + . để thêm emoji . . .'
                    bordered={false}
                    autoComplete='off' />
            </Form.Item>
            <Button style={
                {
                    width: '40px',
                    color: 'blue'
                }
            }
                icon={
                    <SendOutlined
                        className="settingIcon" />
                }
                onClick={handleOnSubmit}></Button>
        </FormStyled>
    )

    const mainLayout = () => (
        <WrapperStyled>
            <HeaderStyled>
                <div className='header__info'>
                    <p className='header__title'>
                        {
                            !selectedRoom ? '' : selectedRoom.name
                        }</p>
                    <span className='header__description'>
                        {
                            !selectedRoom ? '' : selectedRoom.description
                        }</span>
                </div>
                <ButtonGroupStyled>
                    <Dropdown.Button style={
                        { bordered: 'none' }
                    }
                        icon={<SettingOutlined />}
                        overlay={menu}></Dropdown.Button>
                </ButtonGroupStyled>
            </HeaderStyled>

            <ContentStyled> {
                loadingListMessage()
            }
                {
                    sendForm()
                } </ContentStyled>
        </WrapperStyled>
    )


    return (
        <>
            <ReactAudioPlayer src="mess.mp3" className="audio" /> {
                selectedRoomId ? <>{
                    mainLayout()
                }</> : <>{
                    noSelectRoom()
                }</>
            }</>
    )

}

export default ChatWindow;
