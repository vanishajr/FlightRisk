
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Heart, Shield, Video } from 'lucide-react';

const FlightAwareness = () => {
  const safetyVideos = [
    {
      title: "Pre-Flight Safety Demonstration",
      url: "https://www.youtube.com/watch?v=DtyfiPIHsIg",
      description: "Essential safety procedures every passenger should know"
    },
    {
      title: "Understanding Turbulence",
      url: "https://www.youtube.com/watch?v=C0auJvY5E_I", 
      description: "Why turbulence happens and why it's usually not dangerous"
    },
    {
      title: "Emergency Procedures",
      url: "https://www.youtube.com/watch?v=kMu1ZgMeYR8",
      description: "What to do in unlikely emergency situations"
    }
  ];

  const flightRules = [
    "Keep your seatbelt fastened when seated",
    "Follow crew instructions at all times",
    "Keep aisles and exits clear of personal items",
    "Use electronic devices only when permitted",
    "Remain seated during taxi, takeoff, and landing",
    "Report any suspicious activity to crew members",
    "Do not tamper with safety equipment",
    "Keep carry-on items properly stowed"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Welcome Aboard - Safety First
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Captain's Welcome Message</h4>
            <p className="text-blue-700 text-sm leading-relaxed">
              "Good day, ladies and gentlemen, and welcome aboard. I'm Captain Smith, and along with 
              my crew, we're delighted to have you with us today. We'll be cruising at an altitude of 
              35,000 feet at a speed of approximately 580 knots. Our flight time today will be 
              approximately 3 hours and 45 minutes. The weather at our destination is clear with 
              light winds, and we're expecting a smooth flight. Please ensure your seatbelts are 
              fastened, and let us know if you need anything to make your journey more comfortable. 
              Thank you for flying with us."
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Safety Regulations & Guidelines</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {flightRules.map((rule, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-1 text-xs">
                    {index + 1}
                  </Badge>
                  <span className="text-sm">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Safety Education Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {safetyVideos.map((video, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h5 className="font-medium mb-2">{video.title}</h5>
                <p className="text-sm text-muted-foreground mb-3">{video.description}</p>
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Watch Video →
                </a>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Health & Comfort Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="secondary">💧</Badge>
              <div>
                <h5 className="font-medium">Stay Hydrated</h5>
                <p className="text-sm text-muted-foreground">Drink water regularly. Cabin air can be dry.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary">🦵</Badge>
              <div>
                <h5 className="font-medium">Move Regularly</h5>
                <p className="text-sm text-muted-foreground">Stretch your legs and feet to improve circulation.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="secondary">😴</Badge>
              <div>
                <h5 className="font-medium">Rest Comfortably</h5>
                <p className="text-sm text-muted-foreground">Adjust your seat and use provided amenities.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlightAwareness;
