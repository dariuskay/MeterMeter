import pandas as pd
from sodapy import Socrata
import datetime as dt
import requests


client = Socrata("data.lacity.org", None)

results = client.get("e7h6-4a3e", limit=6000)

def convert_to_json():

	client = Socrata("data.lacity.org", None)

	results = client.get("e7h6-4a3e", limit=6000)

	results_df = pd.DataFrame.from_records(results)

	results_df.columns = ['eventtime', 'occupancystate', 'SpaceID']

	inventory_df = pd.read_csv('data/Parking_Meter_Inventory.csv')

	merged = pd.merge(results_df, inventory_df, on='SpaceID', how='inner')

	merged.drop(['StreetCleaning','Zip Codes', 'Census Tracts', 'Precinct Boundaries',
       'LA Specific Plans', 'Council Districts',
       'Neighborhood Councils (Certified)'],inplace=True, axis=1)

	merged.to_json('data/joined.json', orient='records')

if __name__ == "__main__":
    convert_to_json()