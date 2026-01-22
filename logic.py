from database import RECIPES, INVENTORY, JOBS, LOGS, MACHINES, save_data
from models import Job, ProductionLog
import datetime

# ==========================================
# 1. JOB MANAGEMENT (CRUD)
# ==========================================

def add_new_job(job_id, client, product, weight, recipe_code, due_date, width_mm, thickness_mm):
    """
    Validates input and adds a new Job to the database.
    """
    # 1. Validation
    if not (job_id and client and weight and recipe_code):
        raise ValueError("All fields are required.")
    
    # Check for Duplicate ID
    if any(str(j.job_id) == str(job_id) for j in JOBS):
         raise ValueError(f"Job ID {job_id} already exists!")

    try:
        weight_val = float(weight)
        width_val = float(width_mm)
        thick_val = float(thickness_mm)
    except ValueError:
        raise ValueError("Weight, Width, and Thickness must be numbers.")

    # 2. Creation
    new_job = Job(
        str(job_id), 
        client, 
        product, 
        weight_val, 
        recipe_code, 
        due_date, 
        width_val, 
        thick_val
    )
    
    # 3. Persistence
    JOBS.append(new_job)
    save_data()
    return new_job

def delete_job_by_id(job_id):
    """
    Removes a job. Uses slice assignment [:] to update the global list in-place
    so that the GUI sees the changes immediately.
    """
    global JOBS
    new_list = [j for j in JOBS if str(j.job_id) != str(job_id)]
    JOBS[:] = new_list 
    save_data()

def get_job_details(job_id):
    for job in JOBS:
        if str(job.job_id) == str(job_id):
            return job
    return None

# ==========================================
# 2. PRODUCTION & INVENTORY LOGIC
# ==========================================

def submit_daily_log(job_id, date, output_kg, wastage_kg, stage):
    """
    Updated to include Stage tracking and Auto-Completion.
    """
    job = get_job_details(job_id)
    if not job: raise ValueError("Job not found.")
    
    if job.recipe_code not in RECIPES:
        raise ValueError(f"Recipe {job.recipe_code} not found in database.")

    recipe = RECIPES[job.recipe_code]
    
    try:
        out_val = float(output_kg)
        waste_val = float(wastage_kg)
    except ValueError:
        raise ValueError("Output and Wastage must be numbers.")

    # Calculate Material Usage (Only deduct for Extrusion/Blowing to avoid double counting material)
    # Other stages (Cutting/Printing) process existing film, they generate waste but don't consume raw resin.
    materials_used = {}
    
    if stage == "Extrusion":
        total_mass = out_val + waste_val
        for mat, ratio in recipe.materials.items():
            used_qty = round(total_mass * ratio, 2)
            materials_used[mat] = used_qty

        # DEDUCT FROM INVENTORY
        for mat, qty in materials_used.items():
            if mat in INVENTORY: INVENTORY[mat] -= qty
            else: INVENTORY[mat] = -qty 
    else:
        # For non-extrusion stages, we might track 'Film' usage, but for now 
        # let's assume we only track raw material deduction at Extrusion.
        pass 
            
    # Create and Save Log
    log_id = f"LOG-{len(LOGS)+1:04d}"
    new_log = ProductionLog(log_id, date, job_id, out_val, waste_val, materials_used, stage)
    LOGS.append(new_log)
    
    # --- AUTO COMPLETION CHECK ---
    # We update the job status if the *Last Stage* (Packaging) is full.
    # Also set to 'In Progress' if it was Pending.
    
    progress_data = get_job_progress(job_id)
    pkg_total = progress_data['stages']['Packaging']['current']
    
    if pkg_total >= job.weight:
        job.status = "Completed"
    elif job.status == "Pending":
        job.status = "In Progress"

    save_data()
    return new_log

def get_job_progress(job_id):
    """
    Calculates the total output for each stage of a specific job.
    Returns a dict with percentage and raw numbers.
    """
    job = get_job_details(job_id)
    if not job: return {}

    stages = ['Extrusion', 'Printing', 'Cutting', 'Packaging']
    data = {s: {'current': 0.0, 'percent': 0.0} for s in stages}
    
    # Sum up logs
    for log in LOGS:
        if str(log.job_id) == str(job_id):
            if log.stage in data:
                data[log.stage]['current'] += log.output_kg
    
    # Calculate Percentages
    for s in stages:
        curr = data[s]['current']
        if job.weight > 0:
            pct = (curr / job.weight) * 100
        else:
            pct = 0
        data[s]['percent'] = min(pct, 100.0) # Cap at 100% for visual bar
        data[s]['raw_percent'] = pct # Keep real value (e.g. 105%) for text

    return {'job': job, 'stages': data}

def calculate_material_requirements():
    """
    Analyzes all Active Jobs vs Current Stock.
    Returns a report dictionary for the Inventory GUI.
    """
    requirements = {mat: 0 for mat in INVENTORY}
    
    # Sum up all pending job requirements
    for job in JOBS:
        if job.recipe_code in RECIPES:
            recipe = RECIPES[job.recipe_code]
            for mat, ratio in recipe.materials.items():
                qty = job.weight * ratio
                if mat in requirements:
                    requirements[mat] += qty
                else:
                    requirements[mat] = qty # Add new material requirement
    
    # Build Report
    report = {}
    for mat, needed in requirements.items():
        stock = INVENTORY.get(mat, 0)
        available = stock - needed
        
        # Determine Status Tag
        if available < 0:
            status = "CRITICAL" # We don't have enough!
        elif available < 1000:
            status = "LOW"      # Getting close
        else:
            status = "OK"
            
        report[mat] = {
            'needed': round(needed, 1), 
            'stock': round(stock, 1), 
            'available': round(available, 1), 
            'status': status
        }
    return report

def restock_material(material_name, qty):
    if material_name in INVENTORY:
        INVENTORY[material_name] += qty
        save_data()
        return True
    return False

# ==========================================
# 3. MACHINE MANAGEMENT
# ==========================================

def update_machine_status(machine_id, new_status, new_notes):
    for machine in MACHINES:
        if machine.machine_id == machine_id:
            machine.status = new_status
            machine.notes = new_notes
            save_data()
            return True
    return False

# ==========================================
# 4. THE SMART SCHEDULER (The Brain)
# ==========================================

def generate_smart_schedule():
    """
    The Core Algorithm.
    1. Sorts Jobs by Due Date (Earliest Due Date Priority).
    2. Filters Machines based on Physical Constraints (Width, Thickness, Material).
    3. Assigns Jobs to the Machine that finishes SOONEST.
    4. Flags 'Impossible' and 'Late' jobs.
    """
    # 1. Filter & Sort (Ignore Completed)
    pending_jobs = [j for j in JOBS if j.status != "Completed"]
    pending_jobs.sort(key=lambda x: x.due_date)
    
    # 2. Timeline Setup
    machine_timelines = {m.machine_id: datetime.datetime.now() for m in MACHINES}
    schedule_plan = []

    for job in pending_jobs:
        # Get Job Material Type (needed for machine compatibility check)
        if job.recipe_code not in RECIPES:
            # Skip jobs with broken recipes, or flag them
            continue 
            
        job_mat_type = RECIPES[job.recipe_code].material_type

        # --- STEP A: FIND ALL COMPATIBLE MACHINES ---
        valid_machines = []
        for mach in MACHINES:
            # Currently only scheduling Blowing lines automatically
            if mach.machine_type != "Blowing":
                continue
            
            # 1. Status Check (Don't schedule broken machines)
            if mach.status in ["Maintenance", "Breakdown"]:
                continue
            
            # 2. Width Check (Constraint from csv)
            if mach.max_width_mm < job.width_mm:
                continue

            # 3. Thickness Check (Constraint from csv)
            if not (mach.min_thick <= job.thickness_mm <= mach.max_thick):
                continue

            # 4. Material Check
            # If Machine allows "SHEET" or the specific material, it passes.
            # But strict check: HDPE cannot go on LDPE-only machines.
            if job_mat_type == "HDPE" and "HDPE" not in mach.allowed_materials:
                continue
            
            if job_mat_type not in mach.allowed_materials and "SHEET" not in mach.allowed_materials:
                 continue

            valid_machines.append(mach)
        
        # --- STEP B: HANDLE REJECTIONS (No Fit) ---
        if not valid_machines:
            schedule_plan.append({
                "machine": "UNASSIGNED", 
                "job": job.job_id, 
                "client": job.client,
                "start": "-", 
                "end": "-", 
                "hours": "-",
                "status": "IMPOSSIBLE", 
                "note": f"Err: W:{job.width_mm}/T:{job.thickness_mm}/{job_mat_type}"
            })
            continue

        # --- STEP C: OPTIMIZATION (Greedy Heuristic) ---
        best_machine = None
        best_finish_time = datetime.datetime.max
        
        # Find the machine that can finish this job the SOONEST
        for mach in valid_machines:
            current_availability = machine_timelines[mach.machine_id]
            
            # Calculate Duration (Hours = Weight / Speed)
            duration_hours = job.weight / mach.capacity_kg_hr
            finish_time = current_availability + datetime.timedelta(hours=duration_hours)
            
            # Selection Logic:
            # 1. Pick Earliest Finish Time.
            # 2. Tie-Breaker: If times are close, pick the machine with smallest Max Width
            #    (This saves the huge 1700mm machines for jobs that actually need them).
            
            if finish_time < best_finish_time:
                best_finish_time = finish_time
                best_machine = mach
            elif abs((finish_time - best_finish_time).total_seconds()) < 3600:
                # If within 1 hour, check efficiency
                if mach.max_width_mm < best_machine.max_width_mm:
                    best_machine = mach

        # --- STEP D: ASSIGNMENT & TIMING ---
        start = machine_timelines[best_machine.machine_id]
        duration = job.weight / best_machine.capacity_kg_hr
        end = start + datetime.timedelta(hours=duration)
        
        # Update Timeline for next job
        machine_timelines[best_machine.machine_id] = end
        
        # --- STEP E: LATENESS CHECK ---
        try:
            due_dt = datetime.datetime.strptime(job.due_date, "%Y-%m-%d")
            # Compare against End of Due Day (23:59:59)
            due_dt = due_dt.replace(hour=23, minute=59, second=59)
            
            if end > due_dt:
                status = "LATE ⚠️"
                delay = end - due_dt
                if delay.days > 0:
                    note = f"+{delay.days} Days"
                else:
                    note = "Same Day (Late)"
            else:
                status = "On Time"
                note = ""
        except:
            status = "Unknown"
            note = "Date Error"

        # Add to Final Plan
        schedule_plan.append({
            "machine": best_machine.machine_id,
            "job": job.job_id,
            "client": job.client,
            "start": start.strftime("%a %H:%M"),
            "end": end.strftime("%a %H:%M"),
            "hours": round(duration, 1),
            "status": status,
            "note": note,
            "raw_start": start # Helper for filtering "Today"
        })

    # Final Sort: Group by Machine, then by Start Time
    schedule_plan.sort(key=lambda x: (x.get('raw_start', datetime.datetime.max)))
    return schedule_plan

# ==========================================
# 5. DASHBOARD ANALYTICS (NEW)
# ==========================================

def get_dashboard_stats():
    """
    Calculates KPIs for the Dashboard:
    - Previous Day Output
    - Current Week Output (Mon-Sun)
    - Current Month Output
    """
    today = datetime.date.today()
    yesterday = today - datetime.timedelta(days=1)
    
    # Determine start of current week (Monday)
    start_week = today - datetime.timedelta(days=today.weekday())
    
    stats = {
        "yesterday": 0.0,
        "week": 0.0,
        "month": 0.0
    }
    
    for log in LOGS:
        try:
            log_date = datetime.datetime.strptime(log.date, "%Y-%m-%d").date()
        except ValueError:
            continue
            
        # Total output (Good + Waste? Usually Dashboard shows Good Output)
        # Let's show Good Output for value, maybe waste in detailed reports.
        amount = log.output_kg 
        
        if log_date == yesterday:
            stats["yesterday"] += amount
            
        if log_date >= start_week:
            stats["week"] += amount
            
        if log_date.month == today.month and log_date.year == today.year:
            stats["month"] += amount
            
    return stats

def get_todays_target(schedule):
    """
    Estimates the target output for TODAY based on the generated schedule.
    Sum of (Machine Capacity * Scheduled Hours) for jobs starting/running today.
    """
    today_str = datetime.date.today().strftime("%a") # e.g., "Mon"
    total_target = 0.0
    
    for row in schedule:
        # Check if the job is scheduled for today (Simple string check for now)
        # In a real app, we'd use real datetime objects, but our schedule returns strings like "Mon 14:00"
        if today_str in row['start']:
            # We assume the machine runs for the full duration listed in the schedule entry
            # row['hours'] is the duration of the job
            # We need to find the machine capacity
            machine = next((m for m in MACHINES if m.machine_id == row['machine']), None)
            if machine:
                # If duration > 24h, this calculation is rough, but fine for daily dashboard
                hours = min(row['hours'], 24.0) 
                total_target += (machine.capacity_kg_hr * hours)
                
    return total_target