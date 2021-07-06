import {useEffect, useState} from 'react';
import {db} from '../firebase/Config';

const UseFirestore = (collection, condition) => {
    const [documents, setDocuments] = useState([]);
    useEffect(() => {
        let dataRef = db.collection(collection).orderBy('createAt');
        if (condition) {
            if (!condition.compareValue || !condition.compareValue.length) {
                setDocuments([]);
                return;
            }
            dataRef = dataRef.where(condition.fieldName, condition.operator, condition.compareValue);
        }
        const unsubcribe = dataRef.onSnapshot((snap) => {
            const documents = snap.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }));
            setDocuments(documents);
        })

        return unsubcribe;
    }, [collection, condition])
    return documents;
}
export default UseFirestore;
