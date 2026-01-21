import json
import os
from models import Recipe, Job, ProductionLog

# --- CONFIGURATION ---
DATA_FILE = "sgp_data.json"

# Standard SGP Recipes (These stay hardcoded as 'Configuration')
RECIPES = {
    'RCP-HD-STD': Recipe('RCP-HD-STD', 'Standard HDPE Bag', {'HDPE 5712 NP': 0.50, 'HDPE(OGA)': 0.40, 'CaCO3': 0.10}),
    'RCP-LD-CLR': Recipe('RCP-LD-CLR', 'Clear LDPE Sheet', {'LDPE NATURAL': 0.80, 'LDPE RECYCLE': 0.20}),
    'RCP-HD-ATLAS': Recipe('RCP-HD-ATLAS', 'Atlas Mix', {'HF0961': 0.50, 'XP 6056RA': 0.25, 'EX1999': 0.25}),
    'RCP-LD-IND': Recipe('RCP-LD-IND', 'Industrial Slit Bag', {'LDPE RECYCLE': 0.50, 'LLDPE 0209 SA': 0.40, 'Slip Agent': 0.10})
}

# --- GLOBAL STATE ---
INVENTORY = {} # Will load from file
JOBS = []      # Will load from file
LOGS = []      # Will load from file

# --- PERSISTENCE ENGINE ---

def save_data():
    """Writes current state to JSON file."""
    data = {
        "inventory": INVENTORY,
        "jobs": [j.to_dict() for j in JOBS],
        "logs": [l.to_dict() for l in LOGS]
    }
    try:
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=4)
        print("Data saved successfully.")
    except Exception as e:
        print(f"Error saving data: {e}")

def load_data():
    """Reads state from JSON file."""
    global INVENTORY, JOBS, LOGS
    
    # Default Initial Inventory (if no file exists)
    default_inventory = {
        'HDPE 5712 NP': 5000, 'HDPE(OGA)': 3000, 'CaCO3': 1000,
        'LDPE NATURAL': 8000, 'LDPE RECYCLE': 2000, 'HF0961': 1500,
        'XP 6056RA': 1000, 'EX1999': 1000, 'LLDPE 0209 SA': 2500, 'Slip Agent': 500
    }

    if not os.path.exists(DATA_FILE):
        print("No data file found. Creating new database.")
        INVENTORY = default_inventory
        JOBS = []
        LOGS = []
        save_data() # Create the file
        return

    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
            
        # Restore Inventory
        INVENTORY = data.get("inventory", default_inventory)
        
        # Restore Jobs (Convert dicts back to Objects)
        JOBS = [Job.from_dict(j) for j in data.get("jobs", [])]
        
        # Restore Logs
        LOGS = [ProductionLog.from_dict(l) for l in data.get("logs", [])]
        
        print(f"Loaded {len(JOBS)} jobs and {len(LOGS)} logs.")
        
    except Exception as e:
        print(f"Error loading data: {e}. Starting fresh.")
        INVENTORY = default_inventory
        JOBS = []
        LOGS = []

# --- AUTO-LOAD ON STARTUP ---
load_data()