import plotly.graph_objects as go
import plotly.express as px
from typing import Dict
import pandas as pd
from risk_calculator import RiskAssessment

def create_risk_factors_chart(risk_assessment: RiskAssessment) -> go.Figure:
    # Prepare data for plotting
    factors_data = []
    for factor, data in risk_assessment['factors'].items():
        factors_data.append({
            'Factor': factor.capitalize(),
            'Risk': data['risk'],
            'Value': data['value'],
            'Description': data['description']
        })
    
    df = pd.DataFrame(factors_data)
    
    # Create bar chart
    fig = go.Figure()
    
    # Add bars with color based on risk level
    colors = ['#4ade80' if r <= 0.3 else '#facc15' if r <= 0.7 else '#f87171' 
              for r in df['Risk']]
    
    fig.add_trace(go.Bar(
        x=df['Factor'],
        y=df['Risk'],
        marker_color=colors,
        text=[f"{r:.1%}" for r in df['Risk']],
        textposition='auto',
        hovertemplate=(
            "<b>%{x}</b><br>" +
            "Risk: %{y:.1%}<br>" +
            "Value: %{customdata[0]}<br>" +
            "%{customdata[1]}<br>" +
            "<extra></extra>"
        ),
        customdata=df[['Value', 'Description']].values
    ))
    
    # Update layout
    fig.update_layout(
        title='Flight Risk Factors',
        xaxis_title='Factors',
        yaxis_title='Risk Level',
        yaxis=dict(
            tickformat='.0%',
            range=[0, 1]
        ),
        showlegend=False,
        template='plotly_white'
    )
    
    return fig

def create_risk_gauge(risk_assessment: RiskAssessment) -> go.Figure:
    # Create gauge chart
    fig = go.Figure(go.Indicator(
        mode="gauge+number",
        value=risk_assessment['score'],
        title={'text': "Overall Risk Score"},
        gauge={
            'axis': {'range': [0, 100]},
            'bar': {'color': get_risk_color(risk_assessment['level'])},
            'steps': [
                {'range': [0, 30], 'color': '#4ade80'},
                {'range': [30, 70], 'color': '#facc15'},
                {'range': [70, 100], 'color': '#f87171'}
            ],
            'threshold': {
                'line': {'color': "red", 'width': 4},
                'thickness': 0.75,
                'value': 70
            }
        }
    ))
    
    fig.update_layout(
        height=300,
        margin=dict(l=20, r=20, t=50, b=20)
    )
    
    return fig

def get_risk_color(level: str) -> str:
    colors = {
        'low': '#4ade80',
        'medium': '#facc15',
        'high': '#f87171'
    }
    return colors.get(level, '#4ade80')

def create_risk_visualization(risk_assessment: RiskAssessment) -> Dict[str, go.Figure]:
    """
    Creates all visualizations for the risk assessment
    Returns a dictionary of figures
    """
    return {
        'risk_factors': create_risk_factors_chart(risk_assessment),
        'risk_gauge': create_risk_gauge(risk_assessment)
    } 