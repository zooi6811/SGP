from models import Recipe, Job, ProductionLog, Machine
import json
import os

DATA_FILE = "sgp_data.json"

# --- 1. RECIPE CONFIGURATION ---
# The "material_type" field is critical for the Scheduler's compatibility check.
RECIPES = {
    # HDPE Recipes
    'RCP-HD-STD':   Recipe('RCP-HD-STD',   'Standard HDPE Bag',      'HDPE', {'HDPE 5712 NP': 0.50, 'HDPE(OGA)': 0.40, 'CaCO3': 0.10}),
    'RCP-HD-ATLAS': Recipe('RCP-HD-ATLAS', 'Atlas Mix (High Perf)',  'HDPE', {'HF0961': 0.50, 'XP 6056RA': 0.25, 'EX1999': 0.25}),
    'RCP-HD-FR':    Recipe('RCP-HD-FR',    'Fire Retardant Sheet',   'HDPE', {'HDPE 5712': 0.85, 'FR Masterbatch': 0.15}),
    
    # LDPE Recipes
    'RCP-LD-CLR':   Recipe('RCP-LD-CLR',   'Clear LDPE Sheet',       'LDPE', {'LDPE NATURAL': 0.80, 'LDPE RECYCLE': 0.20}),
    'RCP-LD-IND':   Recipe('RCP-LD-IND',   'Industrial Slit Bag',    'LDPE', {'LDPE RECYCLE': 0.50, 'LLDPE 0209 SA': 0.40, 'Slip Agent': 0.10}),
    'RCP-LD-BLK':   Recipe('RCP-LD-BLK',   'Black Garbage Bag',      'LDPE', {'LDPE RECYCLE': 0.90, 'MB BLACK': 0.10})
}

# --- 2. MACHINE CONFIGURATION (Source of Truth) ---
# These specs are transcribed from 'Blowing.csv' and 'Seal Cutting.csv'.
DEFAULT_MACHINES = [
    # --- BLOWING MACHINES (B-Lines) ---
    # B1: Small LDPE, Thin Gauge
    Machine("B1", "Blowing", "650 MM",  ["LDPE"], 0.02, 0.15, "Idle", "Roller 700mm", capacity_kg_hr=120),
    
    # B2: Small LDPE, Thin Gauge
    Machine("B2", "Blowing", "650 MM",  ["LDPE"], 0.02, 0.15, "Idle", "Roller 700mm", capacity_kg_hr=120),
    
    # B3: Medium LDPE, Thin Gauge
    Machine("B3", "Blowing", "1100 MM", ["LDPE"], 0.02, 0.15, "Idle", "Roller 1200mm", capacity_kg_hr=180),
    
    # B4: Wide LDPE, Thin Gauge
    Machine("B4", "Blowing", "1400 MM", ["LDPE"], 0.02, 0.15, "Idle", "Roller 1500mm", capacity_kg_hr=200),
    
    # B5: Wide LDPE/Sheet, Thicker Gauge
    Machine("B5", "Blowing", "1100 MM", ["LDPE", "SHEET", "HDPE"], 0.05, 0.25, "Idle", "Printing Line Capable", capacity_kg_hr=180),
    
    # B6: Extra Wide, Thicker Gauge
    Machine("B6", "Blowing", "1700 MM", ["LDPE", "SHEET", "HDPE"], 0.05, 0.25, "Idle", "High Output", capacity_kg_hr=250),
    
    # B7: Extra Wide, Thicker Gauge (Workhorse)
    Machine("B7", "Blowing", "1700 MM", ["LDPE", "SHEET", "HDPE"], 0.05, 0.25, "Idle", "High Output", capacity_kg_hr=300),
    
    # --- CUTTING MACHINES (C-Lines) ---
    # C1-C4 handle finishing. Capacities are estimated based on 'cuts per minute' conversion to kg.
    Machine("C1", "Cutting", "900 MM",  ["HDPE", "LDPE", "PP"], 0.01, 1.0, "Idle", "Seal Temp 30-230C", capacity_kg_hr=100),
    Machine("C2", "Cutting", "700 MM",  ["HDPE", "LDPE", "PP"], 0.01, 1.0, "Idle", "Seal Temp 30-230C", capacity_kg_hr=100),
    Machine("C3", "Cutting", "1100 MM", ["HDPE", "LDPE", "PP"], 0.01, 1.0, "Idle", "Seal Temp 30-230C", capacity_kg_hr=150),
    Machine("C4", "Cutting", "2700 MM", ["HDPE", "LDPE", "PP"], 0.01, 1.0, "Idle", "Heavy Duty", capacity_kg_hr=200)
]

# --- 3. GLOBAL STATE VARIABLES ---
INVENTORY = {}
JOBS = []
LOGS = []
MACHINES = [] 

# --- 4. PERSISTENCE ENGINE ---

def save_data():
    """Serializes all objects and writes to JSON."""
    data = {
        "inventory": INVENTORY,
        "jobs": [j.to_dict() for j in JOBS],
        "logs": [l.to_dict() for l in LOGS],
        "machines": [m.to_dict() for m in MACHINES]
    }
    try:
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=4)
        # print("Data saved.") # Uncomment for debugging
    except Exception as e:
        print(f"Error saving data: {e}")

def load_data():
    """Reads JSON and repopulates global variables."""
    global INVENTORY, JOBS, LOGS, MACHINES
    
    # Default Inventory (If starting fresh)
    default_inventory = {
        'HDPE 5712 NP': 10000.0,
        'HDPE(OGA)': 5000.0,
        'CaCO3': 1000.0,
        'LDPE NATURAL': 10000.0,
        'LDPE RECYCLE': 5000.0,
        'HF0961': 2000.0,
        'XP 6056RA': 1000.0,
        'EX1999': 1000.0,
        'LLDPE 0209 SA': 5000.0,
        'Slip Agent': 200.0,
        'FR Masterbatch': 200.0,
        'MB BLACK': 500.0
    }

    if not os.path.exists(DATA_FILE):
        print("Initializing new database...")
        INVENTORY = default_inventory
        JOBS = []
        LOGS = []
        MACHINES = DEFAULT_MACHINES # Use hardcoded specs
        save_data()
        return

    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
            
        INVENTORY = data.get("inventory", default_inventory)
        
        # Reconstruct Objects using .from_dict()
        JOBS = [Job.from_dict(j) for j in data.get("jobs", [])]
        LOGS = [ProductionLog.from_dict(l) for l in data.get("logs", [])]
        
        # Load Machines - IMPORTANT:
        # If the JSON has machines, use them (to keep status updates).
        # If the JSON machine list is empty (e.g., user cleared it), restore Defaults.
        loaded_machines = data.get("machines", [])
        if not loaded_machines:
            MACHINES = DEFAULT_MACHINES
        else:
            MACHINES = [Machine.from_dict(m) for m in loaded_machines]
            
        print(f"System Loaded: {len(JOBS)} Jobs, {len(MACHINES)} Machines.")
            
    except Exception as e:
        print(f"CRITICAL ERROR LOADING DATA: {e}")
        print("Restoring defaults to prevent crash...")
        INVENTORY = default_inventory
        JOBS = []
        LOGS = []
        MACHINES = DEFAULT_MACHINES

# Auto-load on import
load_data()