import numpy as np
import pandas as pd
from typing import Dict, TypedDict, Literal
import skfuzzy as fuzz
from skfuzzy import control as ctrl

class FlightData(TypedDict):
    speed: float
    acceleration: float
    temperature: float
    humidity: float
    wind_speed: float
    visibility: float

class RiskAssessment(TypedDict):
    score: float
    level: Literal['low', 'medium', 'high']
    factors: Dict[str, Dict[str, float | str]]

# Define fuzzy membership functions
def create_fuzzy_system():
    # Universe of discourse
    speed_range = np.arange(0, 1000, 1)
    accel_range = np.arange(-5, 5, 0.1)
    temp_range = np.arange(-20, 50, 0.1)
    humidity_range = np.arange(0, 100, 1)
    wind_range = np.arange(0, 50, 1)
    visibility_range = np.arange(0, 20, 0.1)
    risk_range = np.arange(0, 1.1, 0.1)

    # Fuzzy membership functions
    speed = ctrl.Antecedent(speed_range, 'speed')
    acceleration = ctrl.Antecedent(accel_range, 'acceleration')
    temperature = ctrl.Antecedent(temp_range, 'temperature')
    humidity = ctrl.Antecedent(humidity_range, 'humidity')
    wind_speed = ctrl.Antecedent(wind_range, 'wind_speed')
    visibility = ctrl.Antecedent(visibility_range, 'visibility')
    risk = ctrl.Consequent(risk_range, 'risk')

    # Define membership functions
    speed['low'] = fuzz.trimf(speed_range, [0, 400, 500])
    speed['medium'] = fuzz.trimf(speed_range, [400, 550, 600])
    speed['high'] = fuzz.trimf(speed_range, [550, 600, 1000])

    acceleration['low'] = fuzz.trimf(accel_range, [-5, -0.5, 0])
    acceleration['medium'] = fuzz.trimf(accel_range, [-0.5, 0, 2])
    acceleration['high'] = fuzz.trimf(accel_range, [0, 2, 5])

    temperature['low'] = fuzz.trimf(temp_range, [-20, 0, 15])
    temperature['medium'] = fuzz.trimf(temp_range, [5, 15, 25])
    temperature['high'] = fuzz.trimf(temp_range, [15, 35, 50])

    humidity['low'] = fuzz.trimf(humidity_range, [0, 20, 40])
    humidity['medium'] = fuzz.trimf(humidity_range, [30, 50, 70])
    humidity['high'] = fuzz.trimf(humidity_range, [60, 80, 100])

    wind_speed['low'] = fuzz.trimf(wind_range, [0, 5, 15])
    wind_speed['medium'] = fuzz.trimf(wind_range, [10, 20, 30])
    wind_speed['high'] = fuzz.trimf(wind_range, [25, 35, 50])

    visibility['low'] = fuzz.trimf(visibility_range, [0, 2, 5])
    visibility['medium'] = fuzz.trimf(visibility_range, [3, 7, 10])
    visibility['high'] = fuzz.trimf(visibility_range, [8, 15, 20])

    risk['low'] = fuzz.trimf(risk_range, [0, 0.2, 0.4])
    risk['medium'] = fuzz.trimf(risk_range, [0.3, 0.5, 0.7])
    risk['high'] = fuzz.trimf(risk_range, [0.6, 0.8, 1.0])

    return {
        'speed': speed,
        'acceleration': acceleration,
        'temperature': temperature,
        'humidity': humidity,
        'wind_speed': wind_speed,
        'visibility': visibility,
        'risk': risk
    }

def calculate_risk(data: FlightData) -> RiskAssessment:
    fuzzy_system = create_fuzzy_system()
    factors = {}
    total_risk = 0
    weights = {
        'speed': 0.3,
        'acceleration': 0.1,
        'temperature': 0.15,
        'humidity': 0.05,
        'wind_speed': 0.25,
        'visibility': 0.15
    }

    # Calculate individual factor risks using fuzzy logic
    for factor, value in data.items():
        if factor in fuzzy_system:
            antecedent = fuzzy_system[factor]
            risk = fuzzy_system['risk']
            
            # Calculate membership values
            low_membership = fuzz.interp_membership(antecedent.universe, antecedent['low'].mf, value)
            medium_membership = fuzz.interp_membership(antecedent.universe, antecedent['medium'].mf, value)
            high_membership = fuzz.interp_membership(antecedent.universe, antecedent['high'].mf, value)
            
            # Calculate risk score using weighted average
            factor_risk = (low_membership * 0.2 + medium_membership * 0.5 + high_membership * 0.8)
            total_risk += factor_risk * weights[factor]
            
            factors[factor] = {
                'value': value,
                'risk': factor_risk,
                'weight': weights[factor],
                'description': get_factor_description(factor)
            }

    # Normalize risk score to 0-100 range
    normalized_score = round(total_risk * 100)
    
    # Determine risk level
    if normalized_score <= 30:
        level = 'low'
    elif normalized_score <= 70:
        level = 'medium'
    else:
        level = 'high'

    return {
        'score': normalized_score,
        'level': level,
        'factors': factors
    }

def get_factor_description(factor: str) -> str:
    descriptions = {
        'speed': 'Aircraft speed in knots',
        'acceleration': 'Rate of speed change',
        'temperature': 'Outside air temperature',
        'humidity': 'Air humidity percentage',
        'wind_speed': 'Current wind speed',
        'visibility': 'Visibility distance in km'
    }
    return descriptions.get(factor, '') 