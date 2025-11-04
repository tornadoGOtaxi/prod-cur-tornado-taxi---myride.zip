
import React, { useState } from 'react';
import { Ride, User } from '../types';
import { useData } from '../context/DataContext';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../components/ui/Card';
import TornadoTaxiLogo from '../components/TornadoTaxiLogo';
import { RIDE_STATUS_COLORS } from '../constants';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface PublicStatusPageProps {
  ride: Ride;
  navigate: (page: 'landing') => void;
  user?: User | null;
}

const PublicStatusPage: React.FC<PublicStatusPageProps> = ({ ride, navigate, user }) => {
  const { rideActivityLogs, users, driverLocations, messages, actions } = useData();
  const [chatInput, setChatInput] = useState('');

  const relevantLogs = rideActivityLogs
    .filter(log => log.ride_id === ride.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const driver = users.find(u => u.id === ride.assigned_driver_id);
  const driverLocation = driverLocations.find(dl => dl.driver_id === ride.assigned_driver_id);

  const rideMessages = messages.filter(m => m.ride_id === ride.id).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const isPassengerOfRide = user && user.id === ride.requester_user_id;

  const handleSendMessage = () => {
    if (!chatInput.trim() || !user || !ride.assigned_driver_id) return;
    actions.addMessage({
        ride_id: ride.id,
        sender_id: user.id,
        receiver_id: ride.assigned_driver_id,
        message_text: chatInput,
        is_system: false,
    });
    setChatInput('');
  };


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
       <button onClick={() => navigate('landing')} className="absolute top-4 left-4 text-primary hover:underline">
        &larr; Back to Home
      </button>
      <TornadoTaxiLogo className="w-20 h-20 my-8" />
      <div className="w-full max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                  <CardTitle>Ride Status</CardTitle>
                  <CardDescription>Ride ID: {ride.id.split('-')[1]}</CardDescription>
              </div>
              <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${RIDE_STATUS_COLORS[ride.status]}`}>{ride.status}</span>
            </div>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                      <h4 className="font-bold">Pickup</h4>
                      <p>{ride.pickup_details}</p>
                  </div>
                  <div>
                      <h4 className="font-bold">Drop-off</h4>
                      <p>{ride.dropoff_details}</p>
                  </div>
                  <div>
                      <h4 className="font-bold">Requested Time</h4>
                      <p>{new Date(ride.ride_date_time).toLocaleString()}</p>
                  </div>
                  {driver && (
                      <div>
                          <h4 className="font-bold">Your Driver</h4>
                          <p>{driver.name}</p>
                      </div>
                  )}
              </div>
          </CardContent>
        </Card>
        
        {ride.is_sharing_location && driverLocation && (
          <Card className="mb-6">
            <CardContent className="p-4">
               <div className="bg-gray-200 rounded-lg p-4 text-center">
                  <h5 className="font-bold">Live Driver Location</h5>
                  <div className="w-full h-48 bg-gray-300 rounded-md my-2 flex items-center justify-center relative">
                      <span className="text-gray-500">Map Placeholder</span>
                      <div className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white" style={{ top: '40%', left: '50%' }} title="Driver"></div>
                  </div>
                  <p className="text-sm">Lat: {driverLocation.last_lat.toFixed(4)}, Lng: {driverLocation.last_lng.toFixed(4)}</p>
                  <p className="text-xs text-gray-500">Last updated: {new Date(driverLocation.last_updated_at).toLocaleTimeString()}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {isPassengerOfRide && ride.assigned_driver_id && (
           <Card className="mb-6">
             <CardHeader>
                <CardTitle>Chat with {driver?.name || 'Driver'}</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-4 h-64 overflow-y-auto pr-4 mb-4 border rounded-md p-4 bg-gray-50">
                    {rideMessages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender_id === user.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p className="text-sm">{msg.message_text}</p>
                                <p className={`text-xs mt-1 text-right ${msg.sender_id === user.id ? 'text-indigo-200' : 'text-gray-500'}`}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..." />
                    <Button onClick={handleSendMessage}>Send</Button>
                </div>
             </CardContent>
           </Card>
        )}

        <Card>
          <CardHeader><CardTitle>Activity Timeline</CardTitle></CardHeader>
          <CardContent>
              <div className="border-l-2 border-primary pl-4 space-y-6">
                  {relevantLogs.map(log => (
                      <div key={log.id} className="relative">
                          <div className="absolute -left-[1.2rem] w-3 h-3 bg-secondary rounded-full mt-1.5 ring-4 ring-gray-100"></div>
                          <p className="font-semibold text-primary">{log.event_type.replace(/_/g, ' ')}</p>
                          <p className="text-sm">{log.event_description}</p>
                          <p className="text-xs text-gray-500">{new Date(log.created_at).toLocaleString()}</p>
                      </div>
                  ))}
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicStatusPage;