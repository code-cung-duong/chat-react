import React, {useContext, useMemo, useState} from 'react';
import UseFirestore from '../hooks/UseFirestore';
import {AuthContext} from './AuthProvider';
export const AppContext = React.createContext();


function AppProvider({children}) {


    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
    const [isShowMembersVisible, setIsShowMembersVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);

    const {user: {
            uid
        }} = useContext(AuthContext);

    const roomCondition = useMemo(() => {
        return {fieldName: 'members', operator: 'array-contains', compareValue: uid}
    }, [uid])

    const rooms = UseFirestore('rooms', roomCondition)

    const selectedRoom = useMemo(() => Array.from(rooms).find((room) => room.id === selectedRoomId) || {}, [rooms, selectedRoomId]);

    const memberCondition = useMemo(() => {
        return {fieldName: 'uid', operator: 'in', compareValue: selectedRoom.members};
    }, [selectedRoom.members])

    const members = UseFirestore('users', memberCondition)

    const clearState = () => {
        setSelectedRoomId('');
        setIsAddRoomVisible(false);
        setIsInviteMemberVisible(false);
    };

    return (
        <AppContext.Provider value={
            {
                rooms,
                isAddRoomVisible,
                setIsAddRoomVisible,
                selectedRoomId,
                setSelectedRoomId,
                selectedRoom,
                members,
                isInviteMemberVisible,
                setIsInviteMemberVisible,
                clearState,
                isShowMembersVisible,
                setIsShowMembersVisible,
            }
        }>
            {children} </AppContext.Provider>
    )
}
export default AppProvider;
