
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

const flightDataSchema = z.object({
  speed: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Speed must be a positive number",
  }),
  acceleration: z.string().refine(val => !isNaN(Number(val)), {
    message: "Acceleration must be a number",
  }),
  temperature: z.string().refine(val => !isNaN(Number(val)), {
    message: "Temperature must be a number",
  }),
  humidity: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
    message: "Humidity must be a percentage between 0 and 100",
  }),
  windSpeed: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Wind speed must be a positive number",
  }),
  visibility: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Visibility must be a positive number",
  }),
});

type FlightDataFormValues = z.infer<typeof flightDataSchema>;

interface FlightDataFormProps {
  onSubmitData: (data: Record<string, number>) => void;
}

const FlightDataForm = ({ onSubmitData }: FlightDataFormProps) => {
  const form = useForm<FlightDataFormValues>({
    resolver: zodResolver(flightDataSchema),
    defaultValues: {
      speed: "550",
      acceleration: "0",
      temperature: "15",
      humidity: "60",
      windSpeed: "10",
      visibility: "10",
    },
  });

  function onSubmit(data: FlightDataFormValues) {
    const numericData: Record<string, number> = {
      speed: Number(data.speed),
      acceleration: Number(data.acceleration),
      temperature: Number(data.temperature),
      humidity: Number(data.humidity),
      windSpeed: Number(data.windSpeed),
      visibility: Number(data.visibility),
    };
    
    onSubmitData(numericData);
    toast.success("Flight data updated successfully");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Flight Data</CardTitle>
        <CardDescription>
          Enter current flight metrics and environmental conditions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="speed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Speed (knots)</FormLabel>
                    <FormControl>
                      <Input placeholder="Speed" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="acceleration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Acceleration (knots/min)</FormLabel>
                    <FormControl>
                      <Input placeholder="Acceleration" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature (°C)</FormLabel>
                    <FormControl>
                      <Input placeholder="Temperature" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="humidity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Humidity (%)</FormLabel>
                    <FormControl>
                      <Input placeholder="Humidity" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="windSpeed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wind Speed (knots)</FormLabel>
                    <FormControl>
                      <Input placeholder="Wind Speed" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility (km)</FormLabel>
                    <FormControl>
                      <Input placeholder="Visibility" {...field} />
                    </FormControl>
                    <FormDescription>
                      Distance with clear visibility in kilometers
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">Update Risk Assessment</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FlightDataForm;
