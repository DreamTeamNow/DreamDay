
import { useEffect, useState } from 'react';
import { Link } from '@remix-run/react';
import { Button } from '~/atoms/ui/button';
import { eventRef } from '~/db/event-ref';
import { deleteDoc, doc, onSnapshot, collection } from "firebase/firestore";
import { db } from '~/db/firebase';
import React from 'react';

export const CreatedEventNav = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [eventExists, setEventExists] = useState(false);


    interface Event {
        firstPerson: string;
        secondPerson: string;
        _id: string;
        eventID: string;
    }

    const getEventList = () => {
        const eventCollection = collection(db, 'event');
        onSnapshot(eventCollection, res => {
            const eventList = res.docs.map(doc => ({
                _id: doc.id,
                ...doc.data()
            } as Event));
            setEvents(eventList);
            setEventExists(true); 
        });
    };

    useEffect(() => {
        getEventList();
    }, []);

    const handleDelete = (eventID: string) => {
        const eventDoc = doc(eventRef, eventID);
        deleteDoc(eventDoc)
            .then(() => {
                setEvents(prevEvents => prevEvents.filter(event => event._id !== eventID));
                console.log('The event data has been successfully deleted');
            })
            .catch(error => {
                console.error('Error deleting event data', error);
            });
    };
    
    return (
        <div className="flex justify-center items-center h-64" id="created-event-nav">
            {eventExists ? ( 
                <div className="flex items-center">
                    {events.map((event) => (
                        <React.Fragment key={event._id}>
                            <Link to="/your-event">
                                <Button>{event.firstPerson} & {event.secondPerson}</Button>
                            </Link>
                            <button className="ml-2 p-1 text-gray-700 rounded-full" onClick={() => handleDelete(event._id)}> X </button>
                        </React.Fragment>
                    ))}
                </div>
            ) : (
                <p>No events</p>
            )}
        </div>
    );
};
