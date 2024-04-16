import { addDoc } from "firebase/firestore";
import { FormEvent, useState } from "react";
import { Button } from "~/atoms/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/atoms/ui/card";
import { DatePicker } from "~/atoms/ui/date-picker";
import { Input } from "~/atoms/ui/input";
import { Label } from "~/atoms/ui/label";
import { eventIdref, eventRef } from "~/db/event-ref";
import { uniqueCodeGenerator } from "~/lib/utils";


interface NewEventFormData {
    firstPerson: string,
    secondPerson: string,
    eventDate: string,
    eventTime: string,
    ceremonyPlace: string,
    ceremonyStreetAddress: string,
    ceremonyCityAddress: string,
    receptionPlace: string,
    receptionStreetAddress: string,
    receptionCityAddress: string,
    firstPersonPhone: string,
    secondPersonPhone: string,
}

type FormErrorData<T> = Partial<Record<keyof T, string>>

export default function NewEventPage() {

    const [error, setError] = useState<FormErrorData<NewEventFormData>>();
    const [eventDate, setEventDate] = useState<Date | undefined>();

    async function handleOnSubmit(event: FormEvent) {
        if(!(event.target instanceof HTMLFormElement)) {
            return
        }
        event.preventDefault();
        const _formData = new FormData(event.target);
        console.log("_formData", _formData)

        if(eventDate) {
            _formData.append("eventDate", eventDate.toString());
        };

        const nextID = await uniqueCodeGenerator.next();
        _formData.append("eventID", String(nextID.value));

        const formData = Object.fromEntries(_formData.entries());

        const errors: FormErrorData<NewEventFormData> = {};

        if(!("firstPerson" in formData && typeof formData.firstPerson === "string" && formData.firstPerson.length >= 2)) {
            errors.firstPerson = "Use at least 2 characters"
        };
        if(!("secondPerson" in formData && typeof formData.secondPerson === "string" && formData.secondPerson.length >= 2)) {
            errors.secondPerson = "Use at least 2 characters"
        };
        if(!("eventDate" in formData && typeof formData.eventDate === "string" && formData.eventDate.length >= 4)) {
            errors.eventDate = "Choose event date"
        };
        if(!("eventTime" in formData)) {
            errors.eventTime = "Enter event time"
        };
        if(!("ceremonyPlace" in formData && typeof formData.ceremonyPlace === "string" && formData.ceremonyPlace.length >= 2)) {
            errors.ceremonyPlace = "Enter ceremony place, use at least 2 characters"
        };
        if(!("ceremonyStreetAddress" in formData && typeof formData.ceremonyStreetAddress === "string" && formData.ceremonyStreetAddress.length >= 2)) {
            errors.ceremonyStreetAddress = "Enter ceremony street address, use at least 2 characters"
        };
        if(!("ceremonyCityAddress" in formData && typeof formData.ceremonyCityAddress === "string" && formData.ceremonyCityAddress.length >= 2)) {
            errors.ceremonyCityAddress = "Enter ceremony city address, use at least 2 characters"
        };
        if(!("receptionPlace" in formData && typeof formData.receptionPlace === "string" && formData.receptionPlace.length >= 2)) {
            errors.receptionPlace = "Enter reception place, use at least 2 characters"
        };
        if(!("receptionStreetAddress" in formData && typeof formData.receptionStreetAddress === "string" && formData.receptionStreetAddress.length >= 2)) {
            errors.receptionStreetAddress = "Enter reception street address, use at least 2 characters"
        };
        if(!("receptionCityAddress" in formData && typeof formData.receptionCityAddress === "string" && formData.receptionCityAddress.length >= 2)) {
            errors.receptionCityAddress = "Enter reception city address, use at least 2 characters"
        };
        if(!("firstPersonPhone" in formData && typeof formData.firstPersonPhone === "string" && formData.firstPersonPhone.length >= 6)) {
            errors.firstPersonPhone = "Enter first person's number. Use at least 6 numbers"
        };
        if(!("secondPersonPhone" in formData && typeof formData.secondPersonPhone === "string" && formData.secondPersonPhone.length >= 6)) {
            errors.secondPersonPhone = "Enter second person's number. Use at least 6 numbers"
        };

        setError(errors);

        if(Object.keys(errors).length !== 0) {
            return;
        } else {
            await addDoc(eventIdref, {"ID": nextID.value});
            await addDoc(eventRef, formData);
            event.target.reset();
        }
    }

    return (
        <Card className="w-full max-w-screen-lg mx-auto my-8">
            <CardHeader>
                <CardTitle className="text-center">Your dream event</CardTitle>
            </CardHeader>
            <CardContent>
                <form id="EventForm" onSubmit={handleOnSubmit}>
                    <div className="w-full border-b-2 pb-4">

                        <div className="text-lg font-bold mb-2"><p className="border-t-2 py-4 mb-4">Names</p>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-start-2 flex flex-col space-y-1.5 mb-5">
                                    <Label htmlFor="firstPerson" >First person</Label> 
                                    <Input name="firstPerson"/>
                                    {!!error?.firstPerson && <em className="text-xs">{error.firstPerson}</em>}
                                </div>
                                <div className="flex flex-col space-y-1.5 mb-5">
                                    <Label htmlFor="secondPerson">Second person</Label> 
                                    <Input name="secondPerson"/>
                                    {!!error?.secondPerson && <em className="text-xs">{error.secondPerson}</em>} 
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-lg font-bold mb-2"><p className="border-t-2 py-4 mb-4">Event</p>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-start-2 flex flex-col space-y-1.5 mb-5">
                                    <Label>Date</Label> 
                                    <DatePicker value={eventDate} onSelectDate={(date) => setEventDate(date)} />
                                    {!!error?.eventDate && <em className="text-xs">{error.eventDate}</em>}                                   
                                </div>
                                <div className="flex flex-col space-y-1.5 mb-5">
                                    <Label htmlFor="eventTime">Time</Label> 
                                    <Input name="eventTime" type="time"/>
                                    {!!error?.eventTime && <em className="text-xs">{error.eventTime}</em>}
                                </div>
                            </div>
                        </div>

                        <div className="text-lg font-bold mb-2"><p className="border-t-2 py-4 mb-4">Ceremony</p>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-start-2 flex flex-col space-y-1.5 mb-5">
                                    <Label htmlFor="ceremonyPlace">Place</Label> 
                                    <Input name="ceremonyPlace" />
                                    {!!error?.ceremonyPlace && <em className="text-xs">{error.ceremonyPlace}</em>}
                                    
                                </div>
                                <div className="flex flex-col space-y-1.5 mb-5">
                                    <Label htmlFor="ceremonyStreetAddress">Street</Label> 
                                    <Input name="ceremonyStreetAddress" />
                                    {!!error?.ceremonyStreetAddress && <em className="text-xs">{error.ceremonyStreetAddress}</em>}
                                </div>
                                <div className="col-start-3 flex flex-col space-y-1.5 mb-5">
                                    <Label htmlFor="ceremonyCityAddress">City</Label> 
                                    <Input name="ceremonyCityAddress" />
                                    {!!error?.ceremonyCityAddress && <em className="text-xs">{error.ceremonyCityAddress}</em>}
                                </div>
                            </div>
                        </div>

                        <div className="text-lg font-bold mb-2"><p className="border-t-2 py-4 mb-4">Reception</p>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-start-2 flex flex-col space-y-1.5 mb-5">
                                    <Label htmlFor="receptionPlace">Place</Label>
                                    <Input name="receptionPlace" />
                                    {!!error?.receptionPlace && <em className="text-xs">{error.receptionPlace}</em>}
                                </div>
                                <div className="flex flex-col space-y-1.5 mb-5">
                                    <Label htmlFor="receptionStreetAddress">Street</Label> 
                                    <Input name="receptionStreetAddress" />
                                    {!!error?.receptionStreetAddress && <em className="text-xs">{error.receptionStreetAddress}</em>}
                                </div>
                                <div className="col-start-3 flex flex-col space-y-1.5 mb-5">
                                    <Label htmlFor="receptionCityAddress">City</Label> 
                                    <Input name="receptionCityAddress" />
                                    {!!error?.receptionCityAddress && <em className="text-xs">{error.receptionCityAddress}</em>}
                                </div>
                            </div>
                        </div>

                        <div className="text-lg font-bold mb-2"><p className="border-t-2 py-4 mb-4">Phone numbers</p>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-start-2 flex flex-col space-y-1.5 mb-5">
                                    <Label htmlFor="firstPersonPhone">First person</Label>
                                    <Input name="firstPersonPhone" type="tel" />
                                    {!!error?.firstPersonPhone && <em className="text-xs">{error.firstPersonPhone}</em>}
                                </div>
                                <div className="flex flex-col space-y-1.5 mb-5">
                                    <Label htmlFor="econdPersonPhone">Second person</Label>
                                    <Input name="secondPersonPhone" type="tel" />
                                    {!!error?.secondPersonPhone && <em className="text-xs">{error.secondPersonPhone}</em>}
                                </div>
                            </div>
                        </div>

                        <div className="text-lg font-bold mb-2"><p className="border-t-2 py-4 mb-4">Other</p>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-start-2 col-end-4 flex flex-col space-y-1.5 mb-5">
                                    <Label htmlFor="color">You can choose lead color of your event</Label> 
                                    <Input name="color" type="color" />
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            </CardContent>
            <CardFooter className="grid grid-cols-3 gap-4">
                <Button className="col-start-2" variant="outline">Cancel</Button>
                <Button type="submit" form="EventForm" >Add your event</Button>
            </CardFooter>
        </Card>
    )
}