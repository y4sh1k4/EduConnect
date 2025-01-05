import React, { useEffect, useState } from 'react';
import { Plus, Users, Calendar, User, DollarSign } from 'lucide-react';
import { c_abi,c_address } from '../utils/ContractDetails';
import { useAccount, useReadContract,useWriteContract } from 'wagmi';
import { Link } from 'react-router-dom';
interface Event {
  eventId:number,
  name: string;
  description: string;
  fromDate: string;
  toDate: string;
  organizer: string;
  isHackathon: boolean;
  eventFee: number;
  image: string;
}


export default function EventsPage() {
  const {address}= useAccount()
  const EVENTS = useReadContract({
    abi:c_abi,
    address:c_address,
    functionName:'getEvents'
  })
  const MOCK_EVENTS= (EVENTS.data?EVENTS.data:[]) as Event[];
  console.log("events",MOCK_EVENTS)
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    isHackathon: false,
    eventFee: 0,
  });
  const [eventRegistered,setEventRegistered]= useState(0);
  const {writeContract} = useWriteContract();
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const createdEvent = {
      ...newEvent,
      id: (events.length + 1).toString(),
      image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754',
    } as Event;
    
    setEvents([...events, createdEvent]);
    setShowCreateForm(false);
    setNewEvent({ isHackathon: false, eventFee: 0 });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEvent(prev => ({ ...prev, isHackathon: e.target.checked }));
  };

  function dateTimeLocalToUnix(dateTimeLocalValue:string) {
    const date = new Date(dateTimeLocalValue);
    return Math.floor(date.getTime() / 1000); 
}
  function unixToDateTimeLocal(unixTimestamp:number) {
    const date = new Date(unixTimestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }
  const createNewEvent=()=>{
    writeContract({
      abi:c_abi,
      address:c_address,
      functionName:'createEvent',
      args:[
        newEvent.name,
        dateTimeLocalToUnix(newEvent.fromDate?newEvent.fromDate:""),
        dateTimeLocalToUnix(newEvent.toDate?newEvent.toDate:""),
        newEvent.description,
        newEvent.isHackathon,
        newEvent.eventFee,
        address
      ],
      value:BigInt(10000000000000)
    })
    console.log(newEvent)
    console.log(newEvent.fromDate)
    console.log(dateTimeLocalToUnix(newEvent.fromDate?newEvent.fromDate:""))
  }

  const registerEvent=(id:number,fee:number)=>{
    writeContract({
      abi:c_abi,
      address:c_address,
      functionName:'registerEvent',
      args:[
        id
      ],
      value:BigInt(fee)
    })
    setEventRegistered(id)
    
  }
  const bool= useReadContract({
    abi:c_abi,
    address:c_address,
    functionName:'isRegisteredForEvent',
    args:[
        eventRegistered,
        address
      ]
  })
  console.log("hey",bool.data)
  useEffect(()=>{
    console.log("event registered")
  },[eventRegistered])
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Upcoming Events</h1>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-gray-800/40 backdrop-blur-sm text-white px-6 py-2.5 rounded-lg hover:bg-gray-700/60 transition-all duration-300 border border-gray-700/50"
        >
          <Plus size={18} />
          Create Event
        </button>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-xl border border-gray-700/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <Calendar className="h-6 w-6 text-blue-400" />
                Create New Event
              </h2>
              <form onSubmit={handleCreateEvent} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-300">
                      Event Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-gray-500 backdrop-blur-sm transition-colors"
                      value={newEvent.name || ''}
                      onChange={handleInputChange}
                      placeholder="Enter event name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-300">
                      Event fee
                    </label>
                    <input
                      type="number"
                      id="eventFee"
                      name="eventFee"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-gray-500 backdrop-blur-sm transition-colors"
                      value={newEvent.eventFee || ''}
                      onChange={handleInputChange}
                      placeholder="Enter event name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-300">
                      From
                    </label>
                    <input
                      type="datetime-local"
                      id="fromDate"
                      name="fromDate"
                      required
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-gray-500 backdrop-blur-sm transition-colors"
                      
                      onChange={handleInputChange}
                      placeholder="Enter event name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-300">
                      To
                    </label>
                    <input
                      type="datetime-local"
                      id="toDate"
                      name="toDate"
                      required
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-gray-500 backdrop-blur-sm transition-colors"
                      
                      onChange={handleInputChange}
                      placeholder="Enter event name"
                    />
                  </div>

                  <div className="flex items-center space-x-2 bg-gray-900/30 p-4 rounded-lg border border-gray-700/50">
                    <input
                      type="checkbox"
                      id="isHackathon"
                      checked={newEvent.isHackathon}
                      onChange={handleSwitchChange}
                      className="w-5 h-5 bg-gray-800 border-gray-600 rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                    />
                    <label htmlFor="isHackathon" className="text-sm font-medium text-gray-300">
                      This is a Hackathon
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-300">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-gray-500 backdrop-blur-sm transition-colors"
                    value={newEvent.description || ''}
                    onChange={handleInputChange}
                    placeholder="Enter event description"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2.5 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700/70 transition-all duration-300 border border-gray-700/50 backdrop-blur-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600/80 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 backdrop-blur-sm"
                    onClick={createNewEvent}
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_EVENTS.map((event) => (
          <div key={event.eventId} className="group relative">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-gray-900/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative bg-gradient-to-b from-gray-900/90 to-gray-800/90 backdrop-blur-md rounded-xl border border-gray-700/50 overflow-hidden hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90 z-10"></div>
                <img
                  src={"https://images.unsplash.com/photo-1515169067868-5387ec356754"}
                  alt={event.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                  {event.name}
                </h3>
                <p className="text-sm text-gray-400">{event.description}</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">{unixToDateTimeLocal(Number(event.fromDate))} to {unixToDateTimeLocal(Number(event.fromDate))}</span>
                  </div>
                  {/* <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">{event.fromTime} - {event.toTime}</span>
                  </div> */}
                  <div className="flex items-center gap-2 text-gray-300">
                    <User className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">{event.organizer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <DollarSign className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">${Number(event.eventFee)}</span>
                  </div>
                </div>
                {event.isHackathon && (
                  <div className="pt-4 space-y-3">
                      {bool.data?(
                        <button className="w-full bg-gray-800/50 hover:bg-gray-700/70 text-white px-6 py-2.5 rounded-lg transition-all duration-300 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center gap-2" >
                        Registered
                      </button>
                      ):(
                        <button className="w-full bg-blue-600/80 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-all duration-300 backdrop-blur-sm" onClick={()=>registerEvent(Number(event.eventId),Number(event.eventFee))}>
                        Register Now
                      </button>
                      
                      )}
                    
                    <Link to="/connections" >
                      <button 
                        className="w-full my-2.5 bg-gray-800/50 hover:bg-gray-700/70 text-white px-6 py-2.5 rounded-lg transition-all duration-300 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center gap-2"
                      >
                        <Users size={16} />
                        Find Teammate
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}