import { useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { useRouter } from 'next/router';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

const AttendancePage = () => {
    const router = useRouter();
    const { eventId, userId } = router.query; // Assume userId is passed during login or QR scan

    useEffect(() => {
        if (eventId && userId) {
            markAttendance(eventId, userId);
        }
    }, [eventId, userId]);

    const markAttendance = async (eventId, userId) => {
        try {
            const eventDocRef = doc(db, 'events', eventId);
            // Add user's attendance
            await updateDoc(eventDocRef, {
                attendees: arrayUnion(userId)
            });
            alert('Attendance marked successfully');
        } catch (error) {
            console.error('Error marking attendance:', error);
        }
    };

    return (
        <div>
            <h1>Marking attendance...</h1>
        </div>
    );
};

export default AttendancePage;
