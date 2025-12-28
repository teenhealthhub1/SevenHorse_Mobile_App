'use client';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/app/ui/button';
import { ProfileState, validateProfileForm } from '@/app/lib/actions';
import { UsersDetails } from '@/app/lib/definitions';
import { useActionState } from 'react'
import '@/styles/shiningButton.css';
import '@/styles/shiningButtonGray.css';
// @ts-ignore
import { redirect } from 'next/navigation';
// No Database - it slow down the page
import { productType } from '@/app/lib/definitions';

export default function profileFormPage(
    {
        player_id, 
        PlayerDetails
    }:
    {
        player_id:string,
        PlayerDetails: UsersDetails | undefined
    }) {

    interface CustomFormData {
        player_id?: string;        
        firstname?: string;
        middlename?: string;
        lastname?: string;
        phoneNum?: string;
        address1?: string;
        address2?: string;
        country?: string;
        city?: string;
        state?: string;
        pin?: string;
        age?: string;
        sex ?: string;
    }
    
    interface ProfileState {
        message: string;
        errors: {
            player_id?: string[];
            firstname?: string[];
            middlename?: string[];
            lastname?: string[];
            phoneNum?: string[];
            address1?: string[];
            address2?: string[];
            country?: string[];
            city?: string[];
            state?: string[];
            pin?: string[];
            age?: string[];
            sex?: string[];
        };
        formData: FormData;
    }
    
    const initialState: ProfileState = { message: '', errors: {}, formData: new FormData() };

    // we are not reading from the database since it hits performaence, hence create a static data
    // const statesByCountry1  =  fetchCountryState()
    //     .then((data) => {
    //         console.log('Country and State data:', data);
    //         return data;
    //     }
    //     )
    //     .catch((error) => {
    //         console.error('Error fetching country and state data:', error);
    //     });
    // Example data structure for countries and their states   


    const statesByCountry: Record<string, string[]> = {
        "United States": [
            "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
            "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
            "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
            "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "Puerto Rico", "Guam", "American Samoa",
            "U.S. Virgin Islands", "Northern Mariana Islands"
        ],
        "Australia": [
            "Australian Capital Territory", "New South Wales", "Northern Territory", "Queensland", "South Australia", "Tasmania", "Victoria", "Western Australia"
        ],
        "Germany": [
            "Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia",
            "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"
        ],
        "France": [
            "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Brittany", "Centre-Val de Loire", "Corsica", "Grand Est", "Hauts-de-France", "Île-de-France",
            "Normandy", "Nouvelle-Aquitaine", "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d'Azur", "French Guiana", "Guadeloupe", "Martinique", "Mayotte", "Réunion"
        ],
        "Japan": [
            "Aichi", "Akita", "Aomori", "Chiba", "Ehime", "Fukui", "Fukuoka", "Fukushima", "Gifu", "Gunma", "Hiroshima", "Hokkaido", "Hyogo", "Ibaraki", "Ishikawa", "Iwate",
            "Kagawa", "Kagoshima", "Kanagawa", "Kochi", "Kumamoto", "Kyoto", "Mie", "Miyagi", "Miyazaki", "Nagano", "Nagasaki", "Nara", "Niigata", "Oita", "Okayama",
            "Okinawa", "Osaka", "Saga", "Saitama", "Shiga", "Shimane", "Shizuoka", "Tochigi", "Tokushima", "Tokyo", "Tottori", "Toyama", "Wakayama", "Yamagata", "Yamaguchi", "Yamanashi"
        ],
        "China": [
            "Anhui", "Beijing", "Chongqing", "Fujian", "Gansu", "Guangdong", "Guangxi", "Guizhou", "Hainan", "Hebei", "Heilongjiang", "Henan", "Hong Kong", "Hubei", "Hunan",
            "Inner Mongolia", "Jiangsu", "Jiangxi", "Jilin", "Liaoning", "Macau", "Ningxia", "Qinghai", "Shaanxi", "Shandong", "Shanghai", "Shanxi", "Sichuan", "Tianjin", "Tibet",
            "Xinjiang", "Yunnan", "Zhejiang"
        ],
        "Brazil": [
            "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Espírito Santo", "Federal District", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
            "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima",
            "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
        ],
        "United Kingdom": [
            "England", "Northern Ireland", "Scotland", "Wales", "Gibraltar", "Bermuda", "Cayman Islands", "Falkland Islands", "Montserrat", "Turks and Caicos Islands", "British Virgin Islands"
        ],
        "South Africa": [
            "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"
        ],
        "Canada": [
            "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan",
            "Northwest Territories", "Nunavut", "Yukon"],
        "India": [
            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
            "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
            "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi",
            "Puducherry", "Ladakh", "Jammu and Kashmir"
        ],
        "Italy": [
            "Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna", "Friuli Venezia Giulia", "Lazio", "Liguria", "Lombardy", "Marche", "Molise", "Piedmont",
            "Apulia", "Sardinia", "Sicily", "Tuscany", "Trentino-Alto Adige", "Umbria", "Aosta Valley", "Veneto"
        ],
        "Mexico": [
            "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero",
            "Hidalgo", "Jalisco", "Mexico State", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
            "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
        ],
        "Spain": [
            "Andalusia", "Aragon", "Asturias", "Balearic Islands", "Basque Country", "Canary Islands", "Cantabria", "Castile and León", "Castile-La Mancha", "Catalonia",
            "Extremadura", "Galicia", "La Rioja", "Madrid", "Murcia", "Navarre", "Valencian Community"
        ],
        "Russia": [
            "Adygea", "Altai", "Bashkortostan", "Buryatia", "Chechnya", "Chuvashia", "Dagestan", "Ingushetia", "Kabardino-Balkaria", "Kalmykia", "Karachay-Cherkessia",
            "Karelia", "Khakassia", "Komi", "Mari El", "Mordovia", "North Ossetia-Alania", "Tatarstan", "Tuva", "Udmurtia", "Yakutia"
        ],
        "Turkey": [
            "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya", "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman",
            "Bayburt", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne",
            "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir",
            "Kahramanmaraş", "Karabük", "Kars", "Kastamonu", "Kayseri", "Kırıkkale", "Kırklareli", "Kırşehir", "Konya", "Kütahya", "Malatya", "Manisa",
            "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ",
            "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"
        ],
        "South Korea": [
            "Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Suwon", "Ulsan", "Changwon", "Seongnam", "Goyang", "Yongin", "Bucheon", "Jeju"
        ],
        "Singapore": [
            "Central Region", "East Region", "North Region", "North-East Region", "West Region"
        ],
        "New Zealand": [
            "Auckland", "Bay of Plenty", "Canterbury", "Gisborne", "Hawke's Bay", "Manawatu-Wanganui", "Marlborough", "Nelson", "Northland", "Otago", "Southland",
            "Taranaki", "Waikato", "Wellington", "West Coast"
        ],
        "Netherlands": [
            "Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", "Limburg", "North Brabant", "North Holland", "Overijssel", "South Holland", "Utrecht", "Zeeland"
        ],
        "Sweden": [
            "Blekinge", "Dalarna", "Gävleborg", "Gotland", "Halland", "Jämtland", "Jönköping", "Kalmar", "Kronoberg", "Norrbotten", "Örebro", "Östergötland",
            "Skåne", "Södermanland", "Uppsala", "Värmland", "Västerbotten", "Västernorrland", "Västmanland", "Västra Götaland"
        ],
        "Norway": [
            "Akershus", "Aust-Agder", "Buskerud", "Finnmark", "Hedmark", "Hedmark", "Møre og Romsdal", "Nordland", "Oppland", "Oslo", "Rogaland", "Sogn og Fjordane",
            "Telemark", "Troms", "Vest-Agder", "Vestfold", "Østfold"
        ],
        // Add more countries and territories as needed
    };

    const validateProfile = (state: ProfileState | undefined, payload: FormData) => {
        const customFormData: CustomFormData = {
            player_id: (payload.get('player_id') as string) || '',           
            firstname: (payload.get('firstname') as string) || '',
            middlename: (payload.get('middlename') as string) || '',
            lastname: (payload.get('lastname') as string) || '',
            phoneNum: (payload.get('phoneNum') as string) || '',
            address1: (payload.get('address1') as string) || '',
            address2: (payload.get('address2') as string) || '',
            country: (payload.get('country') as string) || '',
            city: (payload.get('city') as string) || '',
            state: (payload.get('state') as string) || '',
            pin: (payload.get('pin') as string) || '',
            age: (payload.get('age') as string) || '',
            sex: (payload.get('sex') as string) || '',
        };
        console.log('Custom Form Data:', customFormData);
        setInputValue(customFormData);

        const currentState = state || { message: null, errors: {} };
        return validateProfileForm(currentState, payload);
    };

    const [state, formAction] = useActionState(validateProfile, initialState);

    const [inputValue, setInputValue] = useState<CustomFormData>({ 
        player_id:player_id,       
        firstname: PlayerDetails?.first_name || '', 
        middlename: PlayerDetails?.middle_name || '', 
        lastname: PlayerDetails?.last_name || '', 
        phoneNum: PlayerDetails?.phone?.toString() || '', 
        address1: PlayerDetails?.address_1?.toString() || '', 
        address2: PlayerDetails?.address_2?.toString() || '', 
        country: PlayerDetails?.country || '', 
        city: PlayerDetails?.city || '', 
        state: PlayerDetails?.state || '', 
        pin: PlayerDetails?.pin?.toString() || '',
        age: PlayerDetails?.age?.toString() || '',
        sex: PlayerDetails?.sex || ''
    });

    return (
        <form action={formAction} >            
            <div className="overflow-x-auto grid gap-4" 
                style={{ 
                    maxHeight: 'calc(100vh - 200px)', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' 
                }}>
                    
                
                {/* Player First Name */}
                <div className="mb-4">
                    <label htmlFor="firstname" className="mb-2 text-sm font-medium text-black">
                        First Name
                    </label>
                    {/* <div className="relative mt-2 rounded-md"> */}
                    <div className="relative">
                        <input
                            id="firstname"
                            name="firstname"
                            type="string"
                            // value={PlayerDetails?.first_name || ''}
                            defaultValue={inputValue.firstname?.toString() || ''}      
                            className="peer w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="customer-error"
                        >                            
                        </input>
                    </div>
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.firstName &&
                            state.errors.firstName.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))
                        }
                    </div>
                    {/* </div> */}
                </div>
                {/* Player Middle Name */}
                <div className="mb-4">
                    <label htmlFor="middlename" className="mb-2 text-sm font-medium text-black">
                        Middle Name
                    </label>
                    {/* <div className="relative mt-2 rounded-md"> */}
                    <div className="relative">
                        <input
                            id="middlename"
                            name="middlename"
                            type="string"  
                            //value={PlayerDetails?.middle_name || ''}     
                            defaultValue={inputValue.middlename?.toString() || ''}                        
                            className="peer w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="customer-error"
                        >                            
                        </input>
                    </div>
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.middleName &&
                            state.errors.middleName.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))
                        }
                    </div>
                    {/* </div> */}
                </div>
                {/* Player  Last Name */}
                <div className="mb-4">
                    <label htmlFor="lastname" className="mb-2 text-sm font-medium text-black">
                        Last Name
                    </label>
                    {/* <div className="relative mt-2 rounded-md"> */}
                    <div className="relative">
                        <input
                            id="lastname"
                            name="lastname"
                            type="string"   
                            //value={PlayerDetails?.last_name || ''} 
                            defaultValue={inputValue.lastname?.toString() || ''}                                    
                            className="peer w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="customer-error"
                        >                           
                        </input>
                    </div>
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.lastName &&
                            state.errors.lastName.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))
                        }
                    </div>
                    {/* </div> */}
                </div>
                {/* Age */}
                <div className="mb-4">
                    <label htmlFor="age" className="mb-2 block text-sm font-medium">
                        Age
                    </label>
                    {/* <div className="relative mt-2 rounded-md"> */}
                    <div className="relative">
                        <input
                            id="age"
                            name="age"
                            type="number"
                            // value={PlayerDetails?.age?.toString() || ''}
                            defaultValue={inputValue.age?.toString() || ''}                          
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="customer-error"
                        >                           
                        </input>
                    </div>
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.age &&
                            state.errors.age.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))
                        }
                    </div>
                    {/* </div> */}
                </div>
                {/* Sex */}
                <div className="mb-4">
                    <label htmlFor="sex" className="mb-2 block text-sm font-medium">
                        Sex
                    </label>
                    {/* <div className="relative mt-2 rounded-md"> */}
                    <div className="relative">
                        <input
                            id="sex"
                            name="sex"
                            type="string"
                            //value={PlayerDetails?.sex?.toString() || ''}
                            defaultValue={inputValue.sex?.toString() || ''}                          
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="customer-error"
                        >                           
                        </input>
                    </div>
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.sex &&
                            state.errors.sex.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))
                        }
                    </div>
                    {/* </div> */}
                </div>
                {/* Player  Phone Number */}
                <div className="mb-4">
                    <label htmlFor="phoneNum" className="mb-2 text-sm font-medium text-black">
                        Phone Number
                    </label>
                    {/* <div className="relative mt-2 rounded-md"> */}
                    <div className="relative">
                        <input
                            id="phoneNum"
                            name="phoneNum"
                            type="number"
                            // value={PlayerDetails?.phone?.toString() || ''}
                            defaultValue={Number(inputValue.phoneNum) || 0}
                            className="peer w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="customer-error"
                        >                            
                        </input>
                    </div>
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.phoneNum &&
                            state.errors.phoneNum.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))
                        }
                    </div>
                    {/* </div> */}
                </div>
                {/* Player Address 1 */}
                <div className="mb-4">
                    <label htmlFor="address1" className="mb-2 text-sm font-medium text-black">
                        Address 1
                    </label>
                    {/* <div className="relative mt-2 rounded-md"> */}
                    <div className="relative">
                        <input
                            id="address1"
                            name="address1"
                            type="string"
                            // value={PlayerDetails?.address_1?.toString() || ''}
                            defaultValue={inputValue.address1?.toString() || ''}
                            className="peer w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="customer-error"
                        >                           
                        </input>
                    </div>
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.address1 &&
                            state.errors.address1.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))
                        }
                    </div>
                    {/* </div> */}
                </div>
                {/* Address 2 */}
                <div className="mb-4">
                    <label htmlFor="address2" className="mb-2 block text-sm font-medium">
                        Address 2
                    </label>
                    {/* <div className="relative mt-2 rounded-md"> */}
                    <div className="relative">
                        <input
                            id="address2"
                            name="address2"
                            type="string"
                            // value={PlayerDetails?.address_2?.toString() || ''}
                            defaultValue={inputValue.address2?.toString() || ''}                          
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="customer-error"
                        >                           
                        </input>
                    </div>
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.address2 &&
                            state.errors.address2.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))
                        }
                    </div>
                    {/* </div> */}
                </div>
                {/* Country */}
                <div className="mb-4">
                    <label htmlFor="country" className="mb-2 block text-sm font-medium">
                        Country
                    </label>
                    {/* <div className="relative mt-2 rounded-md"> */}
                    <div className="relative">
                        <select
                            id="country"
                            name="country"
                            value={inputValue.country || ''} // Use value to bind with state
                            onChange={(e) => {
                                const selectedCountry = e.target.value;
                                setInputValue({ ...inputValue, country: selectedCountry, state: '' });
                            }}
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="customer-error"
                        >

                            {inputValue.country && (
                                <option value={inputValue.country}>
                                    {inputValue.country}
                                </option>
                            )}
                            <option value=''>Select a country</option>
                            {Object.keys(statesByCountry).map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}

                        </select>
                    </div>
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.country &&
                            state.errors.country.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))
                        }
                    </div>
                    {/* </div> */}
                </div>
                {/* State */}
                <div className="mb-4">
                    <label htmlFor="state" className="mb-2 block text-sm font-medium">
                        State
                    </label>
                    {/* <div className="relative mt-2 rounded-md"> */}
                    <div className="relative">
                        <select
                            onChange={(e) => {
                                const selectedState = e.target.value;
                                setInputValue({ ...inputValue, state: selectedState });
                                //localStorage.setItem('selectedState', selectedState);
                            }}
                            id="state"
                            name="state"
                            defaultValue={inputValue.state || ''}
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="customer-error"
                            disabled={!inputValue.country || inputValue.country === "Select a country"} // Disable if no country is selected or "Select a country" is chosen
                        >
                            {/* <option value="" disabled>
                                Select a state
                            </option> */}
                            {/* <option value={inputValue.state}>{inputValue.state}</option> */}
                            {inputValue.state && (
                                <option value={inputValue.state}>
                                    {inputValue.state}
                                </option>
                            )}
                            {/* <option value=''>Select a state</option> */}


                            {(() => {
                                // Add more countries and states as needed                 
                                const states = statesByCountry[inputValue.country || ''] || [];
                                return (
                                    states.map((state) => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    )
                                    )
                                );
                            })()}

                        </select>
                    </div>
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.state &&
                            state.errors.state.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))
                        }
                    </div>
                    {/* </div> */}
                </div>
                {/* City */}
                <div className="mb-4">
                    <label htmlFor="city" className="mb-2 block text-sm font-medium">
                        City
                    </label>
                    {/* <div className="relative mt-2 rounded-md"> */}
                    <div className="relative">
                        <input
                            id="city"
                            name="city"
                            type="string"
                            // step="0.01"
                            defaultValue={inputValue.city?.toString() || ''}
                            // placeholder="Enter pointsUSD amount"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="customer-error"
                        />
                    </div>
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.state &&
                            state.errors.state.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))
                        }
                    </div>
                    {/* </div> */}
                </div>
                {/* Pin Code */}
                <div className="mb-4">
                    <label htmlFor="pin" className="mb-2 block text-sm font-medium">
                        Pin Code
                    </label>
                    {/* <div className="relative mt-2 rounded-md"> */}
                    <div className="relative">
                        <input
                            id="pin"
                            name="pin"
                            type="number"
                            // step="0.01"
                            defaultValue={Number(inputValue.pin) || 0}
                            // placeholder="Enter pointsUSD amount"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="customer-error"
                        />
                    </div>
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.pin &&
                            state.errors.pin.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))
                        }
                    </div>
                    {/* </div> */}
                </div>                
                {/* player ID */}
                {<div className="mb-4"> 
                    <input                       
                        type="hidden"
                        id="player_id"
                        value={player_id}
                        readOnly
                        name="player_id"
                    />                
                                      
                </div>}
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/profile"
                    // className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    className='shining-button'
                >
                    Cancel
                </Link>
                <Button 
                    className='shining-button' 
                    type="submit" 
                    
                >
                    Update Profile
                </Button>
            </div>
        </form>
    );
}


