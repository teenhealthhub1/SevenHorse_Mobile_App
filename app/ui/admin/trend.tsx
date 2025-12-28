
'use client';
import React, { useEffect } from 'react';
import {
    BanknotesIcon,
    ClockIcon,
    UserGroupIcon,
    InboxIcon,
  } from '@heroicons/react/24/outline';


  const iconMap = {
    collected: BanknotesIcon,
    customers: UserGroupIcon,
    pending: ClockIcon,
    invoices: InboxIcon,
  };
  
  export default function TrendHourlyDaily() {
    useEffect(() => {
            const interval = setInterval(() => {
                window.location.reload();
            }, 5000);
    
            return () => clearInterval(interval);
        }, []);
    
    return (
        <></>
    );
  }