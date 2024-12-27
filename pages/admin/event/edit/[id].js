import { useState, useEffect } from 'react';
import { db } from '../../../../firebaseConfig'; // Adjust the path if needed
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';
import Layout from '../../../../component/Layout';
import "../../../../src/app/styles/main.scss";

const EditEvent = () => {
    const router = useRouter();
    const { id } = router.query; // Get the event ID from the URL
    const [eventName, setEventName] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [agendaPoints, setAgendaPoints] = useState(['']); // Default to an array with one empty string
    const [zoomLink, setZoomLink] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch event data based on ID
    useEffect(() => {
        if (id) {
            const fetchEvent = async () => {
                try {
                    const eventDoc = doc(db, 'monthlymeet', id);
                    const eventSnapshot = await getDoc(eventDoc);
                    if (eventSnapshot.exists()) {
                        const eventData = eventSnapshot.data();
                        setEventName(eventData.name);
                        setEventTime(new Date(eventData.time.seconds * 1000).toISOString().slice(0, 16)); // Convert to local time
                        // Ensure agendaPoints is always an array
                        setAgendaPoints(Array.isArray(eventData.agenda) ? eventData.agenda : ['']);
                        setZoomLink(eventData.zoomLink);
                    } else {
                        setError('Event not found.');
                    }
                } catch (error) {
                    setError('Error fetching event details.');
                } finally {
                    setLoading(false);
                }
            };

            fetchEvent();
        }
    }, [id]);

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        if (!eventName || !eventTime || !zoomLink || agendaPoints.some(point => point.trim() === '')) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const eventDocRef = doc(db, 'monthlymeet', id);
            await updateDoc(eventDocRef, {
                name: eventName,
                time: Timestamp.fromDate(new Date(eventTime)),
                agenda: agendaPoints,
                zoomLink: zoomLink,
            });

            setSuccess('Event updated successfully!');
            router.push('/admin/event/manageEvent'); // Redirect after success
        } catch (error) {
            setError('Error updating event. Please try again.');
        }
    };

    return (
        <Layout>
        <section className='c-form box'>
            <h2>Edit Event</h2>
            <button className="m-button-5" onClick={() => window.history.back()}>
    Back
  </button>
            {loading ? (
                <p>Loading event details...</p>
            ) : (
                <form onSubmit={handleUpdateEvent}>
                    <ul>
                        <li className='form-row'>
                            <h4>Event Name</h4>
                            <div className='multipleitem'>
                                <input
                                    type="text"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                    required
                                />
                            </div>
                        </li>
                        <li className='form-row'>
                            <h4>Date</h4>
                            <div className='multipleitem'>
                                <input
                                    type="datetime-local"
                                    value={eventTime}
                                    onChange={(e) => setEventTime(e.target.value)}
                                    required
                                />
                            </div>
                        </li>
                        <li className='form-row'>
                            <h4>Agenda</h4>
                            <div className='multipleitem'>
                                {agendaPoints.map((point, index) => (
                                    <textarea
                                        key={index}
                                        value={point}
                                        onChange={(e) => {
                                            const updatedPoints = [...agendaPoints];
                                            updatedPoints[index] = e.target.value;
                                            setAgendaPoints(updatedPoints);
                                        }}
                                        required
                                    />
                                ))}
                                {/* <button type="button" onClick={() => setAgendaPoints([...agendaPoints, ''])}>
                                    Add Agenda Point
                                </button> */}
                            </div>
                        </li>
                        <li className='form-row'>
                            <h4>Zoom Link</h4>
                            <div className='multipleitem'>
                                <input
                                    type="text"
                                    value={zoomLink}
                                    onChange={(e) => setZoomLink(e.target.value)}
                                    required
                                />
                            </div>
                        </li>
                  

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    <li className='form-row'>
                    <div>
                        <button className='submitbtn' type='submit'>Update</button>
                
                    </div>    
                </li>
                    </ul>
                </form>
            )}
        </section>
        </Layout>
    );
};

export default EditEvent;
