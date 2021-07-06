import {Form, message, Select, Spin} from 'antd'
import Avatar from 'antd/lib/avatar/avatar'
import Modal from 'antd/lib/modal/Modal'
import debounce from 'lodash.debounce'
import React, {useContext, useState} from 'react'
import {AppContext} from '../context/AppProvider'
import {db} from '../firebase/Config'

function DebounceSelect({
    fetchOptions,
    debounceTimeout = 300,
    curMembers,
    ...props
}) { // Search: abcddassdfasdf

    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value) => {
            setOptions([]);
            setFetching(true);

            fetchOptions(value, curMembers).then((newOptions) => {
                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions, curMembers]);

    React.useEffect(() => {
        return() => { // clear when unmount
            setOptions([]);
        };
    }, []);
    return (<Select labelInValue
        filterOption={false}
        onSearch={debounceFetcher}
        notFoundContent={
            fetching ? <Spin size='small'/> : <p style={{marginTop: '10px', color: '#345'}}>Bạn bè đã ở trong nhóm sẽ không xuất hiện ở đây !</p>
        }
        {...props}> {
        options.map((opt) => (<Select.Option key={
                opt.value
            }
            value={
                opt.value
            }
            title={
                opt.label
        }>
            <Avatar size='small'
                src={
                    opt.photoURL
            }> {
                opt.photoURL ? '' : opt.label?.charAt(0)?.toUpperCase()
            } </Avatar>
            {
            ` ${
                opt.label
            }`
        } </Select.Option>))
    } </Select>);
}

async function fetchUserList(search, curMembers) {
    return db.collection('users').where('keywords', 'array-contains', search?.toLowerCase()).orderBy('displayName').limit(20).get().then((snapshot) => {

        return snapshot.docs.map((doc) => ({label: doc.data().displayName, value: doc.data().uid, photoURL: doc.data().photoURL})).filter((opt) => ! curMembers.includes(opt.value));
    });
}

export default function InviteMemberModal() {
    const {isInviteMemberVisible, setIsInviteMemberVisible, selectedRoomId, selectedRoom} = useContext(AppContext);
    const [value, setValue] = useState([]);

    const [form] = Form.useForm();

    const handleOk = () => { // reset form value
        form.resetFields();
        setValue([]);
        // update members in current room
        const roomRef = db.collection('rooms').doc(selectedRoomId);

        roomRef.update({
            members: [
                ...selectedRoom.members,
                ...value.map((val) => val.value)
            ]
        });
        const len = value.length;
        if (len !== 0) {
            message.success('Đã thêm ' + len + ' thành viên');
        }
        setIsInviteMemberVisible(false);
    };

    const handleCancel = () => { // reset form value
        form.resetFields();
        setValue([]);

        setIsInviteMemberVisible(false);
    };

    return (<div>
        <Modal title='Mời thêm bạn bè'
            visible={isInviteMemberVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            destroyOnClose={true}>
            <Form form={form}
                layout='vertical'>
                <p>Nhập họ tên</p>
                <DebounceSelect mode='multiple' name='search-user' label='Tên các thành viên' 
                    value={value}
                    placeholder='Nhập * để hiển thị tất cả bạn bè'
                    fetchOptions={fetchUserList}
                    onChange={
                        (newValue) => setValue(newValue)
                    }
                    style={
                        {width: '100%'}
                    }
                    curMembers={
                        selectedRoom.members
                    }/>
            </Form>
        </Modal>
    </div>);
}
