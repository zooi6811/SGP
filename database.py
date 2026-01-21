import json
import os
from models import Recipe, Job, ProductionLog, Machine

# --- CONFIGURATION ---
DATA_FILE = "sgp_data.json"

# Standard SGP Recipes (These stay hardcoded as 'Configuration')
RECIPES = {
    'RCP-HD-STD': Recipe('RCP-HD-STD', 'Standard HDPE Bag', {'HDPE 5712 NP': 0.50, 'HDPE(OGA)': 0.40, 'CaCO3': 0.10}),
    'RCP-LD-CLR': Recipe('RCP-LD-CLR', 'Clear LDPE Sheet', {'LDPE NATURAL': 0.80, 'LDPE RECYCLE': 0.20}),
    'RCP-HD-ATLAS': Recipe('RCP-HD-ATLAS', 'Atlas Mix', {'HF0961': 0.50, 'XP 6056RA': 0.25, 'EX1999': 0.25}),
    'RCP-LD-IND': Recipe('RCP-LD-IND', 'Industrial Slit Bag', {'LDPE RECYCLE': 0.50, 'LLDPE 0209 SA': 0.40, 'Slip Agent': 0.10})
}

# --- STATIC MACHINE CONFIGURATION (From your CSVs) ---
# We define the "Default" state of the factory here.
DEFAULT_MACHINES = [
    # Blowing Machines (B-Lines)
    Machine("B1", "Blowing", "650 MM", "LDPE", "Idle"),
    Machine("B2", "Blowing", "650 MM", "LDPE", "Idle"),
    Machine("B3", "Blowing", "1100 MM", "LDPE", "Idle"),
    Machine("B4", "Blowing", "1400 MM", "LDPE", "Idle"),
    Machine("B5", "Blowing", "1100 MM", "LDPE / SHEET", "Idle"),
    Machine("B6", "Blowing", "1700 MM", "LDPE / SHEET", "Idle"),
    Machine("B7", "Blowing", "1700 MM", "LDPE / SHEET", "Idle"), # Added common big line
    
    # Cutting Machines (C-Lines)
    Machine("C1", "Cutting", "900 MM", "PE, PP, LD, HD", "Idle"),
    Machine("C2", "Cutting", "700 MM", "PE, PP, LD, HD", "Idle"),
    Machine("C3", "Cutting", "1100 MM", "PE, PP, LD, HD", "Idle"),
    Machine("C4", "Cutting", "2700 MM", "PE, PP, LD, HD", "Idle")
]

# --- GLOBAL STATE ---
INVENTORY = {}
JOBS = []
LOGS = []
MACHINES = [] # New List

def save_data():
    data = {
        "inventory": INVENTORY,
        "jobs": [j.to_dict() for j in JOBS],
        "logs": [l.to_dict() for l in LOGS],
        "machines": [m.to_dict() for m in MACHINES] # Save Machine Status
    }
    try:
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=4)
        print("Data saved.")
    except Exception as e:
        print(f"Error saving: {e}")

def load_data():
    global INVENTORY, JOBS, LOGS, MACHINES

    # Default Initial Inventory (if no file exists)
    default_inventory = {
        'HDPE 5712 NP': 5000, 'HDPE(OGA)': 3000, 'CaCO3': 1000,
        'LDPE NATURAL': 8000, 'LDPE RECYCLE': 2000, 'HF0961': 1500,
        'XP 6056RA': 1000, 'EX1999': 1000, 'LLDPE 0209 SA': 2500, 'Slip Agent': 500
    }

    if not os.path.exists(DATA_FILE):
        INVENTORY = default_inventory
        JOBS = []
        LOGS = []
        MACHINES = DEFAULT_MACHINES # Start with default list
        save_data()
        return

    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
            
        INVENTORY = data.get("inventory", default_inventory)
        JOBS = [Job.from_dict(j) for j in data.get("jobs", [])]
        LOGS = [ProductionLog.from_dict(l) for l in data.get("logs", [])]
        
        # Load Machines (or use default if missing in file)
        if "machines" in data:
            MACHINES = [Machine.from_dict(m) for m in data["machines"]]
        else:
            MACHINES = DEFAULT_MACHINES
            
    except Exception as e:
        print(f"Error loading: {e}")
        MACHINES = DEFAULT_MACHINES

# --- AUTO-LOAD ON STARTUP ---
load_data()