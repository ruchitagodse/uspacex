import { useState } from 'react';
import { db } from '../firebaseConfig'; 
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';


const CreateEvent = () => {
  const [eventName, setEventName] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [agendaPoints, setAgendaPoints] = useState(['']); // Array to handle multiple agenda points
  const [zoomLink, setZoomLink] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const router = useRouter();

  const handleAddAgendaPoint = () => {
    setAgendaPoints([...agendaPoints, '']); // Add a new empty agenda point
  };

  const handleRemoveAgendaPoint = (index) => {
    const updatedPoints = agendaPoints.filter((_, i) => i !== index);
    setAgendaPoints(updatedPoints); // Remove the selected agenda point
  };

  const handleAgendaChange = (index, value) => {
    const updatedPoints = [...agendaPoints];
    updatedPoints[index] = value; // Update the specific agenda point
    setAgendaPoints(updatedPoints);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    // Start loading
    setLoading(true);
    setError('');
    setSuccess('');

    if (!eventName || !eventTime || !zoomLink || agendaPoints.some(point => point === '')) {
      setError('Please fill in all fields');
      setLoading(false); // Stop loading
      return;
    }

    try {
      const monthlyMeetRef = collection(db, 'monthlymeet');
      const uniqueId = doc(monthlyMeetRef).id; // Generate a unique ID
      const eventDocRef = doc(monthlyMeetRef, uniqueId);

      await setDoc(eventDocRef, {
        name: eventName,
        time: Timestamp.fromDate(new Date(eventTime)),
        agenda: agendaPoints, // Save agenda points as an array
        zoomLink: zoomLink,
        uniqueId: uniqueId,
      });
      

      setSuccess('Event created successfully!');
      setEventName('');
      setEventTime('');
      setAgendaPoints(['']);
      setZoomLink('');
      setError('');

      // Redirect to the event details page
      setLoading(false); // Stop loading
      return router.push(`/events/${uniqueId}`);
    } catch (error) {
      setError('Error creating event. Please try again.');
      setLoading(false); // Stop loading
    }
  };

  return (
   <>
    <section className='c-form  box'>
      <h2>Create New Event</h2>
    
         
      <form onSubmit={handleCreateEvent}>
        <ul>
          <li className='form-row'>
            <h4>Event Name<sup>*</sup></h4>
            <div className='multipleitem'>
              
              <input
                type="text"
                placeholder="Event Name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </div>
          </li>
          <li className='form-row'>
            <h4>Date<sup>*</sup></h4>
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
            <h4>Agenda<sup>*</sup></h4>
            <div className='multipleitem'>
              {/* Dynamic agenda input fields */}
              {agendaPoints.map((point, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <textarea
                    value={point}
                    onChange={(e) => handleAgendaChange(index, e.target.value)}
                    placeholder={`Agenda Point ${index + 1}`}
                    required
                    rows={3} 
                    style={{ width: '300px', marginRight: '10px' }}
                  />
                  {agendaPoints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveAgendaPoint(index)}
                      style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </li>

          <li className='form-row'>
            <h4>Zoom link</h4>
            <div className='multipleitem'>
              <input
                type="text"
                placeholder="Zoom Link"
                value={zoomLink}
                onChange={(e) => setZoomLink(e.target.value)}
                required
              />
            </div>
          </li>

          <li className='form-row'>
            <div>
              <button className='submitbtn' type='submit' disabled={loading}>
                Submit
              </button>
            </div>    
          </li>
        </ul>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      
      {/* Loader while submitting */}
      {loading && (
        <div className='loader'> <span className="loader2"></span> </div>
      )}
    </section>
    </>
  );
};

export default CreateEvent;
