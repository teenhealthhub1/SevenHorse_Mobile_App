'use client';
import { useState } from "react";
import { useActionState } from "react";
import { Button } from '@/app/ui/button';


import { createInvite, InviteState } from '@/app/lib/actions'

// Functiion take player_id from the playeractivity table
const Invite = ({ playerID }: { playerID: string }) => {

    const initialState: InviteState = { message: null, errors: {} };
    const createInviteb = createInvite.bind(null, playerID);
    const [state, formAction] = useActionState(createInviteb, initialState);

    return (
        <form action={formAction}>
            {/* <div className="rounded-md bg-gray-50 p-4 md:p-6"></div> */}
            <div className="style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px'}}">
                <div className="style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px'}}">
                    <Button type="submit">Invite Friends</Button>
                </div>
                
                <div className="style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px'}}"></div>
                <div className="style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px'}}">
                    <div className="relative">
                        <input
                            id="emailID"
                            name="emailID"
                            type="string"
                            step="0.01"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        >
                        </input>
                    </div>
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.emailID &&
                            state.errors?.emailID?.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))
                        }
                    </div>
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state?.message &&
                            <p className="mt-2 text-sm text-red-500">
                                {state.message}
                            </p>
                        }
                    </div>

                </div>

            </div>
        </form>

    );
};

export default Invite;