
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, BookOpen, Gamepad2, Coffee, Heart } from 'lucide-react';

interface EntertainmentCornerProps {
  riskLevel: 'low' | 'medium' | 'high';
}

const EntertainmentCorner = ({ riskLevel }: EntertainmentCornerProps) => {
  const getRecommendations = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high':
        return {
          message: "Feeling nervous? Here are some calming activities to help you relax:",
          activities: [
            {
              title: "Calming Music Playlist",
              description: "Peaceful instrumental and nature sounds",
              link: "https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u",
              icon: <Music className="h-4 w-4" />,
              type: "music"
            },
            {
              title: "Breathing Exercises",
              description: "4-7-8 breathing technique for relaxation",
              link: "#breathing",
              icon: <Heart className="h-4 w-4" />,
              type: "wellness"
            },
            {
              title: "Meditation Guide",
              description: "5-minute mindfulness meditation",
              link: "#meditation",
              icon: <Coffee className="h-4 w-4" />,
              type: "wellness"
            }
          ]
        };
      case 'medium':
        return {
          message: "Enjoy your flight with these engaging activities:",
          activities: [
            {
              title: "Chill Playlist",
              description: "Relaxing tunes for a smooth journey",
              link: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd",
              icon: <Music className="h-4 w-4" />,
              type: "music"
            },
            {
              title: "Light Reading",
              description: "Short stories and articles",
              link: "#reading",
              icon: <BookOpen className="h-4 w-4" />,
              type: "reading"
            },
            {
              title: "Brain Games",
              description: "Puzzles and word games",
              link: "#games",
              icon: <Gamepad2 className="h-4 w-4" />,
              type: "games"
            }
          ]
        };
      case 'low':
        return {
          message: "Perfect flying conditions! Enjoy these entertainment options:",
          activities: [
            {
              title: "Upbeat Playlist",
              description: "Energizing music for a great flight",
              link: "https://open.spotify.com/playlist/37i9dQZF1DX0XUfTFmNBRM",
              icon: <Music className="h-4 w-4" />,
              type: "music"
            },
            {
              title: "Adventure Books",
              description: "Exciting stories and novels",
              link: "#books",
              icon: <BookOpen className="h-4 w-4" />,
              type: "reading"
            },
            {
              title: "Interactive Games",
              description: "Challenging puzzles and trivia",
              link: "#interactive",
              icon: <Gamepad2 className="h-4 w-4" />,
              type: "games"
            }
          ]
        };
    }
  };

  const recommendations = getRecommendations(riskLevel);

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'music': return 'bg-purple-100 text-purple-800';
      case 'reading': return 'bg-green-100 text-green-800';
      case 'games': return 'bg-orange-100 text-orange-800';
      case 'wellness': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coffee className="h-5 w-5" />
          Entertainment & Calm Corner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-3">
            {recommendations.message}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recommendations.activities.map((activity, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  {activity.icon}
                  <h5 className="font-medium text-sm">{activity.title}</h5>
                  <Badge variant="secondary" className={`text-xs ${getActivityColor(activity.type)}`}>
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{activity.description}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => {
                    if (activity.link.startsWith('http')) {
                      window.open(activity.link, '_blank');
                    } else {
                      // Handle internal links
                      console.log(`Navigate to ${activity.link}`);
                    }
                  }}
                >
                  {activity.type === 'music' ? 'Listen Now' : 
                   activity.type === 'reading' ? 'Start Reading' :
                   activity.type === 'games' ? 'Play Now' : 'Try Now'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {riskLevel === 'high' && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Quick Relaxation Technique</h4>
            <p className="text-sm text-blue-700 mb-2">Try the 4-7-8 breathing method:</p>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Breathe in through your nose for 4 counts</li>
              <li>2. Hold your breath for 7 counts</li>
              <li>3. Exhale slowly through your mouth for 8 counts</li>
              <li>4. Repeat 3-4 times</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EntertainmentCorner;
