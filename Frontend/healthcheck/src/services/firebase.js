import { firebase, FieldValue } from '../lib/firebase';

export async function addNewDisease(userId, possibleDiseases, userSelectedSymptoms) {
    const result = await firebase
        .firestore()
        .collection('diseases')
        .add({
            dateCreated: (new Date).toDateString(),
            userId: userId,
            possibleDiseases: possibleDiseases,
            symptoms: userSelectedSymptoms
        });
}

export async function getPreviousDisease(userId) {
    const result = await firebase
        .firestore()
        .collection('diseases')
        .where('userId', '==', userId)
        .get()

    const docs = result.docs.map((item) => ({
        ...item.data(),
        id: item.id
    }))

    return docs;
}