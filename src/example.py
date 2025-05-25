from risk_calculator import calculate_risk, FlightData
from visualization import create_risk_visualization
import plotly.io as pio

def main():
    # Example flight data
    flight_data: FlightData = {
        'speed': 550,
        'acceleration': 0,
        'temperature': 15,
        'humidity': 60,
        'wind_speed': 10,
        'visibility': 10
    }
    
    # Calculate risk assessment
    risk_assessment = calculate_risk(flight_data)
    
    # Create visualizations
    figures = create_risk_visualization(risk_assessment)
    
    # Save visualizations to HTML files
    pio.write_html(figures['risk_factors'], 'risk_factors.html')
    pio.write_html(figures['risk_gauge'], 'risk_gauge.html')
    
    # Print risk assessment results
    print(f"\nOverall Risk Score: {risk_assessment['score']}")
    print(f"Risk Level: {risk_assessment['level'].upper()}")
    print("\nFactor-wise Risk Assessment:")
    for factor, data in risk_assessment['factors'].items():
        print(f"\n{factor.capitalize()}:")
        print(f"  Value: {data['value']}")
        print(f"  Risk: {data['risk']:.1%}")
        print(f"  Weight: {data['weight']:.1%}")
        print(f"  Description: {data['description']}")

if __name__ == "__main__":
    main() 