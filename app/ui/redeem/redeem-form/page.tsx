// 'use client';
// import React, { useState } from 'react';

// const RedeemFormPage:React.FC = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         phone: '',
//         code: '',
//         amount: '',
//     });

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         console.log('Form Data:', formData);
//     };

//     return (
//         <div className="redeem-form-container">
//             <h1>Redeem Form</h1>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label htmlFor="name">Name:</label>
//                     <input
//                         type="text"
//                         id="name"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="email">Email:</label>
//                     <input
//                         type="email"
//                         id="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="phone">Phone:</label>
//                     <input
//                         type="tel"
//                         id="phone"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="code">Redeem Code:</label>
//                     <input
//                         type="text"
//                         id="code"
//                         name="code"
//                         value={formData.code}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="amount">Amount:</label>
//                     <input
//                         type="number"
//                         id="amount"
//                         name="amount"
//                         value={formData.amount}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <button type="submit">Submit</button>
//             </form>
//         </div>
//     );
// };

// export default RedeemFormPage;

'use client';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/app/ui/button';
import { RedeemState, validateRedeemForm } from '@/app/lib/actions';
import { useActionState } from 'react'
// @ts-ignore
import { redirect } from 'next/navigation';
// No Database - it slow down the page
import { productType } from '@/app/lib/definitions';

/**
 * RedeemFormPage component renders a form for redeeming points by providing user details such as phone number, address, country, state, city, and ZIP code.
 * It dynamically updates the state and country options based on user selection and validates the form data.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.player_id - The unique identifier of the player.
 * @param {number} props.total_points_available - The total points available for the player to redeem.
 *
 * @returns {JSX.Element} A form component for redeeming points.
 *
 * @remarks
 * - The component uses a static dataset for countries and their states to avoid performance issues caused by database calls.
 * - The form includes validation logic to ensure the correctness of the input data.
 * - The `useActionState` hook is used to manage the form's state and handle form submission.
 * - The `statesByCountry` object contains a mapping of countries to their respective states or regions.
 *
 * @example
 * ```tsx
 * <RedeemFormPage player_id="12345" total_points_available={1000} />
 * ```
 */


// product_id={product_id || ''}
// product_name={productInfo?.name}
// product_description={productInfo?.description}
// product_points={(productInfo?.points.toString())}
// total_points_available={total_points_available} 
// productInfo={productInfo} 

export default function RedeemFormPage({player_id,product_id,product_name,product_description,product_points,total_points_available}:
    {player_id:string,product_id:string,product_name:string,product_description:string,product_points:number,total_points_available:number}) {

    interface CustomFormData {
        player_id?: string;
        id?: string;
        total_points_available?: string;
        productPoints?: string;
        productName?: string;
        productDescription?: string;
        firstname?: string;
        middlename?: string;
        lastname?: string;
        phoneNum?: string;
        address1?: string;
        address2?: string;
        country?: string;
        city?: string;
        state?: string;
        zipCode?: string;
    }
    
    interface RedeemState {
        message: string|null;
        errors: {
            player_id?: string[];
            productId?: string[];
            total_points_available?: string[];
            productPoints?: string[];
            productName?: string[];
            productDescription?: string[];
            firstname?: string[];
            middlename?: string[];
            lastname?: string[];
            phoneNum?: string[];
            address1?: string[];
            address2?: string[];
            country?: string[];
            city?: string[];
            state?: string[];
            zipCode?: string[];
        };
        formData: FormData;
    }
    
    const initialState: RedeemState = { message: null, errors: {}, formData: new FormData() };

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

    const validateRedeem = (state: RedeemState | undefined, payload: FormData) => {
        const customFormData: CustomFormData = {
            player_id: (payload.get('player_id') as string) || '',
            id: (payload.get('productId') as string) || '',
            total_points_available: payload.get('total_points_available') ? Number(payload.get('total_points_available')).toString() : '0',
            productPoints: payload.get('productPoints') ? Number(payload.get('productPoints')).toString() : '0',
            productName: (payload.get('productName') as string) || '',
            productDescription: (payload.get('productDescription') as string) || '',            
            firstname: (payload.get('firstname') as string) || '',
            middlename: (payload.get('middlename') as string) || '',
            lastname: (payload.get('lastname') as string) || '',
            phoneNum: (payload.get('phoneNum') as string) || '',
            address1: (payload.get('address1') as string) || '',
            address2: (payload.get('address2') as string) || '',
            country: (payload.get('country') as string) || '',
            city: (payload.get('city') as string) || '',
            state: (payload.get('state') as string) || '',
            zipCode: (payload.get('zipCode') as string) || '',
        };
        console.log('Custom Form Data:', customFormData);
        setInputValue(customFormData);

        const currentState = state || { message: null, errors: {} };
        return validateRedeemForm(currentState, payload);
    };

    const [state, formAction] = useActionState(validateRedeem, initialState);

    const [inputValue, setInputValue] = useState<CustomFormData>({ 
        // player_id:player_id, 
        // id:product_id,
        // total_points_available: total_points_available.toString(),
        // productPoints: product_points,
        // productName: product_name,
        // productDescription: product_description,
        firstname: '', 
        middlename: '', 
        lastname: '', 
        phoneNum: '', 
        address1: '', 
        address2: '', 
        country: '', 
        city: '', 
        state: '', 
        zipCode: '' 
    });

    return (
        <form action={formAction} >
            <div className="overflow-x-auto grid gap-4" 
                style={{ 
                    maxHeight: 'calc(100vh - 200px)', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' 
                }}>
                {/* player ID */}
                {<div className="mb-4"> 
                    <input                       
                        type="hidden"
                        id="player_id"
                        value={player_id}
                        readOnly
                        name="player_id"
                    />
                     <input
                        type="hidden"
                        id="productId"
                        value={product_id}
                        readOnly
                        name="productId"
                    />
                    <label htmlFor="Player" className="mb-2 block text-sm font-medium" id="total_points_available">
                        Available Points:{total_points_available}
                    </label>
                    <input
                        type="hidden"
                        id="total_points_available"
                        name="total_points_available"
                        value={total_points_available}
                        readOnly
                        className="peer w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <label htmlFor="productPoints" className="mb-2 block text-sm font-medium">
                        Product Points: {product_points}
                    </label>
                    <input
                        type="hidden"
                        id="productPoints"
                        name="productPoints"
                        value={product_points}
                        readOnly
                        className="peer w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <label htmlFor="productName" className="mb-2 block text-sm font-medium">
                        Product Name:{product_name}
                    </label>
                    <input
                        type="hidden"
                        id="productName"
                        name="productName"
                        value={product_name}
                        readOnly
                        className="peer w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />
                    <label htmlFor="productDescription" className="mb-2 block text-sm font-medium">
                        Product Description:{product_description}
                    </label>
                    <input
                        type="hidden"
                        id="productDescription"
                        name="productDescription"
                        value={product_description}
                        readOnly
                        className="peer w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    />                   
                </div>}
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
                            className="peer w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="customer-error"
                        >                            
                        </input>
                    </div>
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.firstname &&
                            state.errors.firstname.map((error: string) => (
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
                            className="peer w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="customer-error"
                        >                            
                        </input>
                    </div>
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.middlename &&
                            state.errors.middlename.map((error: string) => (
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
                            className="peer w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="customer-error"
                        >                           
                        </input>
                    </div>
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.lastname &&
                            state.errors.lastname.map((error: string) => (
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
                {/* ZIP Code */}
                <div className="mb-4">
                    <label htmlFor="zipCode" className="mb-2 block text-sm font-medium">
                        ZIP Code
                    </label>
                    {/* <div className="relative mt-2 rounded-md"> */}
                    <div className="relative">
                        <input
                            id="zipCode"
                            name="zipCode"
                            type="number"
                            // step="0.01"
                            defaultValue={Number(inputValue.zipCode) || 0}
                            // placeholder="Enter pointsUSD amount"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby="customer-error"
                        />
                    </div>
                    <div id="customer-error" aria-live="polite" aria-atomic="true">
                        {state?.errors?.zipCode &&
                            state.errors.zipCode.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))
                        }
                    </div>
                    {/* </div> */}
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/redeem"
                    // className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                    className='shining-button'
                >
                    Cancel
                </Link>
                <Button 
                    className='shining-button' 
                    type="submit" 
                    
                >
                    Redeem Points
                </Button>
            </div>
        </form>
    );
}


