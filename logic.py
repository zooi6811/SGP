from database import RECIPES, INVENTORY, JOBS, LOGS, save_data
from models import ProductionLog
from models import Job

def add_new_job(job_id, client, product, weight, recipe_code, due_date):
    """Validates and adds a job to the database."""
    # Basic Validation
    if not (job_id and client and weight and recipe_code):
        raise ValueError("All fields are required.")
    
    try:
        weight_val = float(weight)
    except ValueError:
        raise ValueError("Weight must be a number.")

    new_job = Job(job_id, client, product, weight_val, recipe_code, due_date)
    JOBS.append(new_job)

    save_data()
    return new_job

def delete_job_by_id(job_id):
    global JOBS
    JOBS = [j for j in JOBS if j.job_id != str(job_id)]

    save_data()

def calculate_material_requirements():
    """Returns dict: {MaterialName: {'needed': kg, 'stock': kg, 'status': str}}"""
    requirements = {mat: 0 for mat in INVENTORY}
    
    # 1. Sum up all needs
    for job in JOBS:
        if job.recipe_code in RECIPES:
            recipe = RECIPES[job.recipe_code]
            for mat, ratio in recipe.materials.items():
                qty = job.weight * ratio
                if mat in requirements:
                    requirements[mat] += qty
                else:
                    requirements[mat] = qty # Handle dynamic materials
    
    # 2. Compare against Stock
    report = {}
    for mat, needed in requirements.items():
        stock = INVENTORY.get(mat, 0)
        available = stock - needed
        
        if available < 0:
            status = "CRITICAL"
        elif available < 500:
            status = "LOW"
        else:
            status = "OK"
            
        report[mat] = {
            'needed': needed,
            'stock': stock,
            'available': available,
            'status': status
        }
        
    return report

def restock_material(material_name, qty):
    if material_name in INVENTORY:
        INVENTORY[material_name] += qty
        save_data()
        return True
    return False

def get_job_details(job_id):
    """Finds a job object by ID."""
    for job in JOBS:
        if job.job_id == str(job_id):
            return job
    return None

def calculate_usage_for_log(job_id, output_kg, wastage_kg):
    """
    Calculates material usage based on TOTAL processed mass (Good + Waste).
    """
    job = get_job_details(job_id)
    if not job: 
        return {}
    
    recipe = RECIPES[job.recipe_code]
    usage = {}
    
    # The machine processed BOTH the good product and the waste
    total_mass = float(output_kg) + float(wastage_kg)
    
    for mat, ratio in recipe.materials.items():
        usage[mat] = round(total_mass * ratio, 2)
        
    return usage

def submit_daily_log(job_id, date, output_kg, wastage_kg):
    """
    1. Calculates usage based on Output + Waste.
    2. Deducts from Inventory.
    3. Returns the Log object.
    """
    # Calculate materials used
    materials_used = calculate_usage_for_log(job_id, output_kg, wastage_kg)
    
    # Deduct from Inventory
    for mat, qty in materials_used.items():
        if mat in INVENTORY:
            INVENTORY[mat] -= qty
        else:
            INVENTORY[mat] = -qty
            
    # Create Log Object
    log_id = f"LOG-{len(LOGS)+1:04d}"
    new_log = ProductionLog(log_id, date, job_id, output_kg, wastage_kg, materials_used)
    LOGS.append(new_log)
    
    save_data()
    return new_log