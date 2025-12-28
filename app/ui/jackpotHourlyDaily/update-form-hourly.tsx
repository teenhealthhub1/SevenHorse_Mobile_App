'use client';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updatePlayerActivity_Hourly, UpdateState } from '@/app/lib/actions';
import { useActionState } from 'react'

export default function UpdateForm_hourly({ player_id, total_points, balance, points, selectNumber }:
    { player_id: string, total_points: number, balance: number, points: number, selectNumber: number}) {

    const initialState: UpdateState = { message: null, errors: {} };
    const updatePlayerActivityWithCurrentPoints = updatePlayerActivity_Hourly.bind(null, points)
    const [state, formAction] = useActionState(updatePlayerActivityWithCurrentPoints, initialState);

    return (
        <form action={formAction}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6"
            style={{ background: 'inear-gradient(to right,rgb(180, 227, 255)), rgb(180, 227, 255))' , padding: '20px'}}>    
                {/* player ID */}
                { <div className="mb-4">
                    {<label htmlFor="Player" className="mb-2 block text-sm font-medium">
                        Player
                    </label> }
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="playerId"
                                name="playerId"
                                type="string"
                                step="0.01"
                                defaultValue={player_id}                                
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 bg-gray-400 cursor-not-allowed"
                                aria-describedby="customer-error"
                                readOnly
                            >                                
                            </input>
                        </div>
                        <div id="customer-error" aria-live="polite" aria-atomic="true">                            
                        </div>
                    </div>
                </div>}
                {/* Number */}
                <div className="mb-4">
                    <label htmlFor="number" className="mb-2 block text-sm font-medium">
                        Number
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="number"
                                name="number"
                                type="number"
                                step="0.01"
                                defaultValue={selectNumber}                                
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 bg-gray-400 cursor-not-allowed"
                                aria-describedby="customer-error"
                                readOnly
                            >
                                {/* {selectNumber} */}
                            </input>                            
                        </div>                        
                    </div>
                </div>
                {/* Total Points */}
                <div className="mb-4">
                    <label htmlFor="totalPoints" className="mb-2 block text-sm font-medium">
                        Total points
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="totalPoints"
                                name="totalPoints"
                                type="number"
                                step="0.01"
                                defaultValue={total_points}                                
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 bg-gray-400 cursor-not-allowed"
                                aria-describedby="customer-error"
                                readOnly
                            >
                                {/* {total_points} */}
                            </input>                            
                        </div>                        
                    </div>
                </div>
                {/* Available Balance Points */}
                <div className="mb-4">
                    <label htmlFor="balance" className="mb-2 block text-sm font-medium">
                        Balance points
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="balance"
                                name="balance"
                                type="number"                                
                                defaultValue={balance}
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-50 bg-gray-400 cursor-not-allowed"
                                aria-describedby="customer-error"
                                readOnly
                            >
                                {/* {points} */}
                            </input>                            
                        </div>                        
                    </div>
                </div>
                {/* Update Points */}
                <div className="mb-4">
                    <label htmlFor="updatePoints" className="mb-2 block text-sm font-medium">
                        Update points
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="updatePoints"
                                name="updatePoints"
                                type="number"                              
                                defaultValue={points}                                
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                aria-describedby="customer-error"
                            />                            
                        </div>
                        <div id="customer-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.updatePoints &&
                                state.errors?.updatePoints?.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/jackpotHourly"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Update Points</Button>
            </div>
        </form>
    );
}
