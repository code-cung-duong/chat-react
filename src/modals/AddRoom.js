import { Input, message } from 'antd';
import Form, { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Modal from 'antd/lib/modal/Modal';
import React, { useContext } from 'react';
import { AppContext } from '../context/AppProvider';
import { AuthContext } from '../context/AuthProvider';
import { db } from '../firebase/Config';
import { addDocuments } from '../firebase/Service';

export default function AddRoom() {

    const [form] = useForm();
    const { isAddRoomVisible, setIsAddRoomVisible } = useContext(AppContext);
    const { user: {
        uid
    } } = useContext(AuthContext);

    const users = []

    const handleOk = () => {
        if (form.getFieldValue()?.name && form.getFieldValue()?.description) {
            addDocuments('rooms', {
                ...form.getFieldsValue(),
                members: [uid]
            });
            form.resetFields();
            setIsAddRoomVisible(false);
            db.collection('rooms').where('members','array-contains', uid).orderBy('createAt').onSnapshot((snap)=>{
                const rooms = snap.docs.map((doc)=>(
                    {id: doc.id}
                ))
                const roomid = rooms[rooms.length-1]?.id;
                Array.from(users).forEach((user)=>{
                    db.collection('notifys').doc(user.uid).collection(user.uid).doc(roomid).set({
                        count: 0
                    })
                })
                return;
            })
            
            


            
        } else {
            message.info('Bạn cần nhập đầy đủ thông tin');
        }
    }

    const handleCancel = () => {
        setIsAddRoomVisible(false);
    }

    return (
        <div>
            <Modal title='Tạo nhóm'
                visible={isAddRoomVisible}
                onOk={handleOk}
                onCancel={handleCancel}>
                <Form layout="vertical"
                    form={form}>
                    <FormItem label="Tên nhóm" name="name">
                        <Input name="name" placeholder="Nhập tên nhóm" autoComplete="off"
                            rules={
                                [{
                                    required: true
                                }]
                            }></Input>
                    </FormItem>
                    <FormItem label="Mô tả" name="description">
                        <Input name="description" placeholder="Nhập mô tả" autoComplete="off"
                            rules={
                                [{
                                    required: true
                                }]
                            }></Input>
                    </FormItem>
                </Form>
            </Modal>
        </div>
    )
}
