// imiona państwa młodych - zaciągane z formularza rejestracji
// data wydarzenia
// godzina
// ceremonia - nazwa miejsca, adres
// wesele - nazwa miejsca, adres
// kolor przewodni
// kod wydarzenia
// numery telefonów pary młodej

import React, { useEffect, useState } from 'react';
import { Button } from '~/atoms/ui/button'
import { Input } from '~/atoms/ui/input';
import { Label } from '~/atoms/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '~/atoms/ui/card';
import { DatePicker } from '../atoms/ui/date-picker';
import errorsToRecord from '@hookform/resolvers/io-ts/dist/errorsToRecord.js';
import { Alert } from '~/atoms/ui/alert';
import { validateInputsPhoneNumbers, validateInputTimeFormat, validateInputsStringValues, uniqueCodeGenerator } from '~/lib/utils';

interface FormFields {
    [key: string]: {
        legend: string;
        [key: string]: string;
    }
}

const formFields: FormFields = {
    Names: {
            legend: 'Names',
            brideNameLabel: "Bride's",
            brideNameAttributes: 'brideName',
            groomNameLabel: "Groom's",
            groomNameAttributes: 'groomName',
        },
        Event: {
            legend: 'Event',
            eventDateLabel: 'Date',
            eventDateAttributes: 'eventDate',
            eventTimeLabel: 'Time',
            eventTimeAttributes: 'eventTime',
        },
        Ceremony: {
            legend: 'Ceremony',
            ceremonyPlaceLabel: 'Place',
            ceremonyPlaceAttributes: 'ceremonyPlace',
            ceremonyAddressLabel: 'Address',
            ceremonyAddressAttributes: 'ceremonyAddress',
        },
        Reception: {
            legend: 'Reception',
            receptionPlaceLabel: 'Place',
            receptionPlaceAttributes: 'receptionPlace',
            receptionAddressLabel: 'Address',
            receptionAddressAttributes: 'receptionAddress',
        },
        PhoneNumbers: { 
            legend: 'Phone numbers',
            brideNumberLabel: "Bride's",
            brideNumberAttributes: 'brideNumber',
            groomNumberLabel: "Groom's",
            groomNumberAttributes: 'groomNumber',
        },
        Other: {
            legend: 'Other',
            leadColorLabel: 'Lead color',
            leadColorAttributes: 'leadColor',
        }
    }

interface EventFormData {
    brideName: string;
    groomName: string;
    eventDate: Date | undefined;
    eventTime: string;
    ceremonyPlace: string;
    ceremonyAddress: string;
    receptionPlace: string;
    receptionAddress: string;
    brideNumber: string;
    groomNumber: string;
    leadColor: string;
}

interface InputsErrors {
    [key: string]: string | undefined;
}

export const EventForm = (): React.ReactElement => {

    const [formData, setFormData] = useState<EventFormData>({
        brideName: '',
        groomName: '',
        eventDate: undefined,
        eventTime: '',
        ceremonyPlace: '',
        ceremonyAddress: '',
        receptionPlace: '',
        receptionAddress: '',
        brideNumber: '',
        groomNumber: '',
        leadColor: '#FFFFFF',
    })

    const [inputsErrors, setInputsErrors] = useState<InputsErrors>({});

    useEffect(() => {
        if(formData.eventDate) {
            const today = new Date();
            const timeDifference = formData.eventDate.getTime() - today.getTime();
            const numberOfDaysToEvent = Math.floor(timeDifference / (1000 * 3600 * 24));
            console.log(`Do ślubu pozostało: ${numberOfDaysToEvent} dni`);
            setFormData(data => ({...data, daysToEvent: numberOfDaysToEvent}));
            setInputsErrors(errors => ({...errors, eventDate: undefined}));
        }
    }, [formData.eventDate]);

    useEffect(() => {
        setFormData(data => ({...data, uniqueEventCode: uniqueCodeGenerator.next().value}))
    }, []);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const {value} = e.target;
        setInputsErrors(errors => ({...errors, [fieldName]: undefined}));
        setFormData(data => ({...data, [fieldName]: value}));
        let newErrors: InputsErrors = {};

        if(fieldName === 'brideName' && (!validateInputsStringValues(value))) {
            newErrors = {...newErrors, brideName: 'Use at least 2 letters'}
        }
        if(fieldName === 'groomName' && (!validateInputsStringValues(value))) {
            newErrors = {...newErrors, groomName: 'Use at least 2 letters'}
        }
        // if(fieldName === 'eventTime' && (!validateInputTimeFormat(value))) {
        //     newErrors = {...newErrors, eventTime: 'Time format is 00:00'}
        // }
        if(fieldName === 'ceremonyPlace' && (!validateInputsStringValues(value))) {
            newErrors = {...newErrors, ceremonyPlace: 'Use at least 2 letters'}
        }
        // walidacja adresu - niepewna
        if(fieldName === 'ceremonyAddress' && (!validateInputsStringValues(value))) {
            newErrors = {...newErrors, ceremonyAddress: 'Use at least 2 letters'}
        }
        if(fieldName === 'receptionPlace' && (!validateInputsStringValues(value))) {
            newErrors = {...newErrors, receptionPlace: 'Use at least 2 letters'}
        }
        // walidacja adresu - niepewna
        if(fieldName === 'receptionAddress' && (!validateInputsStringValues(value))) {
            newErrors = {...newErrors, receptionAddress: 'Use at least 2 letters'}
        }
        if(fieldName === 'brideNumber' && (!validateInputsPhoneNumbers(value))) {
            newErrors = {...newErrors, brideNumber: 'Use at least 6 digits'}
        }
        if(fieldName === 'groomNumber' && (!validateInputsPhoneNumbers(value))) {
            newErrors = {...newErrors, groomNumber: 'Use at least 6 digits'}
        }
        // tutaj nie jestem pewna
        // if (!formData.leadColor) {
        //     newErrors = {...newErrors, leadColor: 'Select lead color of your event'};
        // }      
        setInputsErrors(errors => ({...errors, ...newErrors}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    
        const newErrors: InputsErrors = {};
    
        if (!formData.brideName.trim()) {
            newErrors.brideName = "Enter bride's name";
        } 
        if (!formData.groomName.trim()) {
            newErrors.groomName = "Enter groom's name";
        } 
        if (!formData.eventDate) {
            newErrors.eventDate = 'Select date';
        } 
        if (!formData.eventTime.trim()) {
            newErrors.eventTime = 'Enter event time';
        } 
        if (!formData.ceremonyPlace.trim()) {
            newErrors.ceremonyPlace = 'Enter ceremony place';
        } 
        if (!formData.ceremonyAddress.trim()) {
            newErrors.ceremonyAddress = 'Enter ceremony address';
        }
        if (!formData.receptionPlace.trim()) {
            newErrors.receptionPlace = 'Enter reception place';
        }
        if (!formData.receptionAddress.trim()) {
            newErrors.receptionAddress = 'Enter reception address';
        }
        if (!formData.brideNumber.trim()) {
            newErrors.brideNumber = "Enter bride's number";
        } 
        if (!formData.groomNumber.trim()) {
            newErrors.groomNumber = "Enter groom's number";
        }
        // czy dodawać walidację inputu z kolorem, jesli wartość początkowa to white?
        // if (!formData.leadColor.trim()) {
        //     newErrors.leadColor = 'Select lead color of your event';
        // }
        if (Object.keys(newErrors).length > 0) {
            setInputsErrors(newErrors);
            console.log('Errors:', inputsErrors);
            return;
        }

        console.log('Form submitted successfully', formData)

        setFormData({
            brideName: '',
            groomName: '',
            eventDate: undefined,
            eventTime: '',
            ceremonyPlace: '',
            ceremonyAddress: '',
            receptionPlace: '',
            receptionAddress: '',
            brideNumber: '',
            groomNumber: '',
            leadColor: '#FFFFFF',
        });

        setInputsErrors({});

    };


    return (
        <Card className='w-full max-w-screen-lg'>
            <CardHeader>
                <CardTitle className='text-center'>Your dream event</CardTitle>
            </CardHeader>
            <CardContent>
                <form id='EventForm' /*onSubmit={handleSubmit}*/>
                    <fieldset>
                        
                        <div className='w-full'>

                            <legend className='text-lg font-bold mb-2'>{formFields.Names.legend}
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='flex flex-col space-y-1.5 mb-5'>
                                        <Label htmlFor={formFields.Names.brideNameAttributes}>{formFields.Names.brideNameLabel}</Label>
                                        <Input 
                                            id={formFields.Names.brideNameAttributes}
                                            name={formFields.Names.brideNameAttributes} 
                                            value={formData.brideName} 
                                            onChange={(e) => handleOnChange(e, 'brideName')}
                                            required
                                        />
                                        {inputsErrors.brideName && <div className="text-red-500">{inputsErrors.brideName}</div>}
                                    </div>
                                    <div className='flex flex-col space-y-1.5'>
                                        <Label htmlFor={formFields.Names.groomNameAttributes}>{formFields.Names.groomNameLabel}</Label>
                                        <Input 
                                            id={formFields.Names.groomNameAttributes}
                                            name={formFields.Names.groomNameAttributes} 
                                            value={formData.groomName} 
                                            onChange={(e) => handleOnChange(e, 'groomName')}
                                            required
                                        />
                                        {inputsErrors.groomName && <div className="text-red-500">{inputsErrors.groomName}</div>}
                                    </div>
                                </div>
                            </legend>

                            <legend className='text-lg font-bold mb-2'>{formFields.Event.legend}
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='flex flex-col space-y-1.5 mb-5'>
                                        <Label /*htmlFor='event_date'*/>{formFields.Event.eventDateLabel}</Label>
                                        <DatePicker
                                            // id='event_date'
                                            value={formData.eventDate} 
                                            onSelectDate={(date) => setFormData(data => ({...data, eventDate: date}))}
                                        />
                                        {inputsErrors.eventDate && <div className="text-red-500">{inputsErrors.eventDate}</div>}
                                    </div>
                                    <div className='flex flex-col space-y-1.5 mb-5'>
                                        <Label htmlFor={formFields.Event.eventTimeAttributes}>{formFields.Event.eventTimeLabel}</Label>
                                        <Input 
                                            id={formFields.Event.eventTimeAttributes}
                                            type='time'
                                            name={formFields.Event.eventTimeAttributes} 
                                            value={formData.eventTime} 
                                            onChange={(e) => handleOnChange(e, 'eventTime')}
                                            required
                                        />
                                        {inputsErrors.eventTime && <div className="text-red-500">{inputsErrors.eventTime}</div>}
                                    </div>
                                </div>
                            </legend>

                            <legend className='text-lg font-bold mb-2'>{formFields.Ceremony.legend}
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='flex flex-col space-y-1.5 mb-5'>
                                        <Label htmlFor={formFields.Ceremony.ceremonyPlaceAttributes}>{formFields.Ceremony.ceremonyPlaceLabel}</Label>
                                        <Input 
                                            id={formFields.Ceremony.ceremonyPlaceAttributes}
                                            name={formFields.Ceremony.ceremonyPlaceAttributes} 
                                            value={formData.ceremonyPlace} 
                                            onChange={(e) => handleOnChange(e, 'ceremonyPlace')}
                                            required
                                        />
                                        {inputsErrors.ceremonyPlace && <div className="text-red-500">{inputsErrors.ceremonyPlace}</div>}
                                    </div>
                                    <div className='flex flex-col space-y-1.5'>
                                        <Label htmlFor={formFields.Ceremony.ceremonyAddressAttributes}>{formFields.Ceremony.ceremonyAddressLabel}</Label>
                                        <Input 
                                            id={formFields.Ceremony.ceremonyAddressAttributes}
                                            name={formFields.Ceremony.ceremonyAddressAttributes} 
                                            value={formData.ceremonyAddress} 
                                            onChange={(e) => handleOnChange(e, 'ceremonyAddress')}
                                            required
                                        />
                                        {inputsErrors.ceremonyAddress && <div className="text-red-500">{inputsErrors.ceremonyAddress}</div>}
                                    </div>
                                </div>
                            </legend>

                            <legend className='text-lg font-bold mb-2'>{formFields.Reception.legend}
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='flex flex-col space-y-1.5 mb-5'>
                                        <Label htmlFor={formFields.Reception.receptionPlaceAttributes}>{formFields.Reception.receptionPlaceLabel}</Label>
                                        <Input 
                                            id={formFields.Reception.receptionPlaceAttributes}
                                            name={formFields.Reception.receptionPlaceAttributes} 
                                            value={formData.receptionPlace} 
                                            onChange={(e) => handleOnChange(e, 'receptionPlace')}
                                            required
                                        />
                                        {inputsErrors.receptionPlace && <div className="text-red-500">{inputsErrors.receptionPlace}</div>}
                                    </div>
                                    <div className='flex flex-col space-y-1.5 mb-5'>    
                                        <Label htmlFor={formFields.Reception.receptionAddressAttributes}>{formFields.Reception.receptionAddressLabel}</Label>
                                        <Input 
                                            id={formFields.Reception.receptionAddressAttributes}
                                            name={formFields.Reception.receptionAddressAttributes} 
                                            value={formData.receptionAddress} 
                                            onChange={(e) => handleOnChange(e, 'receptionAddress')}
                                            required
                                        /> 
                                        {inputsErrors.receptionAddress && <div className="text-red-500">{inputsErrors.receptionAddress}</div>}
                                    </div>
                                </div>
                            </legend>

                            <legend className='text-lg font-bold mb-2'>{formFields.PhoneNumbers.legend}
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='flex flex-col space-y-1.5 mb-5'>
                                        <Label htmlFor={formFields.PhoneNumbers.brideNumberAttributes}>{formFields.PhoneNumbers.brideNumberLabel}</Label>
                                        <Input
                                            id={formFields.PhoneNumbers.brideNumberAttributes}
                                            name={formFields.PhoneNumbers.brideNumberAttributes} 
                                            type='tel' 
                                            value={formData.brideNumber} 
                                            onChange={(e) => handleOnChange(e, 'brideNumber')}
                                            required
                                        />
                                        {inputsErrors.brideNumber && <div className="text-red-500">{inputsErrors.brideNumber}</div>}
                                    </div>
                                    <div className='flex flex-col space-y-1.5 mb-5'>
                                        <Label htmlFor={formFields.PhoneNumbers.groomNumberAttributes}>{formFields.PhoneNumbers.groomNumberLabel}</Label>
                                        <Input
                                            id={formFields.PhoneNumbers.groomNumberAttributes}
                                            name={formFields.PhoneNumbers.groomNumberAttributes}
                                            type='tel' 
                                            value={formData.groomNumber} 
                                            onChange={(e) => handleOnChange(e, 'groomNumber')}
                                            required
                                        />
                                        {inputsErrors.groomNumber && <div className="text-red-500">{inputsErrors.groomNumber}</div>}
                                    </div>
                                </div>
                            </legend>

                            <legend className='text-lg font-bold mb-2'>{formFields.Other.legend}
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='flex flex-col space-y-1.5 mb-5'>
                                        <Label htmlFor={formFields.Other.leadColorAttributes}>{formFields.Other.leadColorLabel}</Label>
                                        <Input
                                            id={formFields.Other.leadColorAttributes}
                                            name={formFields.Other.leadColorAttributes} 
                                            type='color' 
                                            value={formData.leadColor} 
                                            onChange={(e) => handleOnChange(e, 'leadColor')}
                                            required
                                        />
                                        {inputsErrors.leadColor && <div className="text-red-500">{inputsErrors.leadColor}</div>}
                                    </div>
                                </div>
                            </legend>

                        </div>
                    </fieldset>
                </form>

            </CardContent>
            <CardFooter className='grid grid-cols-2 gap-4'>
                <Button className='w-full'>Cancel</Button>
                <Button type='submit' form='EventForm' className='w-full' onClick={handleSubmit}>Add your event</Button>
            </CardFooter>
        </Card>
    );
}





// export const EventForm = (): React.ReactElement => {

//     const [brideName, setBrideName] = useState<string>('');
//     const [groomName, serGroomName] = useState<string>('');
//     const [eventDate, setEventDate] = useState<string>('');
//     const [eventTime, setEventTime] = useState<string>('');
//     const [ceremonyPlace, setCeremonyPlace] = useState<string>('');
//     const [ceremonyAddress, setCeremonyAddress] = useState<string>('');
//     const [receptionPlace, setReceptionPlace] = useState<string>('');
//     const [receptionAddress, setReceptionAddress] = useState<string>('');
//     const [brideNumber, setBrideNumber] = useState<string>('');
//     const [groomNumber, setGroomNumber] = useState<string>('');
//     const [leadColor, setLeadColor] = useState<string>('');


// interface Field {
//     label: string;
//     name: string;
//     type?: string;
//     onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
// }

// interface FormDataSection {
//     title: string;
//     fields: Field[];
// }


// const formData: FormDataSection[] = [
//         {
//         title: 'Names',
//         fields: [
//             { label: "Bride's", name: 'bride_name', onChange: (e) => setBrideName(e.target.value) },
//             { label: "Groom's", name: 'groom_name' }
//         ]
//         },
//         {
//         title: 'Event',
//         fields: [
//             { label: 'Date', name: 'event_date', type: 'date' },
//             { label: 'Time', name: 'event_time', type: 'number' }
//         ]
//         },
//         {
//         title: 'Ceremony',
//         fields: [
//             { label: 'Place', name: 'ceremony_place' },
//             { label: 'Address', name: 'ceremony_address', type: 'address' }
//         ]
//         },
//         {
//         title: 'Reception',
//         fields: [
//             { label: 'Place', name: 'reception_place' },
//             { label: 'Address', name: 'reception_address', type: 'address' }
//         ]
//         },
//         {
//         title: 'Phone numbers',
//         fields: [
//             { label: "Bride's", name: 'bride_number', type: 'tel' },
//             { label: "Groom's", name: 'groom_number', type: 'tel' }
//         ]
//         },
//         {
//         title: 'Other',
//         fields: [
//             { label: 'Lead color', name: 'lead_color', type: 'color' },
//             // { label: 'Unique event code', name: 'event_code' }
//         ]
//         }
//     ];


//     function handleOnClick() {
//         const eventCode = getRandomCode(1000, 9000);
//         console.log(eventCode)
//     }


//     return (
//         <Card className='w-full max-w-screen-lg'>
//             <CardHeader>
//                 <CardTitle className='text-center'>Your dream event</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <form>
//                     {formData.map((section) => (
//                         <fieldset key={section.title}>
//                         <legend className='text-lg font-bold mb-2 text-center'>{section.title}</legend>
//                         <div className='grid grid-cols-2 gap-4'>
//                             {section.fields.map((field) => (
//                                 <div key={field.name} className='flex flex-col space-y-1.5 mb-5'>
//                                 <Label>{field.label}</Label>
//                                 {field.type === 'date' ? (<DatePicker />) 
//                                 : (<Input name={field.name} type={field.type || 'text'} />)} 
//                                 </div>
//                             ))}
//                         </div>
//                         </fieldset>
//                     ))}
//                 </form>
//             </CardContent>
//             <CardFooter className='grid grid-cols-2 gap-4 p-5'>
//                 <Button type='button' className='w-full'>Cancel</Button>
//                 <Button type='submit' className='w-full' onClick={handleOnClick}>Add your event</Button>
//             </CardFooter>
//         </Card>
//     );
// };

